import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChevronDown, FaChevronLeft, FaChevronRight, FaEdit, FaEye, FaFilter, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import { AdminApiError, adminGet } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

type ContentType = "post" | "page";

const versionedThumbnail = (url: string, item: { id: number; modified_at: string }): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(`${item.id}-${item.modified_at}`)}`;
};

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  slug: string;
  status: string;
  date: string;
  modified_at: string;
  excerpt: string;
  author: { id: number; name: string };
  thumbnail: string | null;
}

interface PostListResponse {
  meta: { pagination: Pagination };
  data: ContentItem[];
}

interface SelectOption {
  id: number;
  name: string;
}

interface AuthorResponse {
  data: Array<SelectOption & { content_count: number }>;
}

interface CategoryResponse {
  data: SelectOption[];
}

interface Filters {
  search: string;
  status: string;
  authorId: string;
  categoryId: string;
  dateFrom: string;
  dateTo: string;
}

const emptyFilters: Filters = {
  search: "",
  status: "",
  authorId: "",
  categoryId: "",
  dateFrom: "",
  dateTo: "",
};

const statusLabels: Record<string, string> = {
  publish: "Terbit",
  future: "Terjadwal",
  draft: "Draft",
  pending: "Menunggu tinjauan",
  private: "Pribadi",
  trash: "Sampah",
};

const statusClass: Record<string, string> = {
  publish: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  future: "bg-blue-50 text-blue-700 ring-blue-200",
  draft: "bg-amber-50 text-amber-700 ring-amber-200",
  pending: "bg-violet-50 text-violet-700 ring-violet-200",
  private: "bg-slate-100 text-slate-700 ring-slate-200",
  trash: "bg-red-50 text-red-700 ring-red-200",
};

const formatDate = (value: string): string => {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const queryString = (type: ContentType, filters: Filters, page: number): string => {
  const query = new URLSearchParams({ type, per_page: "20", page: String(page) });
  if (filters.search.trim()) query.set("search", filters.search.trim());
  if (filters.status) query.set("status", filters.status);
  if (filters.authorId) query.set("author_id", filters.authorId);
  if (filters.categoryId) query.set("category_id", filters.categoryId);
  if (filters.dateFrom) query.set("date_from", filters.dateFrom);
  if (filters.dateTo) query.set("date_to", filters.dateTo);

  return query.toString();
};

const AdminCmsListPage = ({ type }: { type: ContentType }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [authors, setAuthors] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const labels = useMemo(() => (
    type === "post"
      ? { plural: "Berita", singular: "berita", description: "Kelola berita, draft, dan publikasi yang tampil pada website LPPM." }
      : { plural: "Halaman", singular: "halaman", description: "Kelola halaman informasi tetap pada website LPPM." }
  ), [type]);

  useEffect(() => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  }, [type]);

  useEffect(() => {
    const controller = new AbortController();

    const loadFilterOptions = async () => {
      try {
        setLoadingFilters(true);
        const requests: [Promise<AuthorResponse>, Promise<CategoryResponse | null>] = [
          adminGet<AuthorResponse>(`/admin/authors?type=${type}&per_page=100`, controller.signal),
          type === "post"
            ? adminGet<CategoryResponse>("/admin/taxonomies/categories?per_page=100", controller.signal)
            : Promise.resolve(null),
        ];
        const [authorResult, categoryResult] = await Promise.all(requests);

        setAuthors(authorResult.data);
        setCategories(categoryResult?.data ?? []);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Filter konten tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoadingFilters(false);
      }
    };

    void loadFilterOptions();
    return () => controller.abort();
  }, [navigate, type]);

  useEffect(() => {
    const controller = new AbortController();

    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminGet<PostListResponse>(
          `/admin/posts?${queryString(type, appliedFilters, page)}`,
          controller.signal,
        );
        setItems(result.data);
        setPagination(result.meta.pagination);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Daftar konten tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadItems();
    return () => controller.abort();
  }, [appliedFilters, navigate, page, type]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const applyStatus = (status: string) => {
    const next = { ...filters, status };
    setFilters(next);
    setAppliedFilters(next);
    setPage(1);
  };

  const activeAdvancedFilterCount = [filters.authorId, filters.categoryId, filters.dateFrom, filters.dateTo]
    .filter(Boolean).length;

  return (
    <CmsAdminShell title={labels.plural} description={labels.description}>
      <form onSubmit={applyFilters} className="cms-panel mb-5 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 pt-3" aria-label="Filter status">
          {[['', 'Semua'], ['publish', 'Terbit'], ['draft', 'Draft'], ['future', 'Terjadwal'], ['pending', 'Menunggu'], ['trash', 'Sampah']].map(([value, label]) => (
            <button key={value || 'all'} type="button" onClick={() => applyStatus(value)} className={`border-b-2 px-3 py-2 text-sm font-semibold transition ${appliedFilters.status === value ? "border-[#105091] text-[#105091]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Cari {labels.singular}</span>
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#105091] focus:ring-2 focus:ring-blue-100"
                placeholder="Cari judul atau isi"
              />
            </div>
          </label>
          <button type="button" onClick={() => setShowAdvancedFilters((current) => !current)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <FaFilter /> Filter lainnya {activeAdvancedFilterCount > 0 && <span className="rounded-full bg-[#105091] px-2 py-0.5 text-xs text-white">{activeAdvancedFilterCount}</span>} <FaChevronDown className={`text-xs transition ${showAdvancedFilters ? "rotate-180" : ""}`} />
          </button>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b3f75]">
            <FaSearch /> Cari
          </button>
        </div>
        {showAdvancedFilters && (
          <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <select value={filters.authorId} onChange={(event) => updateFilter("authorId", event.target.value)} disabled={loadingFilters} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100">
              <option value="">Semua penulis</option>
              {authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
            </select>
            {type === "post" && (
              <select value={filters.categoryId} onChange={(event) => updateFilter("categoryId", event.target.value)} disabled={loadingFilters} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100">
                <option value="">Semua kategori</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            )}
            <label className="relative">
              <span className="sr-only">Tanggal mulai</span>
              <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="date" value={filters.dateFrom} onChange={(event) => updateFilter("dateFrom", event.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="relative">
              <span className="sr-only">Tanggal selesai</span>
              <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="date" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(event) => updateFilter("dateTo", event.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <div className="flex justify-end sm:col-span-2 xl:col-span-4">
              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white"><FaTimes /> Hapus semua filter</button>
            </div>
          </div>
        )}
      </form>

      <div className="cms-panel overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Daftar {labels.plural}</h2>
            <p className="text-sm text-slate-500">
              {pagination ? `${pagination.total.toLocaleString("id-ID")} ${labels.singular} ditemukan` : "Memuat jumlah konten..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-slate-500 sm:inline">20 per halaman</span>
            <Link to={`/admin/${type === "post" ? "posts" : "pages"}/new`} className="inline-flex items-center gap-2 rounded-xl bg-[#105091] px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b3f75]">
              <FaPlus /> Buat {labels.singular}
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Memuat daftar {labels.singular}...</div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-700">
            <p>{error}</p>
            <button type="button" onClick={() => setAppliedFilters({ ...appliedFilters })} className="mt-3 font-semibold text-[#105091] hover:underline">Coba lagi</button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">Tidak ada {labels.singular} yang cocok dengan filter ini.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <article key={item.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 sm:px-5">
                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {item.thumbnail ? (
                    <img src={versionedThumbnail(item.thumbnail, item)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-semibold text-slate-500">Tanpa foto</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusClass[item.status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                      {statusLabels[item.status] ?? item.status}
                    </span>
                    <span className="text-xs text-slate-500">Diperbarui {formatDate(item.modified_at)}</span>
                  </div>
                  <h3 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 sm:text-base">{item.title || "(Tanpa judul)"}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.excerpt || `/${item.slug || "tanpa-slug"}`}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">{item.author.name} · {formatDate(item.date)}</p>
                    <div className="flex gap-2">
                      <Link to={`/admin/${item.type === "page" ? "pages" : "posts"}/${item.id}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-[#105091] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0b3f75]"><FaEdit /> Edit</Link>
                      <Link to={`/admin/${item.type === "page" ? "pages" : "posts"}/${item.id}`} aria-label={`Lihat detail ${item.title}`} className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-[#105091]"><FaEye /></Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 sm:px-5">
            <button type="button" disabled={pagination.current_page <= 1} onClick={() => setPage((current) => Math.max(current - 1, 1))} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              <FaChevronLeft /> Sebelumnya
            </button>
            <span className="text-sm text-slate-600">Halaman {pagination.current_page} dari {pagination.last_page}</span>
            <button type="button" disabled={pagination.current_page >= pagination.last_page} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              Berikutnya <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </CmsAdminShell>
  );
};

export default AdminCmsListPage;
