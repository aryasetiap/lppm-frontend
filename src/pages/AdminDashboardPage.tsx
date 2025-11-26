import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaHandsHelping,
  FaProjectDiagram,
  FaTrophy,
  FaUsersCog,
  FaFileAlt,
  FaSignOutAlt,
  FaSync,
} from "react-icons/fa";
import { adminAuth } from "../utils/adminAuth";

interface DashboardStats {
  totalPenelitian: number;
  totalPengabdian: number;
  totalPaten: number;
  totalHaki: number;
  updatedAt: string;
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = adminAuth.getUser() ?? "Administrator";

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/statistics.json");
        if (!response.ok) {
          throw new Error("Tidak dapat memuat data statistik.");
        }
        const data = await response.json();
        setStats({
          totalPenelitian: data.total_summary.total_penelitian_blu,
          totalPengabdian: data.total_summary.total_pengabdian_blu,
          totalPaten: data.total_summary.total_paten,
          totalHaki: data.total_summary.total_haki,
          updatedAt: data.metadata.last_updated,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    adminAuth.logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091f43] via-blue-900 to-indigo-950 text-white">
      {/* Top navigation */}
      <header className="border-b border-white/10 bg-white/10 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-100">
              Dashboard Admin
            </p>
            <h1 className="text-2xl font-display font-bold">LPPM Control Center</h1>
          </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-left md:text-right">
              <p className="text-sm text-blue-100">Masuk sebagai</p>
              <p className="font-semibold text-white">{displayName}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#105091] to-blue-600 flex items-center justify-center text-lg font-bold shadow-lg">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-2xl px-4 py-2 text-sm text-red-200 hover:bg-red-500/30 transition-colors whitespace-nowrap font-medium"
            >
              <FaSignOutAlt />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-blue-100 mb-2">
                Ringkasan kinerja terbaru
              </p>
              <h2 className="text-3xl font-display font-semibold">
                Pantau Penelitian & Pengabdian
              </h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <FaSync className="animate-spin" />
              Terakhir diperbarui:{" "}
              <span className="font-semibold text-white">
                {stats
                  ? new Date(stats.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-blue-100">
              Memuat data dashboard...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-200">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Penelitian",
                  value: stats?.totalPenelitian.toLocaleString("id-ID") ?? "-",
                  icon: FaProjectDiagram,
                  gradient: "from-emerald-500 to-emerald-600",
                },
                {
                  title: "Total Pengabdian",
                  value: stats?.totalPengabdian.toLocaleString("id-ID") ?? "-",
                  icon: FaHandsHelping,
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  title: "Total Paten",
                  value: stats?.totalPaten.toLocaleString("id-ID") ?? "-",
                  icon: FaTrophy,
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  title: "Total HKI",
                  value: stats?.totalHaki.toLocaleString("id-ID") ?? "-",
                  icon: FaChartBar,
                  gradient: "from-yellow-500 to-orange-500",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-blue-100 mb-1">{card.title}</p>
                    <p className="text-2xl font-display font-bold">{card.value}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/10 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold">
                Agenda Pengelolaan
              </h3>
              <span className="text-sm text-blue-200">Prioritas mingguan</span>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Review proposal penelitian BLU terbaru",
                  status: "Dalam proses",
                },
                {
                  title: "Kurasi data pengabdian & unggulan desa binaan",
                  status: "Menunggu",
                },
                {
                  title: "Validasi paten & HKI yang masuk periode ini",
                  status: "Prioritas",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <span className="text-xs font-semibold text-blue-200 uppercase">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-display font-semibold mb-4">
              Tindakan Cepat
            </h3>
            <div className="space-y-3">
              {[
                { title: "Kelola Konten JSON", icon: FaFileAlt, link: "/admin/content" },
                { title: "Kelola Pengguna Backend", icon: FaUsersCog, link: null },
                { title: "Sinkronisasi Statistik (coming soon)", icon: FaSync, link: null },
              ].map((action) => {
                const Icon = action.icon;
                if (action.link) {
                  return (
                    <Link
                      key={action.title}
                      to={action.link}
                      className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-blue-200" />
                        <span className="text-sm font-semibold">{action.title}</span>
                      </div>
                      <span className="text-xs text-blue-200">Buka</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={action.title}
                    className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 opacity-70 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-blue-200" />
                      <span className="text-sm font-semibold">{action.title}</span>
                    </div>
                    <span className="text-xs text-blue-200">Segera</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

