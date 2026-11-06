import { NextResponse } from "next/server";
import { apiErrorResponse, ApiError, badRequest, readJsonObject } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { createId } from "@/lib/ids";
import { prisma } from "@/lib/prisma";

function parseDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}

function reportIdPrefix(kind: string) {
  return kind === "Penjualan" ? "RP-" : "RS-";
}

async function reportTotals(
  tx: typeof prisma,
  kind: string,
  start: Date,
  end: Date,
) {
  if (kind === "Penjualan") {
    const [orders, productCount] = await Promise.all([
      tx.pesanan.aggregate({
        where: {
          tanggal_pesanan: { gte: start, lte: end },
          status_pesanan: { not: "Dibatalkan" },
        },
        _count: { _all: true },
        _sum: { total_tagihan: true },
      }),
      tx.detail_pesanan.findMany({
        where: { pesanan: { tanggal_pesanan: { gte: start, lte: end } } },
        distinct: ["id_produk"],
        select: { id_produk: true },
      }),
    ]);
    return {
      jumlah_produk: productCount.length,
      total_stok: 0,
      jumlah_transaksi: orders._count._all,
      total_penjualan: Number(orders._sum.total_tagihan ?? 0),
    };
  }

  const products = await tx.produk.aggregate({
    _count: { _all: true },
    _sum: { stok: true },
  });
  return {
    jumlah_produk: products._count._all,
    total_stok: products._sum.stok ?? 0,
    jumlah_transaksi: 0,
    total_penjualan: 0,
  };
}

export async function GET(request: Request) {
  try {
    const session = getSession(request);
    if (!session || !["Kasir", "Owner"].includes(session.role)) {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const where = session.role === "Kasir" ? { id_kasir: session.profileId } : {};
    const [reports, finals, summary] = await Promise.all([
      prisma.laporan_kasir.findMany({
        where,
        include: {
          kasir: { select: { id_kasir: true, nama_kasir: true } },
          laporan_owner: {
            include: {
              owner: { select: { id_owner: true, nama_owner: true } },
              laporan_akhir: true,
            },
            orderBy: { tanggal_periksa: "desc" },
          },
        },
        orderBy: { periode_akhir: "desc" },
      }),
      session.role === "Owner"
        ? prisma.laporan_akhir.findMany({
            include: {
              laporan_owner: {
                include: {
                  owner: { select: { nama_owner: true } },
                  laporan_kasir: true,
                },
              },
            },
            orderBy: { tanggal_final: "desc" },
          })
        : Promise.resolve([]),
      prisma.laporan_kasir.aggregate({
        where,
        _count: { _all: true },
        _sum: { total_penjualan: true, jumlah_transaksi: true, total_stok: true },
      }),
    ]);

    return NextResponse.json({
      reports,
      finals,
      summary: {
        jumlah_laporan: summary._count._all,
        total_penjualan: Number(summary._sum.total_penjualan ?? 0),
        jumlah_transaksi: summary._sum.jumlah_transaksi ?? 0,
        total_stok: summary._sum.total_stok ?? 0,
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "List reports");
  }
}

export async function POST(request: Request) {
  try {
    const session = getSession(request);
    if (!session || !["Kasir", "Owner"].includes(session.role)) {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    if (!body) return badRequest("Isi permintaan tidak valid.");

    if (session.role === "Kasir") {
      const kind = body.jenis_laporan;
      const start = parseDate(body.periode_awal);
      const end = parseDate(body.periode_akhir);
      if (
        (kind !== "Penjualan" && kind !== "Stok") ||
        !start ||
        !end ||
        start > end
      ) {
        return badRequest("Jenis dan periode laporan tidak valid.");
      }
      const totals = await reportTotals(prisma, kind, start, end);
      const report = await prisma.laporan_kasir.create({
        data: {
          id_laporan_kasir: createId(reportIdPrefix(kind), 8),
          id_kasir: session.profileId,
          periode_awal: start,
          periode_akhir: end,
          bulan_laporan:
            typeof body.bulan_laporan === "string" && body.bulan_laporan.trim()
              ? body.bulan_laporan.trim().slice(0, 30)
              : null,
          jenis_laporan: kind,
          ...totals,
          status_penjualan: "Menunggu Pemeriksaan",
        },
      });
      return NextResponse.json({ report }, { status: 201 });
    }

    const reportId =
      typeof body.id_laporan_kasir === "string" ? body.id_laporan_kasir.trim() : "";
    const note = typeof body.catatan_evaluasi === "string" ? body.catatan_evaluasi.trim() : "";
    if (!reportId || !note || note.length > 255) {
      return badRequest("ID laporan dan catatan evaluasi (maksimal 255 karakter) wajib diisi.");
    }
    const report = await prisma.laporan_kasir.findUnique({
      where: { id_laporan_kasir: reportId },
    });
    if (!report) throw new ApiError("Laporan tidak ditemukan.", 404);
    const evaluation = await prisma.laporan_owner.create({
      data: {
        id_laporan_owner: createId("EV-", 8),
        id_owner: session.profileId,
        id_laporan_kasir: reportId,
        catatan_evaluasi: note,
        status_persetujuan: "Menunggu",
      },
    });
    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Create report or evaluation");
  }
}

async function updateReport(request: Request) {
  const session = getSession(request);
  if (!session || !["Kasir", "Owner"].includes(session.role)) {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
  }
  const body = await readJsonObject(request);
  if (!body) return badRequest("Isi permintaan tidak valid.");

  if (session.role === "Kasir") {
    const id =
      typeof body.id_laporan_kasir === "string" ? body.id_laporan_kasir.trim() : "";
    if (!id) return badRequest("ID laporan wajib diisi.");
    const current = await prisma.laporan_kasir.findUnique({
      where: { id_laporan_kasir: id },
    });
    if (!current) throw new ApiError("Laporan tidak ditemukan.", 404);
    if (current.id_kasir !== session.profileId) {
      return NextResponse.json({ error: "Laporan ini bukan milik Kasir." }, { status: 403 });
    }
    if (current.status_penjualan === "Disetujui") {
      throw new ApiError("Laporan yang sudah disetujui tidak dapat diubah.", 409);
    }

    if (body.jenis_laporan !== undefined && body.jenis_laporan !== current.jenis_laporan) {
      return badRequest("Jenis laporan tidak dapat diubah setelah dibuat.");
    }
    const kind = current.jenis_laporan;
    const start = body.periode_awal === undefined ? current.periode_awal : parseDate(body.periode_awal);
    const end = body.periode_akhir === undefined ? current.periode_akhir : parseDate(body.periode_akhir);
    if ((kind !== "Penjualan" && kind !== "Stok") || !start || !end || start > end) {
      return badRequest("Jenis dan periode laporan tidak valid.");
    }
    const totals = await reportTotals(prisma, kind, start, end);
    const bulan =
      body.bulan_laporan === undefined
        ? current.bulan_laporan
        : typeof body.bulan_laporan === "string"
          ? body.bulan_laporan.trim().slice(0, 30)
          : null;
    const report = await prisma.laporan_kasir.update({
      where: { id_laporan_kasir: id },
      data: {
        jenis_laporan: kind,
        periode_awal: start,
        periode_akhir: end,
        bulan_laporan: bulan,
        ...totals,
        status_penjualan: "Menunggu Pemeriksaan",
      },
    });
    return NextResponse.json({ report });
  }

  if (body.action === "approve") {
    const reportId =
      typeof body.id_laporan_kasir === "string" ? body.id_laporan_kasir.trim() : "";
    if (!reportId) return badRequest("ID laporan wajib diisi.");
    const suppliedNote =
      typeof body.catatan_evaluasi === "string" ? body.catatan_evaluasi.trim() : "";
    if (suppliedNote.length > 255) return badRequest("Catatan evaluasi terlalu panjang.");

    const result = await prisma.$transaction(async (tx) => {
      const report = await tx.laporan_kasir.findUnique({
        where: { id_laporan_kasir: reportId },
      });
      if (!report) throw new ApiError("Laporan tidak ditemukan.", 404);

      const evaluation = await tx.laporan_owner.findFirst({
        where: {
          id_laporan_kasir: reportId,
          id_owner: session.profileId,
        },
        orderBy: { tanggal_periksa: "desc" },
      });
      const note = suppliedNote || evaluation?.catatan_evaluasi || "Laporan disetujui.";
      const ownerReport = evaluation
        ? await tx.laporan_owner.update({
            where: { id_laporan_owner: evaluation.id_laporan_owner },
            data: { catatan_evaluasi: note, status_persetujuan: "Disetujui" },
          })
        : await tx.laporan_owner.create({
            data: {
              id_laporan_owner: createId("EV-", 8),
              id_owner: session.profileId,
              id_laporan_kasir: reportId,
              catatan_evaluasi: note,
              status_persetujuan: "Disetujui",
            },
          });
      await tx.laporan_kasir.update({
        where: { id_laporan_kasir: reportId },
        data: { status_penjualan: "Disetujui" },
      });

      const final = await tx.laporan_akhir.findFirst({
        where: { id_laporan_owner: ownerReport.id_laporan_owner },
      });
      const finalData = {
        tanggal_final: new Date(),
        total_penjualan: report.total_penjualan,
        jumlah_transaksi: report.jumlah_transaksi ?? 0,
      };
      const summary = final
        ? await tx.laporan_akhir.update({
            where: { id_laporan_akhir: final.id_laporan_akhir },
            data: finalData,
          })
        : await tx.laporan_akhir.create({
            data: {
              id_laporan_akhir: createId("LA-", 8),
              id_laporan_owner: ownerReport.id_laporan_owner,
              ...finalData,
            },
          });
      return { evaluation: ownerReport, final: summary };
    });
    return NextResponse.json({ ...result, message: "Rekapan laporan disetujui." });
  }

  const evaluationId =
    typeof body.id_laporan_owner === "string" ? body.id_laporan_owner.trim() : "";
  const note =
    typeof body.catatan_evaluasi === "string" ? body.catatan_evaluasi.trim() : "";
  if (!evaluationId || !note || note.length > 255) {
    return badRequest("ID evaluasi dan catatan (maksimal 255 karakter) wajib diisi.");
  }
  const evaluation = await prisma.laporan_owner.findUnique({
    where: { id_laporan_owner: evaluationId },
  });
  if (!evaluation) throw new ApiError("Evaluasi tidak ditemukan.", 404);
  if (evaluation.id_owner !== session.profileId) {
    return NextResponse.json({ error: "Evaluasi ini bukan milik Owner." }, { status: 403 });
  }
  if (evaluation.status_persetujuan === "Disetujui") {
    throw new ApiError("Evaluasi yang sudah disetujui tidak dapat diubah.", 409);
  }
  const updated = await prisma.laporan_owner.update({
    where: { id_laporan_owner: evaluationId },
    data: { catatan_evaluasi: note },
  });
  return NextResponse.json({ evaluation: updated });
}

export async function PUT(request: Request) {
  try {
    return await updateReport(request);
  } catch (error) {
    return apiErrorResponse(error, "Update report");
  }
}

export async function PATCH(request: Request) {
  try {
    return await updateReport(request);
  } catch (error) {
    return apiErrorResponse(error, "Update report");
  }
}

export async function DELETE(request: Request) {
  try {
    const session = getSession(request);
    if (!session || !["Kasir", "Owner"].includes(session.role)) {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    if (!body) return badRequest("Isi permintaan tidak valid.");

    if (typeof body.id_laporan_owner === "string" && session.role === "Owner") {
      const id = body.id_laporan_owner.trim();
      const evaluation = await prisma.laporan_owner.findUnique({
        where: { id_laporan_owner: id },
      });
      if (!evaluation) throw new ApiError("Evaluasi tidak ditemukan.", 404);
      if (evaluation.id_owner !== session.profileId) {
        return NextResponse.json({ error: "Evaluasi ini bukan milik Owner." }, { status: 403 });
      }
      await prisma.$transaction(async (tx) => {
        await tx.laporan_owner.delete({ where: { id_laporan_owner: id } });
        if (evaluation.status_persetujuan === "Disetujui") {
          const otherApprovedEvaluation = await tx.laporan_owner.findFirst({
            where: {
              id_laporan_kasir: evaluation.id_laporan_kasir,
              status_persetujuan: "Disetujui",
            },
          });
          if (!otherApprovedEvaluation) {
            await tx.laporan_kasir.update({
              where: { id_laporan_kasir: evaluation.id_laporan_kasir },
              data: { status_penjualan: "Menunggu Pemeriksaan" },
            });
          }
        }
      });
      return NextResponse.json({ message: "Evaluasi berhasil dihapus." });
    }

    const id =
      typeof body.id_laporan_kasir === "string" ? body.id_laporan_kasir.trim() : "";
    if (!id) return badRequest("ID laporan wajib diisi.");
    const report = await prisma.laporan_kasir.findUnique({
      where: { id_laporan_kasir: id },
    });
    if (!report) throw new ApiError("Laporan tidak ditemukan.", 404);
    if (session.role === "Kasir" && report.id_kasir !== session.profileId) {
      return NextResponse.json({ error: "Laporan ini bukan milik Kasir." }, { status: 403 });
    }
    if (session.role === "Kasir" && report.status_penjualan === "Disetujui") {
      throw new ApiError("Laporan yang sudah disetujui tidak dapat dihapus.", 409);
    }
    await prisma.laporan_kasir.delete({ where: { id_laporan_kasir: id } });
    return NextResponse.json({ message: "Laporan berhasil dihapus." });
  } catch (error) {
    return apiErrorResponse(error, "Delete report");
  }
}
