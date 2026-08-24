import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FaArrowLeft, FaCloudUploadAlt, FaFileAlt, FaFolderOpen, FaGlobe, FaLock, FaSave } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import { AdminApiError, adminForm, adminGet, adminJson } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface TaxonomyResponse { data: Category[] }

interface DocumentDetail {
  id: number;
  source: "wpdmpro" | "book_writing" | "attachment";
  title: string;
  slug: string;
  status: string;
  modified_at: string;
  excerpt: string;
  content: string;
  categories: Category[];
  file: { available: boolean; name: string | null; status: string };
}

interface DetailResponse { data: DocumentDetail }
interface MutationResponse {
  meta: { message?: string };
  data: { id: number; title: string; slug: string; status: string; modified_at: string };
}
interface UploadResponse {
  meta: { message?: string };
  data: { file_name: string; mime: string; size: number; modified_at: string };
}
interface PublicationResponse {
  meta: { message?: string };
  data: { id: number; status: string; access: "public" | "restricted"; modified_at: string };
}

interface EditorForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryIds: number[];
}

const emptyForm: EditorForm = { title: "", slug: "", excerpt: "", content: "", categoryIds: [] };
const permittedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip";
const byteLabel = (value: number): string => value < 1024 * 1024 ? `${Math.max(1, Math.round(value / 1024))} KB` : `${(value / (1024 * 1024)).toFixed(1)} MB`;

const AdminDocumentEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<EditorForm>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [modifiedAt, setModifiedAt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size?: number } | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishAccess, setPublishAccess] = useState<"guest" | "administrator">("administrator");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setError(null);
        const categoryRequest = adminGet<TaxonomyResponse>("/admin/taxonomies/document-categories?per_page=100", controller.signal);
        const documentRequest = isNew ? null : adminGet<DetailResponse>(`/admin/cms/documents/${id}`, controller.signal);
        const [categoryResult, detailResult] = await Promise.all([categoryRequest, documentRequest]);
        setCategories(categoryResult.data);
        if (!detailResult) return;
        const item = detailResult.data;
        if (item.source !== "wpdmpro" || item.status !== "draft") {
          setError("Hanya dokumen berstatus draft yang dapat diedit.");
          return;
        }
        setDocument(item);
        setModifiedAt(item.modified_at);
        setUploadedFile(item.file.name ? { name: item.file.name } : null);
        setForm({
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          categoryIds: item.categories.map((category) => category.id).filter((categoryId) => categoryId > 0),
        });
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Editor dokumen tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [id, isNew, navigate]);

  const selectedCategoryNames = useMemo(
    () => categories.filter((category) => form.categoryIds.includes(category.id)).map((category) => category.name),
    [categories, form.categoryIds],
  );

  const saveDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const payload = {
        title: form.title,
        slug: form.slug || null,
        excerpt: form.excerpt || null,
        content: form.content || null,
        category_ids: form.categoryIds,
        ...(isNew ? {} : { expected_modified_at: modifiedAt }),
      };
      const result = isNew
        ? await adminJson<MutationResponse>("/admin/cms/documents", "POST", payload)
        : await adminJson<MutationResponse>(`/admin/cms/documents/${id}`, "PATCH", payload);
      setModifiedAt(result.data.modified_at);
      setMessage(result.meta.message ?? "Draft dokumen berhasil disimpan.");
      if (isNew) {
        navigate(`/admin/documents/${result.data.id}/edit`, { replace: true });
      }
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(caught instanceof Error ? caught.message : "Draft dokumen tidak dapat disimpan.");
    } finally {
      setSaving(false);
    }
  };

  const selectCategories = (event: ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    setForm((current) => ({ ...current, categoryIds: values }));
  };

  const uploadFile = async () => {
    if (!id || !selectedFile) return;
    try {
      setUploading(true);
      setError(null);
      setMessage(null);
      const body = new FormData();
      body.append("file", selectedFile);
      const result = await adminForm<UploadResponse>(`/admin/cms/documents/${id}/file`, body);
      setUploadedFile({ name: result.data.file_name, size: result.data.size });
      setModifiedAt(result.data.modified_at);
      setSelectedFile(null);
      if (fileInput.current) fileInput.current.value = "";
      setMessage(result.meta.message ?? "File dokumen berhasil diunggah.");
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(caught instanceof Error ? caught.message : "File dokumen tidak dapat diunggah.");
    } finally {
      setUploading(false);
    }
  };

  const publishDocument = async () => {
    if (!id) return;
    const isPublic = publishAccess === "guest";
    if (!window.confirm(isPublic ? "Terbitkan dokumen ini sebagai publik? File akan dapat diunduh pengunjung situs." : "Terbitkan dokumen ini sebagai terbatas? File hanya dapat diunduh melalui sesi admin.")) return;
    try {
      setPublishing(true);
      setError(null);
      setMessage(null);
      const result = await adminJson<PublicationResponse>(`/admin/cms/documents/${id}/publish`, "POST", {
        expected_modified_at: modifiedAt,
        access: publishAccess,
      });
      setMessage(result.meta.message ?? "Dokumen berhasil diterbitkan.");
      navigate(`/admin/documents/${id}`, { replace: true });
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(caught instanceof Error ? caught.message : "Dokumen tidak dapat diterbitkan.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <CmsAdminShell title="Editor Dokumen" description="Memuat draft dokumen." mode="document"><div className="cms-panel rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Memuat editor dokumen...</div></CmsAdminShell>;
  }

  return (
    <CmsAdminShell title={isNew ? "Tambah Dokumen" : "Edit Draft Dokumen"} description="Lengkapi informasi dan simpan draft. Setelah file diunggah, dokumen dapat diterbitkan dengan akses publik atau terbatas." mode="document">
      <div className="mb-5"><Link to={isNew ? "/admin/documents" : `/admin/documents/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#105091] hover:underline"><FaArrowLeft /> Kembali ke dokumen</Link></div>
      {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      {message && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{message}</p>}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={saveDraft} className="cms-panel overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7"><h2 className="font-display text-xl font-bold text-slate-900">Informasi dokumen</h2><p className="mt-1 text-sm text-slate-600">Isi judul, alamat URL, ringkasan, dan deskripsi dokumen.</p></div>
          <div className="space-y-5 p-5 sm:p-7">
            <label className="block text-sm font-bold text-slate-800">Judul dokumen
              <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="cms-admin-control mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="block text-sm font-bold text-slate-800">Slug URL <span className="font-normal text-slate-500">(opsional)</span>
              <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="cms-admin-control mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="block text-sm font-bold text-slate-800">Ringkasan <span className="font-normal text-slate-500">(opsional)</span>
              <textarea value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} rows={3} className="cms-admin-control mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="block text-sm font-bold text-slate-800">Deskripsi <span className="font-normal text-slate-500">(HTML sederhana, opsional)</span>
              <textarea value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} rows={12} className="cms-admin-control mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-mono text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" placeholder="&lt;p&gt;Deskripsi dokumen...&lt;/p&gt;" />
            </label>
          </div>
          <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7"><button type="submit" disabled={saving || Boolean(error && !document && !isNew)} className="inline-flex items-center gap-2 rounded-xl bg-[#105091] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75] disabled:cursor-not-allowed disabled:opacity-60"><FaSave /> {saving ? "Menyimpan..." : "Simpan draft"}</button></div>
        </form>

        <aside className="space-y-6">
          <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900"><FaFolderOpen className="text-[#105091]" /> Kategori dokumen</h2><p className="mt-2 text-sm leading-6 text-slate-600">Gunakan Ctrl/Cmd untuk memilih lebih dari satu kategori.</p><p className="mt-2 text-xs leading-5 text-slate-500">Kategori baru dapat ditambahkan melalui menu Kategori Dokumen.</p><select multiple value={form.categoryIds.map(String)} onChange={selectCategories} className="cms-admin-control mt-4 min-h-48 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{selectedCategoryNames.length > 0 && <p className="mt-3 text-xs leading-5 text-slate-600">Dipilih: {selectedCategoryNames.join(", ")}</p>}</section>
          <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900"><FaFileAlt className="text-[#105091]" /> File dokumen</h2>{isNew ? <p className="mt-3 rounded-xl bg-blue-50 px-3 py-3 text-sm leading-6 text-blue-900">Simpan draft terlebih dahulu. Setelah itu Anda dapat memilih file dari komputer.</p> : <><p className="mt-2 text-sm leading-6 text-slate-600">PDF, Word, Excel, PowerPoint, atau ZIP hingga 50 MB. File lama tidak dihapus ketika Anda menggantinya.</p><input ref={fileInput} type="file" accept={permittedTypes} onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} className="cms-admin-control mt-4 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#105091]" />{selectedFile && <p className="mt-3 break-all text-xs text-slate-600">Dipilih: {selectedFile.name} ({byteLabel(selectedFile.size)})</p>}<button type="button" disabled={!selectedFile || uploading} onClick={() => void uploadFile()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75] disabled:cursor-not-allowed disabled:opacity-60"><FaCloudUploadAlt /> {uploading ? "Mengunggah..." : uploadedFile ? "Ganti file dokumen" : "Unggah file dokumen"}</button>{uploadedFile && <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-3 text-xs leading-5 text-emerald-900">File aktif: <span className="break-all font-bold">{uploadedFile.name}</span>{uploadedFile.size ? ` (${byteLabel(uploadedFile.size)})` : ""}</p>}</>}</section>
          {!isNew && <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-display text-base font-bold text-slate-900">Terbitkan dokumen</h2>{uploadedFile ? <><p className="mt-2 text-sm leading-6 text-slate-600">Pilih akses sebelum menerbitkan. Pilihan ini dapat diubah kembali dari halaman detail setelah terbit.</p><label className="mt-4 block text-sm font-bold text-slate-800">Akses unduhan<select value={publishAccess} onChange={(event) => setPublishAccess(event.target.value as "guest" | "administrator")} className="cms-admin-control mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100"><option value="administrator">Terbatas — hanya admin</option><option value="guest">Publik — pengunjung dapat mengunduh</option></select></label><p className="mt-3 flex gap-2 text-xs leading-5 text-slate-600">{publishAccess === "guest" ? <><FaGlobe className="mt-0.5 shrink-0 text-emerald-700" />Dokumen akan dapat diunduh publik melalui endpoint Laravel.</> : <><FaLock className="mt-0.5 shrink-0 text-amber-700" />Dokumen tetap hanya dapat diunduh dengan sesi admin.</>}</p><button type="button" disabled={publishing} onClick={() => void publishDocument()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"><FaGlobe />{publishing ? "Menerbitkan..." : "Terbitkan dokumen"}</button></> : <p className="mt-3 rounded-xl bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-900">Unggah satu file valid sebelum dokumen dapat diterbitkan.</p>}<Link to={`/admin/documents/${id}`} className="mt-4 inline-flex text-sm font-bold text-[#105091] hover:underline">Buka detail dokumen</Link></section>}
        </aside>
      </div>
    </CmsAdminShell>
  );
};

export default AdminDocumentEditorPage;
