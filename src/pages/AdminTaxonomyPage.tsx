import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { FaEdit, FaFolderOpen, FaPlus, FaSave, FaSearch, FaTags, FaTimes } from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import { AdminApiError, adminGet, adminJson } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

type TaxonomyRoute = "categories" | "tags" | "document-categories";

interface Term {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  count: number;
}

interface TaxonomyResponse {
  data: Term[];
}

interface MutationResponse {
  meta: { message?: string };
  data: Term;
}

interface TaxonomyForm {
  name: string;
  slug: string;
  description: string;
  parentId: string;
}

const emptyForm: TaxonomyForm = { name: "", slug: "", description: "", parentId: "" };

const AdminTaxonomyPage = ({ taxonomy }: { taxonomy: TaxonomyRoute }) => {
  const isHierarchical = taxonomy !== "tags";
  const isDocumentCategory = taxonomy === "document-categories";
  const noun = isDocumentCategory ? "kategori dokumen" : isHierarchical ? "kategori" : "tag";
  const plural = isDocumentCategory ? "Kategori Dokumen" : isHierarchical ? "Kategori" : "Tag";
  const contentNoun = isDocumentCategory ? "dokumen" : "berita";
  const Icon = isHierarchical ? FaFolderOpen : FaTags;
  const [items, setItems] = useState<Term[]>([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [editing, setEditing] = useState<Term | null>(null);
  const [form, setForm] = useState<TaxonomyForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    setEditing(null);
    setForm(emptyForm);
    setSearch("");
    setAppliedSearch("");
    setError(null);
    setMessage(null);
    setFormOpen(false);
  }, [taxonomy]);

  useEffect(() => {
    const controller = new AbortController();
    const loadTerms = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams({ per_page: "100" });
        if (appliedSearch.trim()) query.set("search", appliedSearch.trim());
        const result = await adminGet<TaxonomyResponse>(`/admin/taxonomies/${taxonomy}?${query.toString()}`, controller.signal);
        setItems(result.data);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          window.location.assign("/admin/login");
          return;
        }
        setError(caught instanceof Error ? caught.message : `Daftar ${noun} tidak dapat dimuat.`);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadTerms();
    return () => controller.abort();
  }, [appliedSearch, noun, reloadKey, taxonomy]);

  const parentOptions = useMemo(
    () => items.filter((term) => term.id !== editing?.id),
    [editing?.id, items],
  );

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setFormOpen(false);
  };

  const beginCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setMessage(null);
    setFormOpen(true);
  };

  const beginEdit = (term: Term) => {
    setEditing(term);
    setForm({
      name: term.name,
      slug: term.slug,
      description: term.description ?? "",
      parentId: term.parent_id ? String(term.parent_id) : "",
    });
    setMessage(null);
    setError(null);
    setFormOpen(true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const payload: Record<string, unknown> = {
        name: form.name,
        slug: form.slug || null,
        description: form.description || null,
      };
      if (isHierarchical) payload.parent_id = form.parentId ? Number(form.parentId) : null;

      const result = editing
        ? await adminJson<MutationResponse>(`/admin/taxonomies/${taxonomy}/${editing.id}`, "PATCH", payload)
        : await adminJson<MutationResponse>(`/admin/taxonomies/${taxonomy}`, "POST", payload);
      setMessage(result.meta.message ?? `${plural} berhasil disimpan.`);
      resetForm();
      setReloadKey((value) => value + 1);
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        window.location.assign("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : `${plural} tidak dapat disimpan.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <CmsAdminShell title={plural} description={`Atur ${noun} agar konten mudah dikelompokkan dan ditemukan.${isDocumentCategory ? " Perubahan kategori tidak memindahkan file dokumen." : ""}`} mode="manage">
      <div>
        {message && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}
        <section className="cms-panel overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={(event) => { event.preventDefault(); setAppliedSearch(search); }} className="border-b border-slate-200 p-4">
            <label className="relative block">
              <span className="sr-only">Cari {noun}</span>
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#105091] focus:ring-2 focus:ring-blue-100" placeholder={`Cari nama atau slug ${noun}`} />
            </label>
          </form>
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900"><Icon className="text-[#105091]" /> Daftar {plural}</h2>
            <div className="flex items-center gap-3"><span className="hidden text-xs font-semibold text-slate-500 sm:inline">Maks. 100 item</span><button type="button" onClick={beginCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#105091] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0b3f75]"><FaPlus /> Tambah {noun}</button></div>
          </div>
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">Memuat {noun}...</p>
          ) : error && items.length === 0 ? (
            <p className="p-8 text-center text-sm text-red-700">{error}</p>
          ) : items.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">Belum ada {noun} yang sesuai.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((term) => (
                <article key={term.id} className="flex items-start justify-between gap-4 px-5 py-3.5 transition hover:bg-slate-50">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">{term.name}</h3>
                    <p className="mt-1 break-all font-mono text-xs text-slate-600">{term.slug}</p>
                    {term.description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{term.description}</p>}
                    <p className="mt-2 text-xs text-slate-500">{term.count} {contentNoun} · {isHierarchical && term.parent_id ? `Parent #${term.parent_id}` : "Tanpa parent"}</p>
                  </div>
                  <button type="button" onClick={() => beginEdit(term)} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#105091] bg-white px-3 py-2 text-xs font-bold text-[#105091] transition hover:bg-blue-50">
                    <FaEdit /> Edit
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {formOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35" role="dialog" aria-modal="true" aria-label={editing ? `Edit ${noun}` : `Tambah ${noun}`}>
          <button type="button" aria-label="Tutup form" onClick={resetForm} className="absolute inset-0 cursor-default" />
        <section className="cms-panel relative h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-lg font-bold text-slate-900">{editing ? `Edit ${noun}` : `Tambah ${noun}`}</h2><p className="mt-1 text-sm leading-6 text-slate-600">Slug dibuat otomatis dari nama bila dikosongkan.</p></div><button type="button" onClick={resetForm} aria-label="Tutup" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><FaTimes /></button></div>
          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
          {message && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{message}</p>}
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block text-sm font-bold text-slate-800">Nama
              <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="block text-sm font-bold text-slate-800">Slug URL <span className="font-normal text-slate-500">(opsional)</span>
              <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            {isHierarchical && (
              <label className="block text-sm font-bold text-slate-800">Parent <span className="font-normal text-slate-500">(opsional)</span>
                <select value={form.parentId} onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100">
                  <option value="">Tanpa parent</option>
                  {parentOptions.map((term) => <option key={term.id} value={term.id}>{term.name}</option>)}
                </select>
              </label>
            )}
            <label className="block text-sm font-bold text-slate-800">Deskripsi <span className="font-normal text-slate-500">(opsional)</span>
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"><FaTimes /> Batal</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#105091] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b3f75] disabled:cursor-not-allowed disabled:opacity-60"><FaSave /> {saving ? "Menyimpan..." : editing ? "Simpan perubahan" : `Tambah ${noun}`}</button>
            </div>
          </form>
        </section>
          </div>
        )}
      </div>
    </CmsAdminShell>
  );
};

export default AdminTaxonomyPage;
