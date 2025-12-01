import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download as DownloadIcon, FileText, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";

const LARAVEL_API_BASE =
  (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
  (typeof window !== "undefined" && (window.location.hostname === "lppm.unila.ac.id" || window.location.hostname.includes("unila.ac.id"))
    ? "https://lppm.unila.ac.id/api"
    : "http://localhost:8000/api");

interface DownloadItem {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  updated_at?: string;
  date?: string;
  download_url?: string;
  url?: string;
  permalink?: string;
  type?: string;
  mime?: string;
}

interface PosApCategory {
  slug: string;
  name: string;
  count: number;
}

const PosApDownloadsPage = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<PosApCategory[]>([]);
  const [categoriesReady, setCategoriesReady] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Search & Pagination State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.slug === category),
    [categories, category]
  );

  const copy = useMemo(() => {
    if (category === "dokumen") {
      return {
        title: "Arsip Dokumen",
        description: "Kumpulan dokumen, surat keputusan, dan berkas penting lainnya.",
        badge: "DOKUMEN",
      };
    }

    if (activeCategory) {
      return {
        title: `Download ${activeCategory.name}`,
        description: `Kumpulan berkas kategori ${activeCategory.name}.`,
        badge: activeCategory.name,
      };
    }

    return {
      title: "Download POS-AP",
      description: "Kumpulan berkas POS-AP terbaru yang siap diunduh.",
      badge: category ? category.toUpperCase() : "POS-AP",
    };
  }, [activeCategory, category]);

  const ensureValidCategory = (list: PosApCategory[]) => {
    if (category === "dokumen") {
      setCategoriesReady(true);
      return;
    }

    if (list.length === 0) {
      setCategoriesReady(true);
      return;
    }

    if (!category) {
      navigate(`/arsip/${list[0].slug}`, { replace: true });
      return;
    }

    if (category !== "pos-ap" && !list.some((cat) => cat.slug === category)) {
      navigate(`/arsip/${list[0].slug}`, { replace: true });
      return;
    }

    setCategoriesReady(true);
  };

  const fetchCategories = async () => {
    try {
      setCategoriesError(null);
      const response = await fetch(`${LARAVEL_API_BASE}/pos-ap/categories`);
      if (!response.ok) {
        throw new Error("Gagal memuat kategori POS-AP");
      }
      const payload = await response.json();
      const list: PosApCategory[] = payload.data || [];
      setCategories(list);
      ensureValidCategory(list);
    } catch (err) {
      console.error(err);
      setCategories([]);
      setCategoriesError("Tidak dapat memuat daftar kategori POS-AP.");
      setCategoriesReady(true);
    }
  };

  const fetchDownloads = async () => {
    if (!category) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let url = `${LARAVEL_API_BASE}/pos-ap/downloads?category=${category}`;
      if (category === "dokumen") {
        url = `${LARAVEL_API_BASE}/documents?page=${page}&limit=10`;
        if (debouncedSearch) {
          url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Gagal memuat data");
      }

      const payload = await response.json();
      setItems(payload.data || []);

      if (category === "dokumen" && payload.meta?.pagination) {
        setTotalPages(payload.meta.pagination.last_page);
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat memuat data. Coba muat ulang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (!categoriesReady) return;
    fetchDownloads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categoriesReady, page, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#091f43] via-blue-900 to-slate-950 text-white">
      <header className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100/80 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <span>/</span>
          <span className="font-semibold">POS-AP</span>
          <span>/</span>
          <span className="uppercase tracking-wide">{copy.badge}</span>
        </div>

        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm uppercase tracking-widest">
            <FileText className="w-4 h-4" />
            {category === "dokumen" ? "ARSIP DOKUMEN" : "POS-AP"}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            {copy.title}
          </h1>
          <p className="text-blue-100/80 text-lg max-w-3xl">{copy.description}</p>
        </div>

        {categoriesError && (
          <p className="mt-4 text-sm text-red-200">{categoriesError}</p>
        )}

        {/* Hide categories if in 'dokumen' mode */}
        {category !== "dokumen" && categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((cat) => {
              const isActive = cat.slug === category;
              return (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/arsip/${cat.slug}`)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition ${isActive
                    ? "bg-white/20 border-white/40 text-white"
                    : "bg-white/5 border-white/15 text-blue-100 hover:bg-white/10"
                    }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-blue-100/60">({cat.count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search Bar for Dokumen */}
        {category === "dokumen" && (
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-200" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
                placeholder="Cari dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-blue-100/80">
            Menampilkan {items.length} entri dari kategori <strong>{copy.badge}</strong>.
          </p>
          <button
            onClick={fetchDownloads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition disabled:opacity-50"
          >
            <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            Muat Ulang
          </button>
        </div>

        {loading ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 animate-pulse">
              <DownloadIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-blue-100">Memuat daftar POS-AP...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-400/40 text-red-100 rounded-3xl p-6 text-center space-y-3">
            <p>{error}</p>
            <button
              onClick={fetchDownloads}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/50 hover:bg-red-500/30 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-blue-100">Belum ada data pada kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white/10 transition"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-blue-100/80 text-sm mb-2 line-clamp-2">{item.excerpt}</p>
                  <p className="text-xs text-blue-100/60">
                    {item.date ? `Tanggal: ${new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}` : `Diperbarui: ${new Date(item.updated_at || "").toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}`}
                    {item.type && (
                      <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-xs uppercase">
                        {item.type}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={item.download_url || item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-2xl transition"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </a>
                  {item.permalink && (
                    <a
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 text-white/80 hover:bg-white/10 transition"
                    >
                      Detail
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {category === "dokumen" && totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-4 mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>
                <span className="text-sm text-blue-100">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PosApDownloadsPage;

