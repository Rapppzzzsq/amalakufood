import { randomBytes } from "node:crypto";

export function createId(prefix: string, randomLength = 8) {
  const suffix = randomBytes(9).toString("base64url").slice(0, randomLength);
  return `${prefix}${suffix}`;
}
