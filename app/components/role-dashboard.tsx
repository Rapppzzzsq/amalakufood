"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6

type Role = "Customer" | "Admin" | "Kasir" | "Owner";
type Profile = Record<string, string | number | null>;
type User = { username: string; role: Role; profile: Profile };
type Product = {
  id_produk: string;
  nama_produk: string;
  kategori: string;
  harga: number | string;
  stok: number;
  deskripsi: string | null;
};
type Customer = {
  id_customer: string;
  nama_customer: string;
  no_handphone: string;
  email_customer: string;
  poin: number;
  jalan: string | null;
  kota: string | null;
  pengguna: { username: string };
  _count?: { pesanan: number };
};
type Order = {
  id_pesanan: string;
  tanggal_pesanan: string;
  status_pesanan: string;
  total_tagihan: number | string;
  customer: { id_customer: string; nama_customer: string };
  pembayaran: {
    metode_pembayaran: string;
    status_pembayaran: string;
    nota: { no_nota: string } | null;
  } | null;
  detail_pesanan: Array<{
    jumlah: number;
    subtotal: number | string;
    produk: { nama_produk: string };
  }>;
};
type Evaluation = {
  id_laporan_owner: string;
  catatan_evaluasi: string;
  status_persetujuan: string;
};
type Report = {
  id_laporan_kasir: string;
  jenis_laporan: string;
  periode_awal: string;
  periode_akhir: string;
  jumlah_produk: number | null;
  total_stok: number | null;
  jumlah_transaksi: number | null;
  total_penjualan: number | string;
  status_penjualan: string;
  kasir?: { nama_kasir: string };
  laporan_owner: Evaluation[];
};

type Section =
  | "Beranda"
  | "Katalog"
  | "Keranjang"
  | "Riwayat"
  | "Profil"
  | "Data Produk"
  | "Data Customer"
  | "Transaksi Pemesanan"
  | "Validasi Pembayaran"
  | "Bukti Pembayaran"
  | "Laporan Stok"
  | "Laporan Penjualan"
  | "Rekap Laporan Penjualan"
  | "Rekap Laporan Stok"
  | "Evaluasi Laporan"
  | "Data Produk & Stok";

type DashboardData = {
  user: User;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  reports: Report[];
  summary: Record<string, number>;
};

<<<<<<< HEAD
type DemoStore = {
  user?: User;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  reports: Report[];
};

const demoStorageKey = "amalakufood-demo-data";
let demoModeActive = false;

function createDemoStore(): DemoStore {
  const customers: Customer[] = [
    { id_customer: "C001", nama_customer: "Nurul Janatul Taqwa", no_handphone: "083191246035", email_customer: "nuruljanatultaqwa214@gmail.com", poin: 10, jalan: "Jl. Niaga No. 12", kota: "Padang", pengguna: { username: "nurul" }, _count: { pesanan: 1 } },
    { id_customer: "C002", nama_customer: "Rafli Raf Sanjani", no_handphone: "082182062598", email_customer: "raflirafsanjani991@gmail.com", poin: 15, jalan: "Jl. Jati Adabiah No. 15", kota: "Padang", pengguna: { username: "rafli" }, _count: { pesanan: 1 } },
    { id_customer: "C003", nama_customer: "Azzahra Sifa Ahmad", no_handphone: "082174291590", email_customer: "azzara.sipaamad312@gmail.com", poin: 5, jalan: "Jl. Gajah Mada No. 21", kota: "Padang", pengguna: { username: "zahra" }, _count: { pesanan: 1 } },
  ];
  const products: Product[] = [
    { id_produk: "P001", nama_produk: "Bolu Tapai", kategori: "Bolu", harga: 45000, stok: 12, deskripsi: "Bolu tapai khas Minang dengan tekstur lembut dan rasa manis alami, dibuat segar setiap hari." },
    { id_produk: "P002", nama_produk: "Brownies Kukus", kategori: "Brownies", harga: 55000, stok: 3, deskripsi: "Brownies kukus cokelat pekat dengan tekstur lembut dan lumer di mulut." },
    { id_produk: "P003", nama_produk: "Bolu Pisang", kategori: "Bolu", harga: 45000, stok: 8, deskripsi: "Bolu pisang panggang beraroma harum dengan potongan pisang asli pilihan." },
    { id_produk: "P004", nama_produk: "Brownies Pisang", kategori: "Brownies", harga: 55000, stok: 0, deskripsi: "Perpaduan brownies cokelat dan manisnya pisang segar khas Toko Kue Amala." },
    { id_produk: "P005", nama_produk: "Bolu Cokelat", kategori: "Bolu", harga: 50000, stok: 20, deskripsi: "Bolu cokelat klasik favorit keluarga dengan taburan choco chips." },
  ];
  const orders: Order[] = [
    { id_pesanan: "PS001", tanggal_pesanan: "2026-10-17", status_pesanan: "Diproses", total_tagihan: 90000, customer: { id_customer: "C001", nama_customer: customers[0].nama_customer }, pembayaran: { metode_pembayaran: "QRIS", status_pembayaran: "Berhasil", nota: { no_nota: "NT001" } }, detail_pesanan: [{ jumlah: 1, subtotal: 50000, produk: { nama_produk: "Bolu Cokelat" } }, { jumlah: 1, subtotal: 40000, produk: { nama_produk: "Bolu Keju" } }] },
    { id_pesanan: "PS002", tanggal_pesanan: "2026-10-17", status_pesanan: "Diproses", total_tagihan: 45000, customer: { id_customer: "C002", nama_customer: customers[1].nama_customer }, pembayaran: { metode_pembayaran: "Transfer Bank", status_pembayaran: "Berhasil", nota: { no_nota: "NT002" } }, detail_pesanan: [{ jumlah: 1, subtotal: 45000, produk: { nama_produk: "Bolu Tapai" } }] },
    { id_pesanan: "PS004", tanggal_pesanan: "2026-10-18", status_pesanan: "Diproses", total_tagihan: 55000, customer: { id_customer: "C003", nama_customer: customers[2].nama_customer }, pembayaran: { metode_pembayaran: "QRIS", status_pembayaran: "Menunggu", nota: null }, detail_pesanan: [{ jumlah: 1, subtotal: 55000, produk: { nama_produk: "Brownies Kukus" } }] },
  ];
  const reports: Report[] = [
    { id_laporan_kasir: "LK001", jenis_laporan: "Penjualan", periode_awal: "2026-10-17", periode_akhir: "2026-10-18", jumlah_produk: 8, total_stok: 100, jumlah_transaksi: 5, total_penjualan: 275000, status_penjualan: "Menunggu Pemeriksaan", kasir: { nama_kasir: "Kasir Amala" }, laporan_owner: [{ id_laporan_owner: "LO001", catatan_evaluasi: "Pemeriksaan laporan penjualan periode 17-18 Oktober 2026", status_persetujuan: "Disetujui" }] },
    { id_laporan_kasir: "RP-001", jenis_laporan: "Penjualan", periode_awal: "2026-10-01", periode_akhir: "2026-10-31", jumlah_produk: 8, total_stok: 35, jumlah_transaksi: 70, total_penjualan: 3150000, status_penjualan: "Disetujui", kasir: { nama_kasir: "Kasir Amala" }, laporan_owner: [{ id_laporan_owner: "EV-001", catatan_evaluasi: "Penjualan Brownies Naik, Tambah Produk Brownies", status_persetujuan: "Disetujui" }] },
    { id_laporan_kasir: "RS-001", jenis_laporan: "Stok", periode_awal: "2026-10-01", periode_akhir: "2026-10-31", jumlah_produk: 8, total_stok: 100, jumlah_transaksi: 0, total_penjualan: 0, status_penjualan: "Disetujui", kasir: { nama_kasir: "Kasir Amala" }, laporan_owner: [{ id_laporan_owner: "EV-002", catatan_evaluasi: "Periksa kembali persediaan produk brownies.", status_persetujuan: "Disetujui" }] },
  ];
  return { products, customers, orders, reports };
}

function readDemoStore(): DemoStore {
  const saved = localStorage.getItem(demoStorageKey);
  if (!saved) {
    const initial = createDemoStore();
    addRegisteredDemoCustomer(initial);
    writeDemoStore(initial);
    return initial;
  }

  try {
    const store = JSON.parse(saved) as DemoStore;
    addRegisteredDemoCustomer(store);
    return store;
  } catch {
    throw new Error("Data mode demo rusak. Hapus data situs lalu muat ulang.");
  }
}

function addRegisteredDemoCustomer(store: DemoStore) {
  const savedProfile = localStorage.getItem("amalakufood-demo-profile");
  if (!savedProfile) return;
  const user = JSON.parse(savedProfile) as User;
  if (
    user.role !== "Customer" ||
    typeof user.profile.id_customer !== "string" ||
    store.customers.some((customer) => customer.id_customer === user.profile.id_customer)
  ) return;
  store.customers.push({
    id_customer: user.profile.id_customer,
    nama_customer: String(user.profile.nama_customer ?? ""),
    no_handphone: String(user.profile.no_handphone ?? ""),
    email_customer: String(user.profile.email_customer ?? ""),
    poin: 0,
    jalan: String(user.profile.jalan ?? ""),
    kota: "Padang",
    pengguna: { username: user.username },
    _count: { pesanan: 0 },
  });
}

function writeDemoStore(store: DemoStore) {
  localStorage.setItem(demoStorageKey, JSON.stringify(store));
}

function demoProfile(role: Role, store: DemoStore): User {
  if (store.user?.role === role) return store.user;
  if (role === "Customer") {
    const registeredProfile = localStorage.getItem("amalakufood-demo-profile");
    if (registeredProfile) {
      const user = JSON.parse(registeredProfile) as User;
      if (user.role === role) return user;
    }
  }
  const profiles: Record<Role, Profile> = {
    Customer: { id_customer: "C001", nama_customer: "Nurul Janatul Taqwa", no_handphone: "083191246035", email_customer: "nuruljanatultaqwa214@gmail.com", poin: 10, jalan: "Jl. Niaga No. 12" },
    Admin: { id_admin: "ADM001", nama_admin: "Admin Amala", no_handphone: "081234567801", email_admin: "adminboluamala@gmail.com" },
    Kasir: { id_kasir: "KSR001", nama_kasir: "Kasir Amala", no_handphone: "0812343287802", email_kasir: "kasirboluamala@gmail.com" },
    Owner: { id_owner: "OWN001", nama_owner: "Owner Amala", no_handphone: "081234967803", email_owner: "owner@boluamala.com" },
  };
  return { role, username: role === "Customer" ? "nurul" : role.toLowerCase(), profile: profiles[role] };
}

function demoApiRequest<T>(url: string, init?: RequestInit): T {
  const parsedUrl = new URL(url, window.location.origin);
  const path = parsedUrl.pathname;
  const method = init?.method ?? "GET";
  const payload = init?.body ? JSON.parse(String(init.body)) as Record<string, unknown> : {};
  const store = readDemoStore();
  const save = () => writeDemoStore(store);

  if (path === "/api/auth") {
    if (method === "GET") {
      const requestedRole = parsedUrl.searchParams.get("role");
      const sessionRole = localStorage.getItem("amalakufood-demo-role");
      const role = sessionRole ?? requestedRole;
      if (!role || !isDashboardRole(role)) throw new Error("Sesi tidak valid. Silakan masuk kembali.");
      return { user: demoProfile(role, store) } as T;
    }
    if (method === "DELETE") {
      localStorage.removeItem("amalakufood-demo-role");
      localStorage.removeItem("amalakufood-demo-mode");
      localStorage.removeItem("amalakufood-session");
      return { ok: true } as T;
    }
    if (method === "POST") {
      if (payload.action === "register") {
        const username = String(payload.username ?? "");
        if (store.customers.some((customer) => customer.pengguna.username === username)) {
          throw new Error("Username sudah digunakan.");
        }
        const id = `C${String(store.customers.length + 1).padStart(3, "0")}`;
        store.customers.push({
          id_customer: id,
          nama_customer: String(payload.nama_customer ?? ""),
          no_handphone: String(payload.no_handphone ?? ""),
          email_customer: String(payload.email_customer ?? ""),
          poin: 0,
          jalan: String(payload.alamat ?? ""),
          kota: "Padang",
          pengguna: { username },
          _count: { pesanan: 0 },
        });
        save();
        return { user: { id_customer: id } } as T;
      }

      const role = String(payload.role ?? "");
      if (!isDashboardRole(role)) throw new Error("Role tidak dikenal.");
      localStorage.setItem("amalakufood-demo-role", role);
      store.user = { ...demoProfile(role, store), username: String(payload.username ?? role.toLowerCase()) };
      save();
      return { user: store.user } as T;
    }
  }

  if (path === "/api/produk") {
    if (method === "GET") {
      const search = (parsedUrl.searchParams.get("search") ?? "").toLowerCase();
      const kategori = parsedUrl.searchParams.get("kategori");
      return { products: store.products.filter((product) => (!kategori || product.kategori === kategori) && product.nama_produk.toLowerCase().includes(search)) } as T;
    }
    if (method === "POST") {
      const id = `P${String(Date.now()).slice(-6)}`;
      store.products.push({ id_produk: id, nama_produk: String(payload.nama_produk), kategori: String(payload.kategori), harga: Number(payload.harga), stok: Number(payload.stok), deskripsi: String(payload.deskripsi ?? "") });
    } else if (method === "PUT" || method === "PATCH") {
      const product = store.products.find((entry) => entry.id_produk === payload.id_produk);
      if (!product) throw new Error("Produk tidak ditemukan.");
      Object.assign(product, payload);
    } else if (method === "DELETE") {
      store.products = store.products.filter((entry) => entry.id_produk !== payload.id_produk);
    }
    save();
    return { ok: true } as T;
  }

  if (path === "/api/customer") {
    if (method === "GET") return { customers: store.customers } as T;
    const customer = store.customers.find((entry) => entry.id_customer === payload.id_customer);
    if (method !== "DELETE" && !customer) throw new Error("Customer tidak ditemukan.");
    if (method === "DELETE") store.customers = store.customers.filter((entry) => entry.id_customer !== payload.id_customer);
    else if (method === "PATCH" && customer) customer.poin = Number(payload.poin);
    else if (customer) {
      Object.assign(customer, payload);
      if (store.user?.profile.id_customer === customer.id_customer) {
        Object.assign(store.user.profile, payload);
      }
      const savedProfile = localStorage.getItem("amalakufood-demo-profile");
      if (savedProfile) {
        const user = JSON.parse(savedProfile) as User;
        if (user.profile.id_customer === customer.id_customer) {
          Object.assign(user.profile, payload);
          localStorage.setItem("amalakufood-demo-profile", JSON.stringify(user));
        }
      }
    }
    save();
    return { ok: true } as T;
  }

  if (path === "/api/pesanan") {
    if (method === "GET") {
      const currentRole = localStorage.getItem("amalakufood-demo-role");
      const session = localStorage.getItem("amalakufood-session");
      const customerId = currentRole === "Customer" && session
        ? (JSON.parse(session) as { id?: string }).id
        : undefined;
      const orders = customerId
        ? store.orders.filter((order) => order.customer.id_customer === customerId)
        : store.orders;
      return {
        orders,
        summary: {
          jumlah_transaksi: orders.length,
          total_penjualan: orders.reduce((sum, order) => sum + Number(order.total_tagihan), 0),
          stok_menipis: store.products.filter((product) => product.stok < 5).length,
          jumlah_customer: store.customers.length,
        },
      } as T;
    }
    if (method === "POST") {
      const items = Array.isArray(payload.items) ? payload.items as Array<{ id_produk: string; jumlah: number }> : [];
      const details = items.map((item) => {
        const product = store.products.find((entry) => entry.id_produk === item.id_produk);
        if (!product || item.jumlah < 1 || item.jumlah > product.stok) throw new Error("Jumlah pesanan melebihi stok tersedia.");
        product.stok -= item.jumlah;
        return { jumlah: item.jumlah, subtotal: Number(product.harga) * item.jumlah, produk: { nama_produk: product.nama_produk } };
      });
      const id = `PS${String(Date.now()).slice(-6)}`;
      const currentUser = demoProfile("Customer", store);
      const order: Order = { id_pesanan: id, tanggal_pesanan: new Date().toISOString(), status_pesanan: "Diproses", total_tagihan: details.reduce((sum, item) => sum + Number(item.subtotal), 0), customer: { id_customer: String(currentUser.profile.id_customer), nama_customer: String(currentUser.profile.nama_customer) }, pembayaran: { metode_pembayaran: String(payload.metode_pembayaran), status_pembayaran: "Menunggu", nota: null }, detail_pesanan: details };
      store.orders.unshift(order);
      save();
      return { order } as T;
    }
    const order = store.orders.find((entry) => entry.id_pesanan === payload.id_pesanan);
    if (!order) throw new Error("Pesanan tidak ditemukan.");
    if (method === "PATCH") {
      if (typeof payload.status_pesanan === "string") order.status_pesanan = payload.status_pesanan;
      if (typeof payload.status_pembayaran === "string" && order.pembayaran) {
        order.pembayaran.status_pembayaran = payload.status_pembayaran;
        if (payload.status_pembayaran === "Berhasil") order.pembayaran.nota = { no_nota: `NT${order.id_pesanan.slice(-6)}` };
      }
    } else if (method === "DELETE") {
      for (const item of order.detail_pesanan) {
        const product = store.products.find(
          (entry) => entry.nama_produk === item.produk.nama_produk,
        );
        if (product) product.stok += item.jumlah;
      }
      store.orders = store.orders.filter((entry) => entry.id_pesanan !== order.id_pesanan);
    }
    save();
    return { ok: true } as T;
  }

  if (path === "/api/laporan") {
    if (method === "GET") return { reports: store.reports, summary: {} } as T;
    if (method === "POST" && typeof payload.catatan_evaluasi === "string") {
      const report = store.reports.find((entry) => entry.id_laporan_kasir === payload.id_laporan_kasir);
      if (!report) throw new Error("Laporan tidak ditemukan.");
      report.laporan_owner.push({ id_laporan_owner: `EV-${String(Date.now()).slice(-3)}`, catatan_evaluasi: payload.catatan_evaluasi, status_persetujuan: "Menunggu" });
    } else if (method === "POST") {
      store.reports.unshift({ id_laporan_kasir: `${payload.jenis_laporan === "Stok" ? "RS" : "RP"}-${String(Date.now()).slice(-3)}`, jenis_laporan: String(payload.jenis_laporan), periode_awal: String(payload.periode_awal), periode_akhir: String(payload.periode_akhir), jumlah_produk: store.products.length, total_stok: store.products.reduce((sum, product) => sum + product.stok, 0), jumlah_transaksi: store.orders.length, total_penjualan: store.orders.reduce((sum, order) => sum + Number(order.total_tagihan), 0), status_penjualan: "Menunggu Pemeriksaan", laporan_owner: [] });
    } else if (method === "PUT" && typeof payload.id_laporan_owner === "string") {
      const evaluation = store.reports
        .flatMap((report) => report.laporan_owner)
        .find((entry) => entry.id_laporan_owner === payload.id_laporan_owner);
      if (!evaluation) throw new Error("Evaluasi tidak ditemukan.");
      evaluation.catatan_evaluasi = String(payload.catatan_evaluasi ?? "");
    } else if (method === "DELETE" && typeof payload.id_laporan_owner === "string") {
      for (const report of store.reports) {
        report.laporan_owner = report.laporan_owner.filter(
          (entry) => entry.id_laporan_owner !== payload.id_laporan_owner,
        );
      }
    } else {
      const report = store.reports.find((entry) => entry.id_laporan_kasir === payload.id_laporan_kasir);
      if (!report) throw new Error("Laporan tidak ditemukan.");
      if (method === "PUT") Object.assign(report, payload);
      if (method === "PATCH") {
        report.status_penjualan = "Disetujui";
        for (const evaluation of report.laporan_owner) {
          evaluation.status_persetujuan = "Disetujui";
        }
      }
      if (method === "DELETE") store.reports = store.reports.filter((entry) => entry.id_laporan_kasir !== payload.id_laporan_kasir);
    }
    save();
    return { ok: true } as T;
  }

  throw new Error(`Mode demo belum mendukung ${method} ${path}.`);
}

function isDashboardRole(value: string): value is Role {
  return value === "Customer" || value === "Admin" || value === "Kasir" || value === "Owner";
}

=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
<<<<<<< HEAD
  if (response.status === 404 && url.startsWith("/api/")) {
    demoModeActive = true;
    return demoApiRequest<T>(url, init);
  }
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "Permintaan gagal.";
    throw new Error(message);
  }
  return result as T;
}

function rupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function Modal({
  title,
  onClose,
  children,
<<<<<<< HEAD
  danger = false,
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
<<<<<<< HEAD
  danger?: boolean;
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32180dcc] p-4">
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
<<<<<<< HEAD
        className={`w-full max-w-lg rounded-3xl border-4 ${danger ? "border-[#dc2626]" : "border-[#f5c518]"} bg-white p-6 shadow-2xl`}
=======
        className="w-full max-w-lg rounded-3xl border-4 border-[#f5c518] bg-white p-6 shadow-2xl"
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-extrabold text-[#5c2c16]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-2xl text-[#5c2c16] hover:bg-[#fdf6e2]"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="rounded-xl border border-[#d8c49b] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#c39800] focus:ring-2 focus:ring-[#f5c51866]"
      />
    </label>
  );
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-[#f5c518] px-4 py-2.5 font-bold text-[#5c2c16] transition hover:bg-[#ffd233] disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export default function RoleDashboard({ role }: { role: Role }) {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
<<<<<<< HEAD
  const [demoMode, setDemoMode] = useState(false);
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
  const [section, setSection] = useState<Section>("Beranda");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [productFilter, setProductFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [checkoutId, setCheckoutId] = useState("");
  const [cartLoadedFor, setCartLoadedFor] = useState("");
  const [modal, setModal] = useState<ReactNode>(null);

  const loadData = async (activeRole: Role) => {
    const auth = await requestJson<{ user: User }>("/api/auth");
    if (auth.user.role !== activeRole) {
      router.replace(`/login?role=${activeRole}`);
      return null;
    }

    const productsPromise = requestJson<{ products: Product[] }>("/api/produk");
    const emptyCustomers: { customers: Customer[] } = { customers: [] };
    const emptyOrders: { orders: Order[]; summary: Record<string, number> } = {
      orders: [],
      summary: {},
    };
    const emptyReports: { reports: Report[]; summary: Record<string, number> } = {
      reports: [],
      summary: {},
    };
    const [productsResult, customerResult, orderResult, reportResult] =
      await Promise.all([
        productsPromise,
        activeRole === "Admin" || activeRole === "Owner"
          ? requestJson<{ customers: Customer[] }>("/api/customer")
          : Promise.resolve(emptyCustomers),
        activeRole === "Customer" || activeRole === "Kasir" || activeRole === "Owner"
          ? requestJson<{ orders: Order[]; summary: Record<string, number> }>("/api/pesanan")
          : Promise.resolve(emptyOrders),
        activeRole === "Kasir" || activeRole === "Owner"
          ? requestJson<{ reports: Report[]; summary: Record<string, number> }>("/api/laporan")
          : Promise.resolve(emptyReports),
      ]);
    return {
      user: auth.user,
      products: productsResult.products,
      customers: customerResult.customers,
      orders: orderResult.orders,
      reports: reportResult.reports,
      summary: orderResult.summary,
    };
  };

  const refresh = async () => {
    try {
      const next = await loadData(role);
<<<<<<< HEAD
      setDemoMode(demoModeActive || localStorage.getItem("amalakufood-demo-mode") === "true");
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
      if (next) {
        setData(next);
        const street = next.user.profile.jalan;
        if (typeof street === "string") setAddress(street);
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Data gagal dimuat.";
<<<<<<< HEAD
      setDemoMode(demoModeActive || localStorage.getItem("amalakufood-demo-mode") === "true");
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
      if (message.includes("Sesi tidak valid")) {
        router.replace(`/login?role=${role}`);
        return;
      }
      setError(message);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(refresh);
    // Load the dashboard once for the selected role.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    const customerId = data?.user.profile.id_customer;
    if (role !== "Customer" || typeof customerId !== "string") return;
    void Promise.resolve().then(() => {
      try {
        const saved = localStorage.getItem(`amalaku-cart-${customerId}`);
        if (saved) setCart(JSON.parse(saved) as Record<string, number>);
      } catch {
        setCart({});
      }
      setCartLoadedFor(customerId);
    });
  }, [data?.user.profile.id_customer, role]);

  useEffect(() => {
    const customerId = data?.user.profile.id_customer;
    if (
      role === "Customer" &&
      typeof customerId === "string" &&
      cartLoadedFor === customerId
    ) {
      localStorage.setItem(`amalaku-cart-${customerId}`, JSON.stringify(cart));
    }
  }, [cart, cartLoadedFor, data?.user.profile.id_customer, role]);

  const products = useMemo(() => data?.products ?? [], [data]);
  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (productFilter === "Semua" || product.kategori === productFilter) &&
          product.nama_produk.toLowerCase().includes(search.toLowerCase()),
      ),
    [productFilter, products, search],
  );

  const runAction = async (
    action: () => Promise<void>,
    successMessage?: string,
  ) => {
    setBusy(true);
    setError("");
    try {
      await action();
      if (successMessage) setNotice(successMessage);
      setModal(null);
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Permintaan gagal.");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    setModal(
      <Modal title="Ingin Keluar?" onClose={() => setModal(null)}>
        <p className="mb-5 text-[#5c2c16]">Anda yakin ingin keluar dari Amalakufood?</p>
        <div className="flex justify-end gap-3">
          <PrimaryButton type="button" onClick={() => setModal(null)}>Tidak</PrimaryButton>
          <button
            type="button"
            onClick={() => {
              setBusy(true);
              void requestJson("/api/auth", { method: "DELETE" })
                .then(() => router.push("/"))
                .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Gagal keluar."))
                .finally(() => setBusy(false));
            }}
            className="rounded-xl bg-[#dc2626] px-4 py-2.5 font-bold text-white"
          >
            Ya, Keluar
          </button>
        </div>
      </Modal>,
    );
  };

  const navItems: Section[] =
    role === "Customer"
      ? ["Beranda", "Katalog", "Riwayat"]
      : role === "Admin"
        ? ["Beranda", "Data Produk", "Data Customer"]
        : role === "Kasir"
          ? [
              "Beranda",
              "Transaksi Pemesanan",
              "Validasi Pembayaran",
              "Bukti Pembayaran",
              "Laporan Stok",
              "Laporan Penjualan",
            ]
          : [
              "Beranda",
              "Rekap Laporan Penjualan",
              "Rekap Laporan Stok",
              "Evaluasi Laporan",
              "Data Produk & Stok",
              "Data Customer",
            ];

  const cartEntries = products.filter((product) => (cart[product.id_produk] ?? 0) > 0);
  const cartTotal = cartEntries.reduce(
    (total, product) => total + Number(product.harga) * cart[product.id_produk],
    0,
  );

  const changeCart = (id: string, delta: number) => {
    const product = products.find((entry) => entry.id_produk === id);
    setCart((current) => {
      const nextQuantity = (current[id] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      if (product && nextQuantity > product.stok) return current;
      return { ...current, [id]: nextQuantity };
    });
  };

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAction(async () => {
      const result = await requestJson<{ order: Order }>("/api/pesanan", {
        method: "POST",
        body: JSON.stringify({
          items: cartEntries.map((product) => ({
            id_produk: product.id_produk,
            jumlah: cart[product.id_produk],
          })),
          alamat: address,
          metode_pembayaran: paymentMethod,
        }),
      });
      setCheckoutId(result.order.id_pesanan);
      setSection("Keranjang");
    });
  };

  const submitForm = (
    event: FormEvent<HTMLFormElement>,
    callback: (values: FormData) => Promise<void>,
    success?: string,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void runAction(() => callback(formData), success);
  };

  const createProductForm = (product?: Product) => (
    <form
      className="grid gap-3"
      onSubmit={(event) =>
        submitForm(event, async (values) => {
          const payload = {
            ...(product ? { id_produk: product.id_produk } : {}),
            nama_produk: String(values.get("nama_produk") ?? ""),
            kategori: String(values.get("kategori") ?? ""),
            harga: Number(values.get("harga")),
            stok: Number(values.get("stok")),
            deskripsi: String(values.get("deskripsi") ?? ""),
          };
          await requestJson("/api/produk", {
            method: product ? "PUT" : "POST",
            body: JSON.stringify(payload),
          });
        }, product ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.")
      }
    >
      <Field label="Nama Produk" name="nama_produk" defaultValue={product?.nama_produk} required />
      <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
        Kategori
        <select
          name="kategori"
          defaultValue={product?.kategori ?? "Bolu"}
          className="rounded-xl border border-[#d8c49b] bg-white px-3 py-2.5"
        >
          <option>Bolu</option><option>Brownies</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Harga (Rp)" name="harga" type="number" defaultValue={product?.harga} required />
        <Field label="Stok" name="stok" type="number" defaultValue={product?.stok ?? 0} required />
      </div>
      <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
        Deskripsi
        <textarea
          name="deskripsi"
          defaultValue={product?.deskripsi ?? ""}
          className="rounded-xl border border-[#d8c49b] bg-white px-3 py-2.5"
          rows={3}
        />
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setModal(null)} className="rounded-xl border px-4 py-2">Batal</button>
        <PrimaryButton disabled={busy}>{product ? "Simpan Perubahan" : "Tambah Produk"}</PrimaryButton>
      </div>
    </form>
  );

  const productCard = (product: Product, editable: boolean) => (
    <article key={product.id_produk} className="overflow-hidden rounded-2xl border border-[#eadcb8] bg-white shadow-sm">
      <button
        type="button"
        className="flex h-36 w-full items-center justify-center bg-[#fff0ba] text-7xl"
        onClick={() => {
          setSelectedProduct(product);
          setQuantity(1);
        }}
        aria-label={`Lihat ${product.nama_produk}`}
      >
        {product.kategori === "Brownies" ? "🍫" : "🍰"}
      </button>
      <div className="p-4">
        <span className="rounded-full bg-[#fff0ba] px-2.5 py-1 text-xs font-bold text-[#5c2c16]">{product.kategori}</span>
        <h3 className="mt-3 text-lg font-extrabold text-[#5c2c16]">{product.nama_produk}</h3>
        <p className="mt-1 font-bold text-[#7b411e]">{rupiah(product.harga)}</p>
<<<<<<< HEAD
        <p className="mt-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${product.stok <= 5 ? "bg-red-100 text-[#b91c1c]" : "bg-green-100 text-[#166534]"}`}>{product.stok <= 5 ? `Stok menipis: ${product.stok}` : `Stok: ${product.stok}`}</span></p>
=======
        <p className="mt-1 text-sm text-[#725944]">Stok: {product.stok}</p>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
        {editable && (
          <div className="mt-4 flex gap-2">
            <PrimaryButton type="button" onClick={() => setModal(
              <Modal title="Ubah Produk" onClose={() => setModal(null)}>{createProductForm(product)}</Modal>,
            )}>Ubah</PrimaryButton>
            <button
              type="button"
              onClick={() => setModal(
                <Modal title="Hapus Produk?" onClose={() => setModal(null)}>
                  <p className="mb-5 text-[#5c2c16]">Produk {product.nama_produk} akan dihapus.</p>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setModal(null)} className="rounded-xl border px-4 py-2">Batal</button>
                    <button type="button" disabled={busy} onClick={() => void runAction(async () => {
                      await requestJson("/api/produk", {
                        method: "DELETE",
                        body: JSON.stringify({ id_produk: product.id_produk }),
                      });
                    }, "Produk berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
                  </div>
                </Modal>,
              )}
              className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white"
            >Hapus</button>
          </div>
        )}
      </div>
    </article>
  );

  const customerCards = data?.customers.map((customer) => (
    <article key={customer.id_customer} className="rounded-2xl border border-[#eadcb8] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-extrabold text-[#5c2c16]">{customer.nama_customer}</h3>
      <p className="mt-1 text-sm text-[#725944]">@{customer.pengguna.username} · {customer.email_customer}</p>
      <p className="mt-1 text-sm text-[#725944]">{customer.no_handphone} · {customer.poin} poin</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {role === "Admin" ? (
          <>
            <PrimaryButton type="button" onClick={() => setModal(
              <Modal title="Ubah Customer" onClose={() => setModal(null)}>
                <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                  await requestJson("/api/customer", {
                    method: "PUT",
                    body: JSON.stringify({
                      id_customer: customer.id_customer,
                      nama_customer: values.get("nama_customer"),
                      no_handphone: values.get("no_handphone"),
                      email_customer: values.get("email_customer"),
                    }),
                  });
                }, "Profil customer diperbarui.")}>
                  <Field label="Nama Lengkap" name="nama_customer" defaultValue={customer.nama_customer} required />
                  <Field label="No. HP" name="no_handphone" defaultValue={customer.no_handphone} required />
                  <Field label="Email" name="email_customer" type="email" defaultValue={customer.email_customer} required />
                  <PrimaryButton disabled={busy}>Simpan</PrimaryButton>
                </form>
              </Modal>,
            )}>Ubah</PrimaryButton>
<<<<<<< HEAD
            <PrimaryButton type="button" onClick={() => setModal(
              <Modal title="Ubah Poin Customer" onClose={() => setModal(null)}>
                <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                  await requestJson("/api/customer", {
                    method: "PATCH",
                    body: JSON.stringify({ id_customer: customer.id_customer, poin: Number(values.get("poin")) }),
                  });
                }, "Poin customer diperbarui.")}>
                  <Field label={`Poin ${customer.nama_customer}`} name="poin" type="number" defaultValue={customer.poin} required />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setModal(null)} className="rounded-xl border px-4 py-2">Batal</button>
                    <PrimaryButton disabled={busy}>Simpan</PrimaryButton>
                  </div>
                </form>
              </Modal>,
            )}>Poin</PrimaryButton>
=======
            <button type="button" onClick={() => {
              const points = window.prompt("Masukkan jumlah poin baru:", String(customer.poin));
              if (points === null) return;
              void runAction(async () => {
                await requestJson("/api/customer", {
                  method: "PATCH",
                  body: JSON.stringify({ id_customer: customer.id_customer, poin: Number(points) }),
                });
              }, "Poin customer diperbarui.");
            }} className="rounded-xl border border-[#ddbd53] px-4 py-2 font-bold text-[#5c2c16]">Poin</button>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
            <button type="button" onClick={() => setModal(
              <Modal title="Hapus Customer?" onClose={() => setModal(null)}>
                <p className="mb-5 text-[#5c2c16]">Data {customer.nama_customer} dan riwayat transaksinya akan dihapus.</p>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setModal(null)} className="rounded-xl border px-4 py-2">Batal</button>
                  <button type="button" onClick={() => void runAction(async () => {
                    await requestJson("/api/customer", {
                      method: "DELETE",
                      body: JSON.stringify({ id_customer: customer.id_customer }),
                    });
                  }, "Customer berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
                </div>
              </Modal>,
            )} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
          </>
        ) : (
          <PrimaryButton type="button" onClick={() => setModal(
            <Modal title="Detail Customer" onClose={() => setModal(null)}>
              <p className="text-[#5c2c16]">ID: {customer.id_customer}</p>
              <p className="mt-2 text-[#5c2c16]">Alamat: {customer.jalan ?? "-"}, {customer.kota ?? "Padang"}</p>
              <p className="mt-2 text-[#5c2c16]">Pesanan: {customer._count?.pesanan ?? 0}</p>
            </Modal>,
          )}>Lihat detail</PrimaryButton>
        )}
      </div>
    </article>
  ));

  const orderCards = (orders: Order[], cashierActions = false) => orders.map((order) => (
    <article key={order.id_pesanan} className="rounded-2xl border border-[#eadcb8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#5c2c16]">#{order.id_pesanan}</h3>
          <p className="mt-1 text-sm text-[#725944]">{order.customer.nama_customer} · {dateLabel(order.tanggal_pesanan)}</p>
        </div>
        <span className="rounded-full bg-[#fff0ba] px-3 py-1 text-sm font-bold text-[#5c2c16]">{order.status_pesanan}</span>
      </div>
      <ul className="my-3 space-y-1 text-sm text-[#725944]">
        {order.detail_pesanan.map((item, index) => <li key={`${order.id_pesanan}-${index}`}>{item.jumlah} × {item.produk.nama_produk} — {rupiah(item.subtotal)}</li>)}
      </ul>
      <p className="font-bold text-[#5c2c16]">Total: {rupiah(order.total_tagihan)}</p>
      <p className="text-sm text-[#725944]">Pembayaran: {order.pembayaran?.metode_pembayaran ?? "-"} · {order.pembayaran?.status_pembayaran ?? "-"}</p>
      {cashierActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          {order.pembayaran?.status_pembayaran === "Menunggu" && (
            <>
              <PrimaryButton type="button" onClick={() => void runAction(async () => {
                await requestJson("/api/pesanan", {
                  method: "PATCH",
                  body: JSON.stringify({ id_pesanan: order.id_pesanan, status_pembayaran: "Berhasil" }),
                });
              }, "Pembayaran berhasil divalidasi.")}>Validasi Pembayaran</PrimaryButton>
              <button type="button" onClick={() => setModal(
<<<<<<< HEAD
                <Modal title="Pembayaran Ditolak" onClose={() => setModal(null)} danger>
=======
                <Modal title="Pembayaran Ditolak" onClose={() => setModal(null)}>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
                  <p className="mb-5 text-[#5c2c16]">Tolak pembayaran untuk pesanan #{order.id_pesanan}?</p>
                  <button type="button" onClick={() => void runAction(async () => {
                    await requestJson("/api/pesanan", {
                      method: "PATCH",
                      body: JSON.stringify({ id_pesanan: order.id_pesanan, status_pembayaran: "Ditolak" }),
                    });
                  }, "Pembayaran ditolak.")} className="rounded-xl bg-[#dc2626] px-4 py-2.5 font-bold text-white">Tolak Pembayaran</button>
                </Modal>,
              )} className="rounded-xl bg-[#dc2626] px-4 py-2.5 font-bold text-white">Tolak Pembayaran</button>
            </>
          )}
          {order.status_pesanan !== "Divalidasi" &&
            order.pembayaran?.status_pembayaran === "Berhasil" && (
              <PrimaryButton type="button" onClick={() => setModal(
                <Modal title="Validasi Pesanan?" onClose={() => setModal(null)}>
                  <p className="mb-5 text-[#5c2c16]">Validasi pesanan #{order.id_pesanan}?</p>
                  <PrimaryButton type="button" disabled={busy} onClick={() => void runAction(async () => {
                    await requestJson("/api/pesanan", {
                      method: "PATCH",
                      body: JSON.stringify({ id_pesanan: order.id_pesanan, status_pesanan: "Divalidasi" }),
                    });
                  }, "Pesanan berhasil divalidasi.")}>Validasi</PrimaryButton>
                </Modal>,
              )}>Validasi</PrimaryButton>
            )}
          <PrimaryButton type="button" onClick={() => setModal(
            <Modal title="Ubah Status Pesanan" onClose={() => setModal(null)}>
              <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                await requestJson("/api/pesanan", {
                  method: "PATCH",
                  body: JSON.stringify({
                    id_pesanan: order.id_pesanan,
                    status_pesanan: values.get("status_pesanan"),
                  }),
                });
              }, "Status pesanan diperbarui.")}>
                {["Diproses", "Divalidasi", "Selesai"].map((status) => (
                  <label key={status} className="flex items-center gap-3 rounded-xl bg-[#fdf6e2] p-3 text-[#5c2c16]">
                    <input type="radio" name="status_pesanan" value={status} defaultChecked={order.status_pesanan === status} required />
                    {status}
                  </label>
                ))}
                <PrimaryButton disabled={busy}>Simpan</PrimaryButton>
              </form>
            </Modal>,
          )}>Ubah</PrimaryButton>
          <button type="button" onClick={() => setModal(
            <Modal title="Hapus Pesanan?" onClose={() => setModal(null)}>
              <p className="mb-5 text-[#5c2c16]">Hapus pesanan #{order.id_pesanan}? Stok akan dikembalikan.</p>
              <button type="button" disabled={busy} onClick={() => void runAction(async () => {
                await requestJson("/api/pesanan", {
                  method: "DELETE",
                  body: JSON.stringify({ id_pesanan: order.id_pesanan }),
                });
              }, "Pesanan dihapus dan stok dikembalikan.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus Pesanan</button>
            </Modal>,
          )} className="rounded-xl border border-[#dc2626] px-4 py-2 font-bold text-[#dc2626]">Hapus</button>
        </div>
      )}
    </article>
  ));

  const reportCards = (reports: Report[], ownerActions = false) => reports.map((report) => (
    <article key={report.id_laporan_kasir} className="rounded-2xl border border-[#eadcb8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#5c2c16]">#{report.id_laporan_kasir} · Laporan {report.jenis_laporan}</h3>
          <p className="mt-1 text-sm text-[#725944]">{dateLabel(report.periode_awal)} — {dateLabel(report.periode_akhir)}</p>
          {report.kasir && <p className="text-sm text-[#725944]">Kasir: {report.kasir.nama_kasir}</p>}
        </div>
        <span className="rounded-full bg-[#fff0ba] px-3 py-1 text-sm font-bold text-[#5c2c16]">{report.status_penjualan}</span>
      </div>
      <p className="mt-3 text-sm text-[#725944]">
        Produk: {report.jumlah_produk ?? 0} · Stok: {report.total_stok ?? 0} · Pesanan: {report.jumlah_transaksi ?? 0} · Penjualan: {rupiah(report.total_penjualan)}
      </p>
      {report.laporan_owner.map((evaluation) => (
        <p key={evaluation.id_laporan_owner} className="mt-2 rounded-xl bg-[#fdf6e2] p-3 text-sm text-[#5c2c16]">
          Evaluasi: {evaluation.catatan_evaluasi} ({evaluation.status_persetujuan})
        </p>
      ))}
      <div className="mt-4 flex flex-wrap gap-2">
        {ownerActions ? (
          <>
            <PrimaryButton type="button" onClick={() => setModal(
<<<<<<< HEAD
              <Modal title="Ubah Rekap Laporan" onClose={() => setModal(null)}>
                <p className="mb-4 text-[#5c2c16]">Pilih tindakan untuk laporan {report.id_laporan_kasir}.</p>
                <div className="flex flex-wrap gap-2">
                  <PrimaryButton type="button" onClick={() => setModal(
                    <Modal title="Evaluasi Laporan" onClose={() => setModal(null)}>
                      <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                        await requestJson("/api/laporan", {
                          method: "POST",
                          body: JSON.stringify({
                            id_laporan_kasir: report.id_laporan_kasir,
                            catatan_evaluasi: values.get("catatan_evaluasi"),
                          }),
                        });
                      }, "Evaluasi berhasil disimpan.")}>
                        <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
                          Catatan
                          <textarea name="catatan_evaluasi" required maxLength={255} className="rounded-xl border border-[#d8c49b] p-3" rows={4} />
                        </label>
                        <PrimaryButton disabled={busy}>Simpan Evaluasi</PrimaryButton>
                      </form>
                    </Modal>,
                  )}>Evaluasi</PrimaryButton>
                  <button type="button" disabled={busy} onClick={() => void runAction(async () => {
                    await requestJson("/api/laporan", {
                      method: "PATCH",
                      body: JSON.stringify({ action: "approve", id_laporan_kasir: report.id_laporan_kasir }),
                    });
                  }, "Rekapan Laporan Disetujui.")} className="rounded-xl bg-[#16a34a] px-4 py-2.5 font-bold text-white">Setujui</button>
                </div>
              </Modal>,
            )}>Ubah</PrimaryButton>
            <button type="button" onClick={() => setModal(
              <Modal title="Cetak sebagai PDF" onClose={() => setModal(null)}>
                <p className="mb-5 text-[#5c2c16]">Cetak rekap laporan {report.id_laporan_kasir} sebagai PDF?</p>
                <PrimaryButton type="button" onClick={() => { setModal(null); window.print(); setNotice("Laporan berhasil dicetak."); }}>Cetak Laporan</PrimaryButton>
              </Modal>,
            )} className="rounded-xl border border-[#d8c49b] px-4 py-2 font-bold text-[#5c2c16]">Cetak</button>
            <button type="button" onClick={() => setModal(
              <Modal title="Hapus Laporan?" onClose={() => setModal(null)}>
                <p className="mb-5 text-[#5c2c16]">Hapus laporan {report.id_laporan_kasir}?</p>
                <button type="button" disabled={busy} onClick={() => void runAction(async () => {
                  await requestJson("/api/laporan", {
                    method: "DELETE",
                    body: JSON.stringify({ id_laporan_kasir: report.id_laporan_kasir }),
                  });
                }, "Laporan berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
              </Modal>,
            )} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
=======
              <Modal title="Evaluasi Laporan" onClose={() => setModal(null)}>
                <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                  await requestJson("/api/laporan", {
                    method: "POST",
                    body: JSON.stringify({
                      id_laporan_kasir: report.id_laporan_kasir,
                      catatan_evaluasi: values.get("catatan_evaluasi"),
                    }),
                  });
                }, "Evaluasi berhasil disimpan.")}>
                  <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
                    Catatan
                    <textarea name="catatan_evaluasi" required maxLength={255} className="rounded-xl border border-[#d8c49b] p-3" rows={4} />
                  </label>
                  <PrimaryButton disabled={busy}>Simpan Evaluasi</PrimaryButton>
                </form>
              </Modal>,
            )}>Evaluasi</PrimaryButton>
            <button type="button" onClick={() => void runAction(async () => {
              await requestJson("/api/laporan", {
                method: "PATCH",
                body: JSON.stringify({ action: "approve", id_laporan_kasir: report.id_laporan_kasir }),
              });
            }, "Rekapan laporan disetujui.")} className="rounded-xl bg-[#16a34a] px-4 py-2.5 font-bold text-white">Setujui</button>
            <button type="button" onClick={() => window.print()} className="rounded-xl border border-[#d8c49b] px-4 py-2 font-bold text-[#5c2c16]">Cetak</button>
            <button type="button" onClick={() => void runAction(async () => {
              await requestJson("/api/laporan", {
                method: "DELETE",
                body: JSON.stringify({ id_laporan_kasir: report.id_laporan_kasir }),
              });
            }, "Laporan berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
          </>
        ) : role === "Kasir" && report.status_penjualan !== "Disetujui" ? (
          <>
            <PrimaryButton type="button" onClick={() => setModal(
              <Modal title="Ubah Laporan" onClose={() => setModal(null)}>
                <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                  await requestJson("/api/laporan", {
                    method: "PUT",
                    body: JSON.stringify({
                      id_laporan_kasir: report.id_laporan_kasir,
                      periode_awal: values.get("periode_awal"),
                      periode_akhir: values.get("periode_akhir"),
                    }),
                  });
                }, "Laporan diperbarui.")}>
                  <Field label="Periode Awal" name="periode_awal" type="date" defaultValue={report.periode_awal.slice(0, 10)} required />
                  <Field label="Periode Akhir" name="periode_akhir" type="date" defaultValue={report.periode_akhir.slice(0, 10)} required />
                  <PrimaryButton disabled={busy}>Simpan Perubahan</PrimaryButton>
                </form>
              </Modal>,
            )}>Ubah</PrimaryButton>
<<<<<<< HEAD
            <button type="button" onClick={() => setModal(
              <Modal title="Hapus Laporan?" onClose={() => setModal(null)}>
                <p className="mb-5 text-[#5c2c16]">Hapus laporan {report.id_laporan_kasir}?</p>
                <button type="button" disabled={busy} onClick={() => void runAction(async () => {
                  await requestJson("/api/laporan", {
                    method: "DELETE",
                    body: JSON.stringify({ id_laporan_kasir: report.id_laporan_kasir }),
                  });
                }, "Laporan berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
              </Modal>,
            )} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
=======
            <button type="button" onClick={() => void runAction(async () => {
              await requestJson("/api/laporan", {
                method: "DELETE",
                body: JSON.stringify({ id_laporan_kasir: report.id_laporan_kasir }),
              });
            }, "Laporan berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
          </>
        ) : (
          <button type="button" onClick={() => window.print()} className="rounded-xl border border-[#d8c49b] px-4 py-2 font-bold text-[#5c2c16]">Cetak</button>
        )}
      </div>
    </article>
  ));

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fdf6e2] p-6 text-center text-[#5c2c16]">
        <div>
          <p className="text-5xl">🍰</p>
          <p className="mt-3 font-bold">{error || "Memuat Amalakufood..."}</p>
          {error && <button className="mt-4 underline" onClick={() => void refresh()}>Coba lagi</button>}
        </div>
      </main>
    );
  }

  const sectionContent = () => {
    if (section === "Beranda") {
<<<<<<< HEAD
      const greetingName = role === "Customer"
        ? data.user.profile.nama_customer
        : role === "Admin"
          ? `Admin ${data.user.profile.id_admin ?? data.user.username}`
          : role === "Kasir"
            ? `Kasir ${data.user.profile.id_kasir ?? data.user.username}`
            : `Owner ${data.user.profile.id_owner ?? data.user.username}`;
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
      const cards =
        role === "Customer"
          ? [["Produk tersedia", products.length], ["Poin Anda", Number(data.user.profile.poin ?? 0)]]
          : role === "Admin"
            ? [["Produk", products.length], ["Customer", data.customers.length]]
            : role === "Kasir"
              ? [["Pesanan hari ini", data.orders.length], ["Stok hari ini", products.reduce((sum, product) => sum + product.stok, 0)]]
              : [
                  ["Penjualan", rupiah(data.summary.total_penjualan ?? 0)],
                  ["Pesanan", data.summary.jumlah_transaksi ?? 0],
                  ["Stok Menipis", data.summary.stok_menipis ?? 0],
                  ["Customer", data.summary.jumlah_customer ?? data.customers.length],
                ];
      return (
        <div className="space-y-8">
          <section className="rounded-3xl bg-[#f5c518] p-8 text-[#5c2c16] sm:p-10">
            <p className="font-bold">Fresh From Our Oven</p>
            <h2 className="mt-2 text-3xl font-black">
<<<<<<< HEAD
              {role === "Owner" ? "Halo" : "Selamat bekerja"}, {greetingName}
=======
              {role === "Owner" ? "Halo" : "Selamat bekerja"}, {data.user.profile.nama_customer ?? data.user.profile.nama_admin ?? data.user.profile.nama_kasir ?? data.user.profile.nama_owner ?? data.user.username}
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
            </h2>
            <p className="mt-2">Kue segar setiap hari, dibuat dengan sepenuh hati.</p>
            {role === "Customer" && <PrimaryButton type="button" className="mt-5 bg-white" onClick={() => setSection("Katalog")}>Lihat Katalog</PrimaryButton>}
          </section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(([label, value]) => (
              <article key={String(label)} className="rounded-2xl border border-[#eadcb8] bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#725944]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#5c2c16]">{value}</p>
              </article>
            ))}
          </div>
          {role !== "Customer" && role !== "Admin" && (
            <section className="space-y-3">
              <h3 className="text-xl font-extrabold text-[#5c2c16]">Pesanan Terbaru</h3>
              {orderCards((data.orders ?? []).slice(0, 3), role === "Kasir")}
            </section>
          )}
        </div>
      );
    }

    if (role === "Customer") {
      if (section === "Katalog") {
        return (
          <section>
            <div className="mb-6 rounded-3xl bg-[#ffd233] p-6 text-[#5c2c16]">
              <p className="text-sm font-bold uppercase tracking-widest">Toko Kue Amala</p>
              <h2 className="mt-2 text-3xl font-black">Kue segar setiap hari</h2>
              <p className="mt-2">Pilih kue favoritmu dan nikmati kehangatan dari oven kami.</p>
            </div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {["Semua", "Bolu", "Brownies"].map((category) => (
                <button key={category} type="button" onClick={() => setProductFilter(category)} className={`rounded-full px-4 py-2 font-bold ${productFilter === category ? "bg-[#5c2c16] text-white" : "bg-white text-[#5c2c16]"}`}>{category}</button>
              ))}
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kue..." className="ml-auto min-w-48 rounded-xl border border-[#d8c49b] bg-white px-4 py-2.5" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{visibleProducts.map((product) => productCard(product, false))}</div>
          </section>
        );
      }
      if (section === "Keranjang") {
        if (checkoutId) {
          return (
            <section className="mx-auto max-w-xl rounded-3xl bg-white p-7 text-center shadow-sm">
              <p className="text-5xl">✅</p>
              <h2 className="mt-3 text-2xl font-black text-[#5c2c16]">Pesanan #{checkoutId} berhasil dibuat!</h2>
              <p className="mt-2 text-[#725944]">
                {paymentMethod === "QRIS" ? "Scan QRIS untuk membayar. " : ""}
                Pembayaran akan diperiksa oleh Kasir.
              </p>
<<<<<<< HEAD
              <PrimaryButton type="button" className="mt-5" onClick={() => setModal(
                <Modal title="Pesanan berhasil!" onClose={() => setModal(null)}>
                  <p className="mb-5 text-[#5c2c16]">Pesanan #{checkoutId} berhasil dibuat. Pembayaran akan diperiksa oleh Kasir.</p>
                  <PrimaryButton type="button" onClick={() => {
                    setModal(null);
                    setCheckoutId("");
                    setCart({});
                    setSection("Riwayat");
                    void refresh();
                  }}>Lihat Riwayat Pesanan</PrimaryButton>
                </Modal>,
              )}>Saya sudah bayar</PrimaryButton>
=======
              <PrimaryButton type="button" className="mt-5" onClick={() => {
                setNotice("Pesanan berhasil! Pembayaran menunggu validasi Kasir.");
                setCheckoutId("");
                setCart({});
                setSection("Riwayat");
                void refresh();
              }}>Saya sudah bayar</PrimaryButton>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
            </section>
          );
        }
        return (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="space-y-3">
              <h2 className="mb-4 text-2xl font-black text-[#5c2c16]">Keranjang</h2>
              {cartEntries.length === 0 && <p className="rounded-2xl bg-white p-6 text-[#725944]">Keranjang Anda masih kosong.</p>}
              {cartEntries.map((product) => (
                <article key={product.id_produk} className="flex items-center gap-4 rounded-2xl bg-white p-4">
                  <span className="text-4xl">{product.kategori === "Brownies" ? "🍫" : "🍰"}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#5c2c16]">{product.nama_produk}</h3>
                    <p className="text-sm text-[#725944]">{rupiah(product.harga)}</p>
                  </div>
                  <button type="button" onClick={() => changeCart(product.id_produk, -1)} className="rounded-lg border px-3 py-1">−</button>
                  <span>{cart[product.id_produk]}</span>
                  <button type="button" onClick={() => changeCart(product.id_produk, 1)} className="rounded-lg border px-3 py-1">+</button>
                  <button type="button" onClick={() => setCart((current) => {
                    const next = { ...current };
                    delete next[product.id_produk];
                    return next;
                  })} className="px-2 text-xl text-[#dc2626]" aria-label="Hapus item">🗑</button>
                </article>
              ))}
              <div className="rounded-2xl bg-white p-5 text-[#5c2c16]">
                <p className="flex justify-between"><span>Subtotal</span><strong>{rupiah(cartTotal)}</strong></p>
                <p className="mt-2 flex justify-between text-lg"><span>Total</span><strong>{rupiah(cartTotal)}</strong></p>
              </div>
            </section>
            <form onSubmit={submitCheckout} className="h-fit space-y-4 rounded-2xl bg-white p-5">
              <h2 className="text-xl font-black text-[#5c2c16]">Checkout</h2>
              <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
                Alamat Pengiriman
                <textarea value={address} onChange={(event) => setAddress(event.target.value)} required maxLength={100} rows={3} className="rounded-xl border border-[#d8c49b] p-3 font-normal" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-[#5c2c16]">
                Metode Pembayaran
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="rounded-xl border border-[#d8c49b] p-3 font-normal">
                  <option>QRIS</option><option>Transfer Bank</option><option>Bayar di Toko</option>
                </select>
              </label>
              {paymentMethod === "QRIS" && <div className="rounded-xl bg-[#fdf6e2] p-4 text-center text-[#5c2c16]"><p>Scan QRIS untuk membayar</p><p className="mt-2 text-5xl">▦</p></div>}
              {paymentMethod === "Transfer Bank" && <p className="rounded-xl bg-[#fdf6e2] p-3 text-sm text-[#5c2c16]">Instruksi transfer akan diberikan oleh Kasir setelah pesanan diterima.</p>}
              <PrimaryButton type="submit" disabled={!cartEntries.length || busy} className="w-full">Checkout · {rupiah(cartTotal)}</PrimaryButton>
            </form>
          </div>
        );
      }
      if (section === "Riwayat") {
        return <section className="space-y-4"><h2 className="text-2xl font-black text-[#5c2c16]">Riwayat Pesanan</h2>{data.orders.length ? orderCards(data.orders) : <p className="rounded-2xl bg-white p-6 text-[#725944]">Belum ada pesanan.</p>}</section>;
      }
      if (section === "Profil") {
        return (
          <section className="max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="mb-5 text-2xl font-black text-[#5c2c16]">Profil Customer</h2>
            <dl className="grid gap-3 text-[#5c2c16]">
              <div><dt className="text-sm text-[#725944]">Nama</dt><dd className="font-bold">{data.user.profile.nama_customer}</dd></div>
              <div><dt className="text-sm text-[#725944]">Username</dt><dd className="font-bold">{data.user.username}</dd></div>
              <div><dt className="text-sm text-[#725944]">Email</dt><dd className="font-bold">{data.user.profile.email_customer}</dd></div>
              <div><dt className="text-sm text-[#725944]">No. HP</dt><dd className="font-bold">{data.user.profile.no_handphone}</dd></div>
            </dl>
            <div className="mt-5 flex gap-3">
              <PrimaryButton type="button" onClick={() => setModal(
                <Modal title="Edit Profil" onClose={() => setModal(null)}>
                  <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                    const profileId = data.user.profile.id_customer;
                    await requestJson("/api/customer", {
                      method: "PUT",
                      body: JSON.stringify({
                        id_customer: profileId,
                        nama_customer: values.get("nama_customer"),
                        email_customer: values.get("email_customer"),
                        no_handphone: values.get("no_handphone"),
                        jalan: values.get("jalan"),
                      }),
                    });
                  }, "Profil berhasil disimpan.")}>
                    <Field label="Nama Lengkap" name="nama_customer" defaultValue={data.user.profile.nama_customer} required />
                    <Field label="Email" name="email_customer" type="email" defaultValue={data.user.profile.email_customer} required />
                    <Field label="No. HP" name="no_handphone" defaultValue={data.user.profile.no_handphone} required />
                    <Field label="Alamat" name="jalan" defaultValue={data.user.profile.jalan} />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setModal(null)} className="rounded-xl border px-4 py-2">Cancel</button>
                      <PrimaryButton disabled={busy}>Simpan</PrimaryButton>
                    </div>
                  </form>
                </Modal>,
              )}>Edit Profil</PrimaryButton>
              <button type="button" onClick={logout} className="rounded-xl border border-[#dc2626] px-4 py-2.5 font-bold text-[#dc2626]">Keluar</button>
            </div>
          </section>
        );
      }
    }

    if (role === "Admin") {
      if (section === "Data Produk") {
        return <section><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black text-[#5c2c16]">Data Produk</h2><PrimaryButton type="button" onClick={() => setModal(<Modal title="Tambah Produk" onClose={() => setModal(null)}>{createProductForm()}</Modal>)}>Tambah Produk</PrimaryButton></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => productCard(product, true))}</div></section>;
      }
      if (section === "Data Customer") {
        return <section><h2 className="mb-5 text-2xl font-black text-[#5c2c16]">Data Customer</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{customerCards}</div></section>;
      }
      if (section === "Profil") {
        return <section className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-black text-[#5c2c16]">Profil Admin</h2><p className="mt-3 text-[#725944]">{data.user.profile.nama_admin} · {data.user.username}</p><button type="button" onClick={logout} className="mt-5 rounded-xl border border-[#dc2626] px-4 py-2 font-bold text-[#dc2626]">Keluar</button></section>;
      }
    }

    if (role === "Kasir") {
      if (section === "Transaksi Pemesanan" || section === "Validasi Pembayaran") {
        const filtered = section === "Validasi Pembayaran"
          ? data.orders.filter((order) => order.pembayaran?.status_pembayaran === "Menunggu")
          : data.orders;
        return <section className="space-y-4"><h2 className="text-2xl font-black text-[#5c2c16]">{section}</h2>{filtered.length ? orderCards(filtered, true) : <p className="rounded-2xl bg-white p-6 text-[#725944]">Tidak ada pesanan untuk ditampilkan.</p>}</section>;
      }
      if (section === "Bukti Pembayaran") {
        const paidOrders = data.orders.filter((order) => order.pembayaran?.status_pembayaran === "Berhasil");
<<<<<<< HEAD
        return <section className="space-y-4"><h2 className="text-2xl font-black text-[#5c2c16]">Bukti Pembayaran</h2>{paidOrders.map((order) => <article key={order.id_pesanan} className="max-w-xl rounded-2xl border border-[#eadcb8] bg-white p-6"><p className="text-center text-xl font-black text-[#5c2c16]">Nota Toko Kue Amala</p><p className="mt-4 text-sm text-[#725944]">No. Nota: {order.pembayaran?.nota?.no_nota ?? order.id_pesanan}</p><p className="text-sm text-[#725944]">Customer: {order.customer.nama_customer}</p><p className="text-sm text-[#725944]">Tanggal: {dateLabel(order.tanggal_pesanan)}</p><ul className="my-3 border-y py-3 text-sm text-[#725944]">{order.detail_pesanan.map((line, index) => <li key={index}>{line.jumlah} × {line.produk.nama_produk} — {rupiah(line.subtotal)}</li>)}</ul><p className="font-bold text-[#5c2c16]">Total: {rupiah(order.total_tagihan)}</p><p className="text-sm text-[#725944]">Metode: {order.pembayaran?.metode_pembayaran} · Berhasil</p><PrimaryButton type="button" className="mt-4" onClick={() => setModal(<Modal title="Nota berhasil dicetak" onClose={() => setModal(null)}><p className="mb-5 text-[#5c2c16]">Cetak nota pesanan #{order.id_pesanan}?</p><PrimaryButton type="button" onClick={() => { setModal(null); window.print(); setNotice("Nota berhasil dicetak."); }}>Cetak Nota</PrimaryButton></Modal>)}>Cetak Nota</PrimaryButton></article>)}</section>;
=======
        return <section className="space-y-4"><h2 className="text-2xl font-black text-[#5c2c16]">Bukti Pembayaran</h2>{paidOrders.map((order) => <article key={order.id_pesanan} className="max-w-xl rounded-2xl border border-[#eadcb8] bg-white p-6"><p className="text-center text-xl font-black text-[#5c2c16]">Nota Toko Kue Amala</p><p className="mt-4 text-sm text-[#725944]">No. Nota: {order.pembayaran?.nota?.no_nota ?? order.id_pesanan}</p><p className="text-sm text-[#725944]">Customer: {order.customer.nama_customer}</p><p className="text-sm text-[#725944]">Tanggal: {dateLabel(order.tanggal_pesanan)}</p><ul className="my-3 border-y py-3 text-sm text-[#725944]">{order.detail_pesanan.map((line, index) => <li key={index}>{line.jumlah} × {line.produk.nama_produk} — {rupiah(line.subtotal)}</li>)}</ul><p className="font-bold text-[#5c2c16]">Total: {rupiah(order.total_tagihan)}</p><p className="text-sm text-[#725944]">Metode: {order.pembayaran?.metode_pembayaran} · Berhasil</p><PrimaryButton type="button" className="mt-4" onClick={() => { window.print(); setNotice("Nota berhasil dicetak."); }}>Cetak Nota</PrimaryButton></article>)}</section>;
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
      }
      if (section === "Laporan Stok" || section === "Laporan Penjualan") {
        const kind = section === "Laporan Stok" ? "Stok" : "Penjualan";
        const reports = data.reports.filter((report) => report.jenis_laporan === kind);
        return <section><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black text-[#5c2c16]">{section}</h2><PrimaryButton type="button" onClick={() => setModal(<Modal title={`Tambah Laporan ${kind}`} onClose={() => setModal(null)}><form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
          await requestJson("/api/laporan", {
            method: "POST",
            body: JSON.stringify({
              jenis_laporan: kind,
              periode_awal: values.get("periode_awal"),
              periode_akhir: values.get("periode_akhir"),
            }),
          });
        }, "Laporan berhasil dibuat.")}><Field label="Periode Awal" name="periode_awal" type="date" required /><Field label="Periode Akhir" name="periode_akhir" type="date" required /><PrimaryButton disabled={busy}>Tambah</PrimaryButton></form></Modal>)}>Tambah Laporan</PrimaryButton></div><div className="space-y-4">{reportCards(reports)}</div></section>;
      }
      if (section === "Profil") {
        return <section className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-black text-[#5c2c16]">Profil Kasir</h2><p className="mt-3 text-[#725944]">{data.user.profile.nama_kasir} · {data.user.username}</p><button type="button" onClick={logout} className="mt-5 rounded-xl border border-[#dc2626] px-4 py-2 font-bold text-[#dc2626]">Keluar</button></section>;
      }
    }

    if (role === "Owner") {
      if (section === "Rekap Laporan Penjualan" || section === "Rekap Laporan Stok") {
        const kind = section === "Rekap Laporan Stok" ? "Stok" : "Penjualan";
        return <section><h2 className="mb-5 text-2xl font-black text-[#5c2c16]">{section}</h2><div className="space-y-4">{reportCards(data.reports.filter((report) => report.jenis_laporan === kind), true)}</div></section>;
      }
      if (section === "Evaluasi Laporan") {
        const evaluations = data.reports.flatMap((report) =>
          report.laporan_owner.map((evaluation) => ({
            ...evaluation,
            reportId: report.id_laporan_kasir,
            kind: report.jenis_laporan,
          })),
        );
        return (
          <section>
            <h2 className="mb-5 text-2xl font-black text-[#5c2c16]">Evaluasi Laporan</h2>
            <div className="mb-5 rounded-2xl bg-white p-5">
              <h3 className="mb-3 font-bold">Tambah Catatan Evaluasi</h3>
              <form className="grid gap-3 md:grid-cols-[1fr_2fr_auto]" onSubmit={(event) => submitForm(event, async (values) => {
                await requestJson("/api/laporan", {
                  method: "POST",
                  body: JSON.stringify({
                    id_laporan_kasir: values.get("id_laporan_kasir"),
                    catatan_evaluasi: values.get("catatan_evaluasi"),
                  }),
                });
              }, "Evaluasi berhasil ditambahkan.")}>
                <select name="id_laporan_kasir" required className="rounded-xl border border-[#d8c49b] bg-white px-3 py-2.5">
                  <option value="">Pilih laporan</option>
                  {data.reports.map((report) => <option key={report.id_laporan_kasir} value={report.id_laporan_kasir}>{report.id_laporan_kasir} · {report.jenis_laporan}</option>)}
                </select>
                <input name="catatan_evaluasi" required maxLength={255} placeholder="Catatan evaluasi" className="rounded-xl border border-[#d8c49b] px-3 py-2.5" />
                <PrimaryButton disabled={busy}>Tambah</PrimaryButton>
              </form>
            </div>
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <article key={evaluation.id_laporan_owner} className="rounded-2xl bg-white p-5">
                  <p className="font-bold text-[#5c2c16]">#{evaluation.id_laporan_owner} · {evaluation.kind} · {evaluation.reportId}</p>
                  <p className="mt-2 text-[#725944]">{evaluation.catatan_evaluasi}</p>
                  <p className="mt-1 text-sm text-[#725944]">{evaluation.status_persetujuan}</p>
                  <div className="mt-3 flex gap-2">
                    {evaluation.status_persetujuan !== "Disetujui" && (
                      <PrimaryButton type="button" onClick={() => setModal(
                        <Modal title="Edit Evaluasi" onClose={() => setModal(null)}>
                          <form className="grid gap-3" onSubmit={(event) => submitForm(event, async (values) => {
                            await requestJson("/api/laporan", {
                              method: "PUT",
                              body: JSON.stringify({
                                id_laporan_owner: evaluation.id_laporan_owner,
                                catatan_evaluasi: values.get("catatan_evaluasi"),
                              }),
                            });
                          }, "Evaluasi berhasil diperbarui.")}>
                            <textarea name="catatan_evaluasi" required maxLength={255} defaultValue={evaluation.catatan_evaluasi} rows={4} className="rounded-xl border border-[#d8c49b] p-3" />
                            <PrimaryButton disabled={busy}>Simpan</PrimaryButton>
                          </form>
                        </Modal>,
                      )}>Edit</PrimaryButton>
                    )}
                    <button type="button" onClick={() => setModal(
                      <Modal title="Hapus Evaluasi?" onClose={() => setModal(null)}>
                        <p className="mb-4 text-[#5c2c16]">Hapus catatan evaluasi ini?</p>
                        <button type="button" disabled={busy} onClick={() => void runAction(async () => {
                          await requestJson("/api/laporan", {
                            method: "DELETE",
                            body: JSON.stringify({ id_laporan_owner: evaluation.id_laporan_owner }),
                          });
                        }, "Evaluasi berhasil dihapus.")} className="rounded-xl bg-[#dc2626] px-4 py-2 font-bold text-white">Hapus</button>
                      </Modal>,
                    )} className="rounded-xl border border-[#dc2626] px-4 py-2 font-bold text-[#dc2626]">Hapus</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      }
      if (section === "Data Produk & Stok") {
        return <section><h2 className="mb-5 text-2xl font-black text-[#5c2c16]">Data Produk & Stok</h2><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => productCard(product, false))}</div></section>;
      }
      if (section === "Data Customer") {
        return <section><h2 className="mb-5 text-2xl font-black text-[#5c2c16]">Data Customer</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{customerCards}</div></section>;
      }
      if (section === "Profil") {
        return <section className="rounded-2xl bg-white p-6"><h2 className="text-2xl font-black text-[#5c2c16]">Profil Owner</h2><p className="mt-3 text-[#725944]">{data.user.profile.nama_owner} · {data.user.username}</p><button type="button" onClick={logout} className="mt-5 rounded-xl border border-[#dc2626] px-4 py-2 font-bold text-[#dc2626]">Keluar</button></section>;
      }
    }
    return <p className="rounded-2xl bg-white p-6 text-[#725944]">Tidak ada data untuk ditampilkan.</p>;
  };

  return (
    <div className="min-h-screen bg-[#fdf6e2] text-[#5c2c16]">
      {role === "Customer" ? (
        <header className="sticky top-0 z-20 border-b border-[#eadcb8] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
<<<<<<< HEAD
              <button type="button" onClick={() => setSection("Beranda")} className="mr-auto flex items-center gap-2 text-xl font-black text-[#5c2c16]"><Image src="/images/amalakufood-logo.jpeg" alt="" width={40} height={40} className="rounded-full" />Amalakufood</button>
            {navItems.map((item) => <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-lg px-3 py-2 text-sm font-bold ${section === item ? "bg-[#fff0ba]" : "hover:bg-[#fdf6e2]"}`}>{item}</button>)}
              <label className="order-last w-full sm:order-none sm:w-auto">
                <span className="sr-only">Cari produk</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kue..." className="w-full rounded-xl border border-[#ddc98e] px-3 py-2 text-sm outline-none focus:border-[#c39800] sm:w-40" />
              </label>
              <button type="button" onClick={() => setSection("Keranjang")} className="rounded-xl bg-[#f5c518] px-3 py-2 text-sm font-bold">Keranjang ({Object.values(cart).reduce((sum, count) => sum + count, 0)})</button>
=======
            <button type="button" onClick={() => setSection("Beranda")} className="mr-auto text-xl font-black text-[#5c2c16]">🍰 Amalakufood</button>
            {navItems.map((item) => <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-lg px-3 py-2 text-sm font-bold ${section === item ? "bg-[#fff0ba]" : "hover:bg-[#fdf6e2]"}`}>{item}</button>)}
            <button type="button" onClick={() => setSection("Keranjang")} className="rounded-xl bg-[#f5c518] px-3 py-2 text-sm font-bold">Keranjang ({Object.values(cart).reduce((sum, count) => sum + count, 0)})</button>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
            <button type="button" onClick={() => setSection("Profil")} className="rounded-full border px-3 py-2 text-sm font-bold">Profil</button>
          </div>
        </header>
      ) : (
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[#eadcb8] bg-white p-5 lg:flex">
          <button type="button" onClick={() => setSection("Beranda")} className="mb-8 text-left text-xl font-black text-[#5c2c16]">🍰 Amalakufood</button>
          <nav className="flex-1 space-y-1">
            {navItems.slice(1).map((item) => <button key={item} type="button" onClick={() => setSection(item)} className={`w-full rounded-xl px-3 py-3 text-left text-sm font-bold ${section === item ? "bg-[#f5c518] text-[#5c2c16]" : "hover:bg-[#fdf6e2]"}`}>{item}</button>)}
          </nav>
          <button type="button" onClick={() => setSection("Profil")} className="rounded-xl border px-3 py-3 text-left font-bold">{role} · {data.user.profile.nama_admin ?? data.user.profile.nama_kasir ?? data.user.profile.nama_owner}</button>
        </aside>
      )}

      <main className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8 ${role === "Customer" ? "" : "lg:ml-64"}`}>
        {role !== "Customer" && (
          <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
            {navItems.map((item) => <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-full px-3 py-2 text-sm font-bold ${section === item ? "bg-[#f5c518]" : "bg-white"}`}>{item}</button>)}
            <button type="button" onClick={() => setSection("Profil")} className="rounded-full bg-white px-3 py-2 text-sm font-bold">Profil</button>
          </div>
        )}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black sm:text-3xl">{section}</h1>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void refresh()} className="rounded-xl border border-[#ddc98e] bg-white px-3 py-2 text-sm font-bold">Muat ulang</button>
            {role !== "Customer" && <button type="button" onClick={logout} className="rounded-xl border border-[#dc2626] bg-white px-3 py-2 text-sm font-bold text-[#dc2626]">Keluar</button>}
          </div>
<<<<<<< HEAD
          {demoMode && <p role="status" className="mb-4 rounded-xl border border-[#ddc98e] bg-[#fff0ba] px-4 py-3 text-sm font-semibold text-[#5c2c16]">Mode demo aktif. Perubahan disimpan di browser ini dan belum tersimpan ke PostgreSQL.</p>}
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
        </div>
        {error && <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#dc2626]/30 bg-white p-3 text-sm text-[#a51f1f]"><span>{error}</span><button type="button" onClick={() => setError("")}>Tutup</button></div>}
        {notice && <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#16a34a]/30 bg-white p-3 text-sm text-[#166534]"><span>{notice}</span><button type="button" onClick={() => setNotice("")}>Tutup</button></div>}
        {sectionContent()}
      </main>

      {selectedProduct && (
        <Modal title="Detail Produk" onClose={() => setSelectedProduct(null)}>
          <div className="text-center">
            <div className="text-7xl">{selectedProduct.kategori === "Brownies" ? "🍫" : "🍰"}</div>
            <p className="mt-3 text-sm font-bold text-[#8b673e]">{selectedProduct.kategori}</p>
            <h3 className="mt-1 text-2xl font-black text-[#5c2c16]">{selectedProduct.nama_produk}</h3>
            <p className="mt-2 text-[#725944]">{selectedProduct.deskripsi ?? "Kue segar pilihan dari Toko Kue Amala."}</p>
            <p className="mt-3 font-bold text-[#5c2c16]">{rupiah(selectedProduct.harga)} · Stok {selectedProduct.stok}</p>
            {role === "Customer" && (
              <>
                <div className="my-5 flex items-center justify-center gap-4">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="rounded-lg border px-4 py-2">−</button>
                  <span className="font-bold">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(selectedProduct.stok, value + 1))} className="rounded-lg border px-4 py-2">+</button>
                </div>
                <PrimaryButton type="button" disabled={selectedProduct.stok < 1} onClick={() => {
                  changeCart(selectedProduct.id_produk, quantity);
                  setSelectedProduct(null);
                  setNotice("Produk ditambahkan ke keranjang.");
                }}>Tambah ke Keranjang</PrimaryButton>
              </>
            )}
          </div>
        </Modal>
      )}
      {modal}
    </div>
  );
}
