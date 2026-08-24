import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartBar,
  FaFileAlt,
  FaFolderOpen,
  FaHandsHelping,
  FaNewspaper,
  FaProjectDiagram,
  FaSync,
  FaTrophy,
} from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";

interface DashboardStats {
  totalPenelitian: number;
  totalPengabdian: number;
  totalPaten: number;
  totalHaki: number;
  updatedAt: string;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const apiBase = (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
          (window.location.hostname === "lppm.unila.ac.id" || window.location.hostname.includes("unila.ac.id")
            ? "https://lppm.unila.ac.id/api"
            : "http://localhost:8000/api");
        const response = await fetch(`${apiBase}/content/statistics`);
        if (!response.ok) throw new Error("Data statistik belum dapat dimuat.");
        const responseData = await response.json();
        const data = responseData.data;
        setStats({
          totalPenelitian: data.total_summary.total_penelitian_blu,
          totalPengabdian: data.total_summary.total_pengabdian_blu,
          totalPaten: data.total_summary.total_paten,
          totalHaki: data.total_summary.total_haki,
          updatedAt: data.metadata.last_updated,
        });
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Data statistik belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };
    void loadStats();
  }, []);

  const statCards = [
    { title: "Total Penelitian", value: stats?.totalPenelitian, icon: FaProjectDiagram, color: "bg-emerald-50 text-emerald-700" },
    { title: "Total Pengabdian", value: stats?.totalPengabdian, icon: FaHandsHelping, color: "bg-blue-50 text-blue-700" },
    { title: "Total Paten", value: stats?.totalPaten, icon: FaTrophy, color: "bg-violet-50 text-violet-700" },
    { title: "Total HKI", value: stats?.totalHaki, icon: FaChartBar, color: "bg-amber-50 text-amber-700" },
  ];

  const shortcuts = [
    { title: "Berita", description: "Buat, edit, terbitkan, dan kelola berita.", to: "/admin/posts", icon: FaNewspaper },
    { title: "Halaman", description: "Kelola halaman informasi tetap pada website.", to: "/admin/pages", icon: FaFileAlt },
    { title: "Dokumen", description: "Kelola file, akses unduhan, dan publikasi dokumen.", to: "/admin/documents", icon: FaFileAlt },
    { title: "Kategori & tag", description: "Rapikan pengelompokan berita dan dokumen.", to: "/admin/categories", icon: FaFolderOpen },
  ];

  return (
    <CmsAdminShell title="Dashboard" description="Ringkasan data dan akses cepat untuk mengelola konten website LPPM.">
      <section className="cms-panel rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Ringkasan kinerja</h2>
            <p className="mt-1 text-sm text-slate-500">Data penelitian, pengabdian, paten, dan HKI terbaru.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            <FaSync className={loading ? "animate-spin text-[#105091]" : "text-[#105091]"} />
            {stats ? `Diperbarui ${new Date(stats.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : "Memuat pembaruan"}
          </div>
        </div>

        {error ? (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}><Icon /></div>
                  <p className="mt-4 text-sm font-medium text-slate-500">{card.title}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-slate-950">{loading ? "—" : card.value?.toLocaleString("id-ID") ?? "—"}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Kelola konten</h2>
          <p className="mt-1 text-sm text-slate-500">Pilih area kerja yang ingin diperbarui.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#105091]"><Icon /></div>
                <h3 className="mt-4 font-display font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#105091]">Buka <FaArrowRight className="text-xs transition group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </CmsAdminShell>
  );
};

export default AdminDashboardPage;
