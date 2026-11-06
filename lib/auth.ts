import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

export const roles = ["Admin", "Customer", "Kasir", "Owner"] as const;
export type UserRole = (typeof roles)[number];

export type Session = {
  userId: string;
  profileId: string;
  username: string;
  role: UserRole;
  name: string;
  expiresAt: number;
};

const scrypt = promisify(scryptCallback);
const cookieName = "amalaku_session";
const sessionLifetime = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }
  return secret;
}

export function assertSessionConfig() {
  sessionSecret();
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function readCookie(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));
  return cookie ? cookie.slice(cookieName.length + 1) : null;
}

export function createSession(
  user: Omit<Session, "expiresAt">,
): Session {
  return { ...user, expiresAt: Math.floor(Date.now() / 1000) + sessionLifetime };
}

export function sessionCookie(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionLifetime}${secure}`;
}

export function clearedSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function getSession(request: Request): Session | null {
  const token = readCookie(request);
  if (!token) return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const session: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (
      typeof session !== "object" ||
      session === null ||
      !("userId" in session) ||
      !("profileId" in session) ||
      !("username" in session) ||
      !("role" in session) ||
      !("name" in session) ||
      !("expiresAt" in session)
    ) {
      return null;
    }

    const value = session as Session;
    if (
      typeof value.userId !== "string" ||
      typeof value.profileId !== "string" ||
      typeof value.username !== "string" ||
      typeof value.name !== "string" ||
      !roles.includes(value.role) ||
      typeof value.expiresAt !== "number" ||
      value.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, expectedHex, extra] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex || extra) {
    const submitted = Buffer.from(password);
    const expected = Buffer.from(stored);
    return (
      submitted.length === expected.length &&
      timingSafeEqual(submitted, expected)
    );
  }

  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
