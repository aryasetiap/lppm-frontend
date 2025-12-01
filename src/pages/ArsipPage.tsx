import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download as DownloadIcon, FileText, RefreshCw } from "lucide-react";

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
  updated_at: string;
  download_url: string;
  permalink: string;
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

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.slug === category),
    [categories, category]
  );

  const copy = useMemo(() => {
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
      const response = await fetch(
        `${LARAVEL_API_BASE}/pos-ap/downloads?category=${category}`
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data POS-AP");
      }

      const payload = await response.json();
      setItems(payload.data || []);
    } catch (err) {
      console.error(err);
      setError("Tidak dapat memuat data POS-AP. Coba muat ulang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!categoriesReady) return;
    fetchDownloads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categoriesReady]);

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
            POS-AP
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            {copy.title}
          </h1>
          <p className="text-blue-100/80 text-lg max-w-3xl">{copy.description}</p>
        </div>

        {categoriesError && (
          <p className="mt-4 text-sm text-red-200">{categoriesError}</p>
        )}

        {categories.length > 0 && (
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
                    Diperbarui: {new Date(item.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={item.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-2xl transition"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </a>
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 text-white/80 hover:bg-white/10 transition"
                  >
                    Detail
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PosApDownloadsPage;

