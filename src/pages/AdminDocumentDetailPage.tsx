import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaDownload, FaEdit, FaFileAlt, FaFolderOpen, FaLock, FaUser } from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import DocumentLifecycleActions from "../components/admin/DocumentLifecycleActions";
import { AdminApiError, adminDownload, adminGet } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

interface DocumentItem {
  id: number;
  source: "wpdmpro" | "book_writing" | "attachment";
  source_label: string;
  title: string;
  slug: string;
  status: string;
  date: string;
  modified_at: string;
  excerpt: string;
  content: string;
  author: { id: number; name: string };
  categories: Array<{ id: number; name: string; slug: string }>;
  file: { available: boolean; status: string; name: string | null; access: "public" | "restricted"; download_url: string | null; download_api_path: string | null };
}

interface DetailResponse { data: DocumentItem }

const statusLabels: Record<string, string> = { publish: "Terbit", draft: "Draft", future: "Terjadwal", pending: "Menunggu", private: "Privat", trash: "Sampah" };

const formatDate = (value: string): string => {
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
};

const previewDocument = (html: string): string => `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:28px;font:16px/1.7 system-ui,sans-serif;color:#1e293b;overflow-wrap:anywhere}img{max-width:100%;height:auto}a{color:#0f5a9e}table{max-width:100%;border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:8px}</style></head><body>${html}</body></html>`;

const AdminDocumentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminGet<DetailResponse>(`/admin/cms/documents/${id}`, controller.signal);
        setItem(result.data);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Detail dokumen tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    if (id) void loadDocument();
    return () => controller.abort();
  }, [id, navigate]);

  const preview = useMemo(() => previewDocument(item?.content ?? ""), [item?.content]);

  const download = async () => {
    if (!item) return;
    if (item.file.download_url) {
      window.open(item.file.download_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!item.file.download_api_path) return;
    try {
      setDownloading(true);
      setDownloadError(null);
      await adminDownload(item.file.download_api_path, item.file.name ?? "dokumen");
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setDownloadError(caught instanceof Error ? caught.message : "Dokumen tidak dapat diunduh.");
    } finally {
      setDownloading(false);
    }
  };

  return <CmsAdminShell title={item ? "Detail Dokumen" : "Detail dokumen"} description="Tinjau informasi, file, akses unduhan, kategori, dan status publikasi dokumen." mode="document">
    {loading ? <div className="cms-panel rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Memuat detail dokumen...</div> : error ? <div className="rounded-2xl bg-red-50 p-8 text-center text-sm text-red-700"><p>{error}</p><Link to="/admin/documents" className="mt-4 inline-flex font-bold text-[#105091]">Kembali ke daftar dokumen</Link></div> : item && <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
      <article className="cms-panel min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-7 sm:py-6"><Link to="/admin/documents" className="inline-flex items-center gap-2 text-sm font-bold text-[#105091] hover:underline"><FaArrowLeft /> Kembali ke daftar dokumen</Link><h2 className="mt-5 font-display text-2xl font-bold text-slate-900 sm:text-3xl">{item.title || "(Tanpa judul)"}</h2>{item.excerpt && <p className="mt-3 leading-7 text-slate-600">{item.excerpt}</p>}</div>
        <div className="p-4 sm:p-6"><div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-display text-base font-bold text-slate-800">Deskripsi dokumen</h3><span className="text-xs text-slate-500">Mode aman</span></div>{item.content ? <iframe title={`Deskripsi ${item.title}`} sandbox="allow-same-origin" srcDoc={preview} className="min-h-[420px] w-full rounded-xl border border-slate-200 bg-white" /> : <p className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Dokumen ini tidak memiliki deskripsi.</p>}</div>
      </article>
      <aside className="space-y-5">
        <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="flex items-center gap-2 font-display font-bold text-slate-900"><FaFileAlt className="text-[#105091]" /> File dokumen</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Status file</dt><dd className={`mt-1 font-semibold ${item.file.available ? "text-emerald-700" : "text-amber-800"}`}>{item.file.available ? "Tersedia" : "Tidak tersedia"}</dd></div><div><dt className="text-slate-500">Nama file</dt><dd className="mt-1 break-all font-mono text-xs text-slate-800">{item.file.name ?? "Tidak tercatat"}</dd></div><div><dt className="text-slate-500">Akses</dt><dd className="mt-1 inline-flex items-center gap-2 font-semibold text-slate-800">{item.file.access === "restricted" && <FaLock className="text-amber-700" />}{item.file.access === "public" ? "Publik melalui Laravel" : "Terbatas melalui sesi admin"}</dd></div></dl>{downloadError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{downloadError}</p>}{item.file.available ? <button type="button" onClick={() => void download()} disabled={downloading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75] disabled:opacity-60"><FaDownload /> {downloading ? "Mengunduh..." : "Unduh dokumen"}</button> : <p className="mt-5 rounded-xl bg-amber-50 px-3 py-3 text-xs leading-5 text-amber-900">File belum dapat dilayani. Ganti file atau perbaiki lokasi file yang tercatat.</p>}</section>
        <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-display font-bold text-slate-900">Informasi dokumen</h3><dl className="mt-4 space-y-4 text-sm"><div><dt className="text-slate-500">Status</dt><dd className="mt-1 font-semibold text-slate-900">{statusLabels[item.status] ?? item.status}</dd></div><div><dt className="text-slate-500">Slug</dt><dd className="mt-1 break-all font-mono text-xs text-slate-800">{item.slug || "—"}</dd></div><div className="flex gap-2"><FaUser className="mt-1 text-[#105091]" /><div><dt className="text-slate-500">Penulis</dt><dd className="font-semibold text-slate-900">{item.author.name}</dd></div></div><div className="flex gap-2"><FaCalendarAlt className="mt-1 text-[#105091]" /><div><dt className="text-slate-500">Tanggal</dt><dd className="font-semibold text-slate-900">{formatDate(item.date)}</dd></div></div></dl>{item.source === "wpdmpro" && item.status === "draft" && <Link to={`/admin/documents/${item.id}/edit`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75]"><FaEdit /> Edit draft</Link>}</section>
        <DocumentLifecycleActions document={item} onUnauthorized={() => navigate("/admin/login", { replace: true })} onCompleted={() => window.location.reload()} />
        {item.categories.length > 0 && <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="flex items-center gap-2 font-display font-bold text-slate-900"><FaFolderOpen className="text-[#105091]" /> Kategori dokumen</h3><div className="mt-3 flex flex-wrap gap-2">{item.categories.map((category) => <span key={category.id} className="cms-taxonomy-badge cms-category-badge">{category.name}</span>)}</div></section>}
      </aside>
    </div>}
  </CmsAdminShell>;
};

export default AdminDocumentDetailPage;
