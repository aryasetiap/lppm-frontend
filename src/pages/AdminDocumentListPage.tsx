import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDownload, FaEdit, FaEye, FaFileAlt, FaPlus, FaSearch } from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import { AdminApiError, adminGet } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

interface DocumentFile {
  available: boolean;
  status: string;
  name: string | null;
  access: "public" | "restricted";
  download_url: string | null;
}

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
  categories: Array<{ id: number; name: string; slug: string }>;
  file: DocumentFile;
}

interface DocumentListResponse {
  meta: { pagination: { total: number; current_page: number; last_page: number } };
  data: DocumentItem[];
}

const statusLabels: Record<string, string> = {
  publish: "Terbit",
  draft: "Draft",
  future: "Terjadwal",
  pending: "Menunggu",
  private: "Privat",
  trash: "Sampah",
};

const availabilityLabel = (file: DocumentFile): string => {
  if (file.available) return file.access === "public" ? "File tersedia · publik" : "File tersedia · akses admin";
  if (file.status === "missing_file_reference") return "Tidak tersedia · belum ada referensi file";
  if (file.status === "absolute_path_reference") return "Tidak tersedia · lokasi file perlu diperbaiki";
  return "Tidak tersedia · file tidak ditemukan";
};

const AdminDocumentListPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<DocumentListResponse["meta"]["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page: String(page), per_page: "20" });
        if (search.trim()) params.set("search", search.trim());
        if (status) params.set("status", status);
        params.set("source", source);
        const result = await adminGet<DocumentListResponse>(`/admin/cms/documents?${params.toString()}`, controller.signal);
        setItems(result.data);
        setPagination(result.meta.pagination);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Daftar dokumen tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadDocuments();
    return () => controller.abort();
  }, [navigate, page, search, source, status]);

  const applyFilters = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <CmsAdminShell title="Dokumen" description="Kelola dokumen publik, dokumen terbatas, Penulisan Buku, dan arsip pendukung LPPM." mode="document">
      <section className="cms-panel overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={(event) => { event.preventDefault(); applyFilters(); }} className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
          <label className="relative block">
            <span className="sr-only">Cari dokumen</span>
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Cari judul, isi, atau excerpt" className="cms-admin-control w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
          </label>
          <select value={source} onChange={(event) => { setSource(event.target.value); setPage(1); }} className="cms-admin-control rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100">
            <option value="all">Semua sumber</option>
            <option value="wpdmpro">Download Manager</option>
            <option value="book_writing">Penulisan Buku</option>
            <option value="attachments">Arsip & Dokumen Penunjang</option>
          </select>
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="cms-admin-control rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100">
            <option value="">Semua status</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button type="submit" className="rounded-xl bg-[#105091] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b3f75]">Terapkan</button>
        </form>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900"><FaFileAlt className="text-[#105091]" /> Semua Dokumen</h2>
            <p className="mt-1 text-sm text-slate-600">{pagination ? `${pagination.total} dokumen ditemukan` : "Memuat jumlah dokumen..."}</p>
          </div>
          <Link to="/admin/documents/new" className="inline-flex items-center gap-2 rounded-xl bg-[#105091] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0b3f75]"><FaPlus /> Tambah dokumen</Link>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">Memuat dokumen...</p>
        ) : error ? (
          <p className="m-5 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">{error}</p>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">Tidak ada dokumen yang sesuai.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 px-5 py-3.5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#105091] ring-1 ring-inset ring-blue-200">{statusLabels[item.status] ?? item.status}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">{item.source_label}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${item.file.available ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200"}`}>{availabilityLabel(item.file)}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900">{item.title || "(Tanpa judul)"}</h3>
                  {item.excerpt && <p className="mt-1 line-clamp-1 text-sm text-slate-600">{item.excerpt}</p>}
                  <p className="mt-2 break-all text-xs text-slate-500">{item.file.name ?? "Tanpa nama file"}</p>
                  {item.categories.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.categories.map((category) => <span key={category.id} className="cms-taxonomy-badge cms-category-badge">{category.name}</span>)}</div>}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {item.file.download_url && <a href={item.file.download_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"><FaDownload /> Unduh publik</a>}
                  <Link to={`/admin/documents/${item.id}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-[#105091] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0b3f75]"><FaEdit /> Edit</Link>
                  <Link to={`/admin/documents/${item.id}`} aria-label={`Lihat detail ${item.title}`} className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-[#105091]"><FaEye /></Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination && pagination.last_page > 1 && <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-600"><span>Halaman {pagination.current_page} dari {pagination.last_page}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Sebelumnya</button><button type="button" disabled={page >= pagination.last_page} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Selanjutnya</button></div></div>}
      </section>
    </CmsAdminShell>
  );
};

export default AdminDocumentListPage;
