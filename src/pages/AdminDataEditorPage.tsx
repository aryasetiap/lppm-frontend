import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaDatabase,
  FaFileCode,
  FaSave,
  FaSyncAlt,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSignOutAlt,
} from "react-icons/fa";
import { adminAuth } from "../utils/adminAuth";
import ProfileForm from "../components/admin/ProfileForm";
import StatisticsForm from "../components/admin/StatisticsForm";
import SubBagianForm from "../components/admin/SubBagianForm";

const LARAVEL_API_BASE =
  (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

const DATASETS = [
  {
    id: "profile",
    title: "Profil LPPM",
    description: "Konten profil, visi misi, tugas & struktur organisasi.",
    apiPath: "/admin/content/profile",
    fallback: "/data/profile-lppm.json",
  },
  {
    id: "statistics",
    title: "Statistik Penelitian & Pengabdian",
    description: "Angka penelitian, pengabdian, HKI, dan paten.",
    apiPath: "/admin/content/statistics",
    fallback: "/data/statistics.json",
  },
  {
    id: "subbagian",
    title: "Sub Bagian & Unit",
    description: "Daftar PUI, PUSLIT, administrasi, beserta detailnya.",
    apiPath: "/admin/content/sub-bagian",
    fallback: "/data/sub-bagian-lppm.json",
  },
];

const StatisticsQuickEditor = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  if (!data) return null;

  const safeData = {
    metadata: data.metadata || {},
    total_summary: data.total_summary || {
      total_penelitian_blu: 0,
      total_pengabdian_blu: 0,
      total_paten: 0,
      total_haki: 0,
      growth_penelitian: 0,
      growth_pengabdian: 0,
      growth_paten: 0,
      growth_haki: 0,
    },
    yearly_data: data.yearly_data || [],
    quarterly_data: data.quarterly_data || [],
  };

  const updateTotalSummary = (field: string, value: number) => {
    const next = {
      ...data,
      total_summary: {
        ...safeData.total_summary,
        [field]: value,
      },
    };
    onChange(next);
  };

  const updateYearlyData = (index: number, field: string, value: number) => {
    const yearly = safeData.yearly_data.map((item: any, idx: number) =>
      idx === index ? { ...item, [field]: value } : item
    );
    onChange({
      ...data,
      yearly_data: yearly,
    });
  };

  const updateQuarterlyData = (index: number, field: string, value: number | string) => {
    const quarterly = safeData.quarterly_data.map((item: any, idx: number) =>
      idx === index ? { ...item, [field]: value } : item
    );
    onChange({
      ...data,
      quarterly_data: quarterly,
    });
  };

  const summaryFields = [
    { key: "total_penelitian_blu", label: "Total Penelitian" },
    { key: "total_pengabdian_blu", label: "Total Pengabdian" },
    { key: "total_paten", label: "Total Paten" },
    { key: "total_haki", label: "Total HKI" },
  ];

  const growthFields = [
    { key: "growth_penelitian", label: "Growth Penelitian (%)" },
    { key: "growth_pengabdian", label: "Growth Pengabdian (%)" },
    { key: "growth_paten", label: "Growth Paten (%)" },
    { key: "growth_haki", label: "Growth HKI (%)" },
  ];

  return (
    <section className="bg-white/10 border border-white/20 rounded-3xl p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Edit • Ringkasan Angka</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryFields.map((field) => (
            <label key={field.key} className="block bg-[#0b1f3d] border border-white/10 rounded-2xl p-4">
              <span className="text-xs uppercase tracking-wide text-blue-100">{field.label}</span>
              <input
                type="number"
                value={safeData.total_summary[field.key] ?? 0}
                onChange={(e) => updateTotalSummary(field.key, parseInt(e.target.value) || 0)}
                className="mt-2 w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {growthFields.map((field) => (
            <label key={field.key} className="block bg-[#0b1f3d] border border-white/10 rounded-2xl p-4">
              <span className="text-xs uppercase tracking-wide text-blue-100">{field.label}</span>
              <input
                type="number"
                step="0.1"
                value={safeData.total_summary[field.key] ?? 0}
                onChange={(e) => updateTotalSummary(field.key, parseFloat(e.target.value) || 0)}
                className="mt-2 w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>
          ))}
        </div>
      </div>

      {safeData.yearly_data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Quick Edit • Data Tahunan</h3>
            <p className="text-xs text-blue-100">Masukkan angka sesuai JSON tahunan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-blue-50">
              <thead>
                <tr className="text-blue-200 uppercase text-xs tracking-wider">
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3">Penelitian BLU</th>
                  <th className="px-4 py-3">Pengabdian BLU</th>
                  <th className="px-4 py-3">Paten</th>
                  <th className="px-4 py-3">HKI</th>
                </tr>
              </thead>
              <tbody>
                {safeData.yearly_data.map((row: any, index: number) => (
                  <tr key={row.year ?? index} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.year ?? 0}
                        onChange={(e) => updateYearlyData(index, "year", parseInt(e.target.value) || 0)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.penelitian_blu ?? 0}
                        onChange={(e) =>
                          updateYearlyData(index, "penelitian_blu", parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.pengabdian_blu ?? 0}
                        onChange={(e) =>
                          updateYearlyData(index, "pengabdian_blu", parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.paten ?? 0}
                        onChange={(e) => updateYearlyData(index, "paten", parseInt(e.target.value) || 0)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.haki ?? 0}
                        onChange={(e) => updateYearlyData(index, "haki", parseInt(e.target.value) || 0)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {safeData.quarterly_data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Quick Edit • Data Kuartalan</h3>
            <p className="text-xs text-blue-100">Sesuaikan angka per kuartal di sini</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-blue-50">
              <thead>
                <tr className="text-blue-200 uppercase text-xs tracking-wider">
                  <th className="px-4 py-3">Kuartal</th>
                  <th className="px-4 py-3">Penelitian BLU</th>
                  <th className="px-4 py-3">Pengabdian BLU</th>
                </tr>
              </thead>
              <tbody>
                {safeData.quarterly_data.map((row: any, index: number) => (
                  <tr key={row.quarter ?? index} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.quarter ?? ""}
                        onChange={(e) => updateQuarterlyData(index, "quarter", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.penelitian_blu ?? 0}
                        onChange={(e) =>
                          updateQuarterlyData(index, "penelitian_blu", parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={row.pengabdian_blu ?? 0}
                        onChange={(e) =>
                          updateQuarterlyData(index, "pengabdian_blu", parseInt(e.target.value) || 0)
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

const AdminDataEditorPage = () => {
  const navigate = useNavigate();
  const token = adminAuth.getToken();
  const [selectedId, setSelectedId] = useState(DATASETS[0].id);
  const [rawContent, setRawContent] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedDataset = useMemo(
    () => DATASETS.find((d) => d.id === selectedId) || DATASETS[0],
    [selectedId]
  );

  const fetchDataset = async () => {
    if (!selectedDataset) return;
    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const response = await fetch(
        `${LARAVEL_API_BASE}${selectedDataset.apiPath}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      let jsonData;
      if (response.ok) {
        jsonData = await response.json();
      } else {
        // fallback to local JSON (read-only)
        const fallbackRes = await fetch(selectedDataset.fallback);
        jsonData = await fallbackRes.json();
        setStatusMessage("Tidak dapat memuat dari backend. Menampilkan data lokal (read-only).");
      }
      setParsedData(jsonData);
      setRawContent(JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data. Periksa koneksi backend atau file fallback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataset?.id]);

  const handleSave = async () => {
    if (!selectedDataset) return;
    if (!token) {
      setError("Token admin tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setStatusMessage(null);

      // Gunakan parsedData jika ada (dari form), atau parse rawContent (dari JSON editor)
      const dataToSave = parsedData || JSON.parse(rawContent);
      
      const response = await fetch(
        `${LARAVEL_API_BASE}${selectedDataset.apiPath}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSave),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Gagal menyimpan data.");
      }

      setStatusMessage("Berhasil menyimpan perubahan ke backend. File JSON telah diupdate.");
      // Refresh data setelah save
      setTimeout(() => fetchDataset(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091f43] via-blue-900 to-indigo-950 text-white">
      <header className="border-b border-white/10 bg-white/10 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-100">
                Admin • Konten JSON
              </p>
              <h1 className="text-2xl font-display font-bold">
                Editor Data Statik LPPM
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors whitespace-nowrap"
              >
                <FaArrowLeft /> Kembali ke Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-2xl px-4 py-2 text-sm text-red-200 hover:bg-red-500/30 transition-colors whitespace-nowrap font-medium"
              >
                <FaSignOutAlt />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {DATASETS.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => setSelectedId(dataset.id)}
              className={`text-left bg-white/5 border rounded-2xl p-4 transition-all ${
                selectedId === dataset.id
                  ? "border-blue-400/60 bg-white/10 shadow-lg"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <FaDatabase className="text-blue-200" />
                <span className="font-semibold">{dataset.title}</span>
              </div>
              <p className="text-sm text-blue-100">{dataset.description}</p>
            </button>
          ))}
        </section>

        {selectedId === "statistics" && parsedData && (
          <StatisticsQuickEditor
            data={parsedData}
            onChange={(newData) => {
              setParsedData(newData);
              setRawContent(JSON.stringify(newData, null, 2));
            }}
          />
        )}

        <section className="bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
                <FaFileCode />
                Edit {selectedDataset?.title}
              </h2>
              <p className="text-sm text-blue-100">
                Pastikan format JSON valid sebelum menyimpan ke backend Laravel.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchDataset}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-sm hover:bg-white/20 transition disabled:opacity-60"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                Muat Ulang
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-2xl transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FaSave />
                Simpan Perubahan
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="bg-blue-500/10 border border-blue-400/40 text-blue-100 text-sm rounded-2xl px-4 py-3">
              {statusMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-400/40 text-red-100 text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
                <FaSyncAlt className="w-8 h-8 text-white animate-spin" />
              </div>
              <p className="text-blue-100">Memuat data...</p>
            </div>
          ) : selectedId === "profile" && parsedData ? (
            <ProfileForm
              data={parsedData}
              onChange={(newData) => {
                setParsedData(newData);
                setRawContent(JSON.stringify(newData, null, 2));
              }}
            />
          ) : selectedId === "statistics" && parsedData ? (
            <StatisticsForm
              data={parsedData}
              onChange={(newData) => {
                setParsedData(newData);
                setRawContent(JSON.stringify(newData, null, 2));
              }}
            />
          ) : selectedId === "subbagian" && parsedData ? (
            <SubBagianForm
              data={parsedData}
              onChange={(newData) => {
                setParsedData(newData);
                setRawContent(JSON.stringify(newData, null, 2));
              }}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-blue-100 mb-2 block">
                  Konten JSON
                </label>
                <textarea
                  className="w-full min-h-[400px] bg-[#0b1f3d] border border-white/10 rounded-2xl p-4 font-mono text-sm text-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  value={rawContent}
                  onChange={(e) => {
                    setRawContent(e.target.value);
                    try {
                      setParsedData(JSON.parse(e.target.value));
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                />
              </div>
              <div className="bg-black/20 border border-white/10 rounded-2xl p-4 overflow-auto">
                <label className="text-sm font-semibold text-blue-100 mb-2 block">
                  Preview Format
                </label>
                <pre className="text-xs text-blue-50 whitespace-pre-wrap">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(rawContent), null, 2);
                    } catch {
                      return "JSON tidak valid.";
                    }
                  })()}
                </pre>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDataEditorPage;

