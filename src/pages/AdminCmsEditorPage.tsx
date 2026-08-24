import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBold,
  FaCheck,
  FaEye,
  FaHeading,
  FaImage,
  FaItalic,
  FaLink,
  FaListUl,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import MediaPickerModal, { type MediaAsset } from "../components/admin/MediaPickerModal";
import { AdminApiError, adminGet, adminJson } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

type ContentType = "post" | "page";
type TermField = "categoryIds" | "tagIds";
type MediaPickerPurpose = "featured" | "inline";

interface Term {
  id: number;
  name: string;
  slug: string;
}

interface ContentDetail {
  id: number;
  type: ContentType;
  title: string;
  slug: string;
  status: string;
  modified_at: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  featured_media_id: number | null;
  categories: Term[];
  tags: Term[];
}

interface FeaturedMedia {
  id: number;
  title: string;
  url: string | null;
  altText: string;
}

interface DetailResponse {
  data: ContentDetail;
}

interface TaxonomyResponse {
  data: Term[];
}

interface MutationResponse {
  data: { id: number; type: ContentType; status: string };
}

interface EditorState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryIds: number[];
  tagIds: number[];
  featuredMedia: FeaturedMedia | null;
}

const emptyEditor: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  categoryIds: [],
  tagIds: [],
  featuredMedia: null,
};

const previewDocument = (html: string): string => `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:Inter,Arial,sans-serif;color:#1e293b;line-height:1.75;margin:0;padding:20px;word-wrap:break-word}img{max-width:100%;height:auto}figure{display:block;margin:1.5rem 0}figure img{display:block;width:100%;height:auto;border-radius:12px}.lppm-image-size-small{max-width:320px}.lppm-image-size-medium{max-width:520px}.lppm-image-size-large{max-width:760px}.lppm-image-size-full{max-width:100%}.lppm-image-align-left{float:left;margin:.5rem 1.5rem 1rem 0}.lppm-image-align-center{margin-left:auto;margin-right:auto}.lppm-image-align-right{float:right;margin:.5rem 0 1rem 1.5rem}table{max-width:100%;border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:8px}a{color:#105091}pre{overflow:auto;background:#f1f5f9;padding:12px}@media(max-width:640px){.lppm-image-align-left,.lppm-image-align-right{float:none;margin:1rem auto}}</style>
</head><body>${html}</body></html>`;

const AdminCmsEditorPage = ({ type }: { type: ContentType }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editableRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);
  const isEditing = Boolean(id);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [expectedModifiedAt, setExpectedModifiedAt] = useState<string | null>(null);
  const [contentStatus, setContentStatus] = useState<"draft" | "publish">("draft");
  const [categories, setCategories] = useState<Term[]>([]);
  const [tags, setTags] = useState<Term[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [featuredMediaChanged, setFeaturedMediaChanged] = useState(false);
  const [mediaPickerPurpose, setMediaPickerPurpose] = useState<MediaPickerPurpose | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ size: string; alignment: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const label = type === "post" ? "Berita" : "Halaman";
  const listPath = type === "post" ? "/admin/posts" : "/admin/pages";
  const isPublishedPost = type === "post" && contentStatus === "publish";
  const preview = useMemo(() => previewDocument(editor.content), [editor.content]);

  useEffect(() => {
    const node = editableRef.current;
    if (node && node.innerHTML !== editor.content) {
      node.innerHTML = editor.content;
    }
  }, [editor.content]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTaxonomies = async () => {
      if (type !== "post") return;

      try {
        const [categoryResult, tagResult] = await Promise.all([
          adminGet<TaxonomyResponse>("/admin/taxonomies/categories?per_page=100", controller.signal),
          adminGet<TaxonomyResponse>("/admin/taxonomies/tags?per_page=100", controller.signal),
        ]);
        setCategories(categoryResult.data);
        setTags(tagResult.data);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Kategori dan tag tidak dapat dimuat.");
      }
    };

    void loadTaxonomies();
    return () => controller.abort();
  }, [navigate, type]);

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }
    if (!id || !/^\d+$/.test(id)) {
      setError("ID konten tidak valid.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadContent = async () => {
      try {
        setLoading(true);
        const result = await adminGet<DetailResponse>(`/admin/posts/${id}`, controller.signal);
        if (result.data.type !== type) throw new Error("Tipe konten pada URL tidak sesuai.");
        const editable = result.data.status === "draft" || (type === "post" && result.data.status === "publish");
        if (!editable) throw new Error("Konten dengan status ini belum dapat diedit.");

        setEditor({
          title: result.data.title,
          slug: result.data.slug,
          excerpt: result.data.excerpt,
          content: result.data.content,
          categoryIds: result.data.categories.map((term) => term.id),
          tagIds: result.data.tags.map((term) => term.id),
          featuredMedia: result.data.featured_media_id
            ? {
              id: result.data.featured_media_id,
              title: "Gambar unggulan saat ini",
              url: result.data.thumbnail,
              altText: "",
            }
            : null,
        });
        setExpectedModifiedAt(result.data.modified_at);
        setContentStatus(result.data.status === "publish" ? "publish" : "draft");
        setDirty(false);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Konten tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadContent();
    return () => controller.abort();
  }, [id, isEditing, navigate, type]);

  const update = <Key extends keyof EditorState>(key: Key, value: EditorState[Key]) => {
    setEditor((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);

  const applyFormat = (command: string, value?: string) => {
    const editable = editableRef.current;
    if (!editable) return;

    editable.focus();
    document.execCommand(command, false, value);
    update("content", editable.innerHTML);
  };

  const createLink = () => {
    const url = window.prompt("Masukkan URL tautan (https://, http://, mailto:, atau /path):");
    if (!url) return;
    if (!/^(https?:\/\/|mailto:|\/)/i.test(url.trim())) {
      setError("URL tautan harus dimulai dengan https://, http://, mailto:, atau /.");
      return;
    }
    applyFormat("createLink", url.trim());
  };

  const toggleTerm = (field: TermField, termId: number) => {
    update(field, editor[field].includes(termId)
      ? editor[field].filter((idValue) => idValue !== termId)
      : [...editor[field], termId]);
  };

  const rememberEditorSelection = () => {
    const selection = window.getSelection();
    const editable = editableRef.current;
    if (!selection || selection.rangeCount === 0 || !editable) return;

    const range = selection.getRangeAt(0);
    if (editable.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = range.cloneRange();
    }
  };

  const chooseFeaturedMedia = (asset: MediaAsset) => {
    update("featuredMedia", {
      id: asset.id,
      title: asset.title || "Tanpa judul",
      url: asset.file.url,
      altText: asset.alt_text,
    });
    setFeaturedMediaChanged(true);
  };

  const insertInlineImage = (asset: MediaAsset) => {
    const editable = editableRef.current;
    if (!editable || !asset.file.url) {
      setError("Gambar yang dipilih tidak memiliki URL yang dapat digunakan.");
      return;
    }

    const documentRange = savedSelectionRef.current?.cloneRange() ?? document.createRange();
    if (!savedSelectionRef.current || !editable.contains(documentRange.commonAncestorContainer)) {
      documentRange.selectNodeContents(editable);
      documentRange.collapse(false);
    }

    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = asset.file.url;
    image.alt = asset.alt_text || asset.title || "Gambar berita";
    image.title = asset.title || "";
    figure.className = "lppm-image-size-large lppm-image-align-center";
    figure.appendChild(image);
    documentRange.deleteContents();
    documentRange.insertNode(figure);
    documentRange.setStartAfter(figure);
    documentRange.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(documentRange);
    savedSelectionRef.current = documentRange.cloneRange();
    selectedImageRef.current = image;
    setSelectedImage({ size: "large", alignment: "center" });
    update("content", editable.innerHTML);
  };

  const selectInlineImage = (event: MouseEvent<HTMLDivElement>) => {
    const image = event.target instanceof HTMLImageElement ? event.target : null;
    if (!image || !editableRef.current?.contains(image)) {
      selectedImageRef.current = null;
      setSelectedImage(null);
      return;
    }

    const figure = image.closest("figure");
    const classList = figure?.classList;
    const size = ["small", "medium", "large", "full"].find((value) => classList?.contains(`lppm-image-size-${value}`)) ?? "large";
    const alignment = ["left", "center", "right"].find((value) => classList?.contains(`lppm-image-align-${value}`)) ?? "center";
    selectedImageRef.current = image;
    setSelectedImage({ size, alignment });
  };

  const setInlineImageClass = (group: "size" | "align", value: string) => {
    const image = selectedImageRef.current;
    const editable = editableRef.current;
    const figure = image?.closest("figure");
    if (!image || !editable || !figure || !editable.contains(figure)) return;

    const classes = group === "size"
      ? ["small", "medium", "large", "full"].map((item) => `lppm-image-size-${item}`)
      : ["left", "center", "right"].map((item) => `lppm-image-align-${item}`);
    figure.classList.remove(...classes);
    figure.classList.add(group === "size" ? `lppm-image-size-${value}` : `lppm-image-align-${value}`);
    setSelectedImage((current) => current ? { ...current, [group === "size" ? "size" : "alignment"]: value } : current);
    update("content", editable.innerHTML);
  };

  const chooseMedia = (asset: MediaAsset) => {
    if (mediaPickerPurpose === "featured") {
      chooseFeaturedMedia(asset);
    } else if (mediaPickerPurpose === "inline") {
      insertInlineImage(asset);
    }
    setMediaPickerPurpose(null);
  };

  const openMediaPicker = (purpose: MediaPickerPurpose) => {
    if (purpose === "inline") rememberEditorSelection();
    setMediaPickerPurpose(purpose);
  };

  const clearFeaturedMedia = () => {
    update("featuredMedia", null);
    setFeaturedMediaChanged(true);
  };

  const saveDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        title: editor.title,
        slug: editor.slug || null,
        excerpt: editor.excerpt,
        content: editor.content,
      };
      if (type === "post") {
        payload.category_ids = editor.categoryIds;
        payload.tag_ids = editor.tagIds;
      }
      if (featuredMediaChanged) {
        payload.featured_media_id = editor.featuredMedia?.id ?? null;
      }

      let result: MutationResponse;
      if (isEditing) {
        if (!id || !expectedModifiedAt) throw new Error("Versi konten tidak tersedia. Muat ulang halaman.");
        result = await adminJson<MutationResponse>(`/admin/cms/posts/${id}`, "PATCH", {
          ...payload,
          expected_modified_at: expectedModifiedAt,
        });
      } else {
        result = await adminJson<MutationResponse>("/admin/cms/posts", "POST", { ...payload, type });
      }

      const destination = result.data.type === "page" ? "/admin/pages" : "/admin/posts";
      navigate(`${destination}/${result.data.id}`);
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      if (caught instanceof AdminApiError && caught.status === 409) {
        setError("Konten telah berubah di pengguna lain. Jangan timpa perubahan; kembali ke detail lalu muat ulang.");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Konten tidak dapat disimpan.");
    } finally {
      setSaving(false);
    }
  };

  const formatButtons = [
    { label: "Tebal", icon: FaBold, action: () => applyFormat("bold") },
    { label: "Miring", icon: FaItalic, action: () => applyFormat("italic") },
    { label: "Subjudul", icon: FaHeading, action: () => applyFormat("formatBlock", "h2") },
    { label: "Daftar", icon: FaListUl, action: () => applyFormat("insertUnorderedList") },
    { label: "Tautan", icon: FaLink, action: createLink },
    { label: "Gambar", icon: FaImage, action: () => openMediaPicker("inline") },
  ];

  if (loading) {
    return <CmsAdminShell title={`Editor ${label}`} description="Memuat konten untuk disunting." mode="content"><div className="cms-panel rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Memuat konten...</div></CmsAdminShell>;
  }

  return (
    <CmsAdminShell title={isEditing ? `${isPublishedPost ? "Edit" : "Edit Draft"} ${label}` : `Buat Draft ${label}`} description={isPublishedPost ? "Perubahan pada berita terbit akan langsung tampil di situs publik setelah disimpan. Versi sebelumnya disimpan sebagai revisi." : "Susun konten secara visual. Perubahan disimpan sebagai draft dan tidak akan tampil di situs publik."} mode={isPublishedPost ? "content" : "draft"}>
      <form onSubmit={saveDraft} className="cms-editor grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="cms-panel overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-7">
            {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link to={listPath} onClick={(event) => { if (dirty && !window.confirm("Perubahan belum disimpan. Tetap kembali ke daftar?")) event.preventDefault(); }} className="inline-flex items-center gap-2 text-sm font-bold text-[#105091] transition hover:underline"><FaArrowLeft /> Kembali ke daftar</Link>
              <div className="flex items-center gap-2">{dirty && <span className="text-xs font-semibold text-amber-700">Belum disimpan</span>}<span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${isPublishedPost ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>{isPublishedPost ? "TERBIT" : "DRAFT"}</span></div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-800">Judul {label}</span>
              <input required value={editor.title} onChange={(event) => update("title", event.target.value)} className="editor-field w-full rounded-2xl border px-4 py-3.5 text-lg font-semibold outline-none transition" placeholder={`Tulis judul ${label.toLowerCase()}`} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-800">Slug URL <span className="font-normal text-slate-500">(opsional)</span></span>
              <input value={editor.slug} onChange={(event) => update("slug", event.target.value)} className="editor-field w-full rounded-2xl border px-4 py-3 text-sm outline-none transition" placeholder="dibuat-dari-judul-bila-kosong" />
            </label>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div><span className="block text-sm font-bold text-slate-800">Isi konten</span><span className="mt-1 block text-xs text-slate-500">Pilih teks, lalu gunakan format yang dibutuhkan.</span></div>
                <span className="text-xs font-semibold text-slate-500">HTML aman</span>
              </div>
              <div className="editor-toolbar flex flex-wrap gap-2 rounded-t-2xl border px-3 py-2.5">
                {formatButtons.map(({ label: buttonLabel, icon: Icon, action }) => (
                  <button key={buttonLabel} type="button" onMouseDown={(event) => event.preventDefault()} onClick={action} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition hover:bg-slate-200" title={buttonLabel}>
                    <Icon /> <span>{buttonLabel}</span>
                  </button>
                ))}
              </div>
              {selectedImage && (
                <div className="editor-image-controls flex flex-col gap-3 border border-t-0 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-xs font-bold text-slate-800">Gambar terpilih</p><p className="text-[11px] text-slate-600">Atur ukuran dan posisi gambar di dalam artikel.</p></div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center text-[11px] font-bold text-slate-600">Ukuran</span>
                    {[['small', 'Kecil'], ['medium', 'Sedang'], ['large', 'Besar'], ['full', 'Penuh']].map(([value, buttonLabel]) => <button key={value} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setInlineImageClass("size", value)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${selectedImage.size === value ? "bg-[#105091] text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"}`}>{buttonLabel}</button>)}
                    <span className="ml-1 inline-flex items-center text-[11px] font-bold text-slate-600">Posisi</span>
                    {[['left', 'Kiri'], ['center', 'Tengah'], ['right', 'Kanan']].map(([value, buttonLabel]) => <button key={value} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setInlineImageClass("align", value)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${selectedImage.alignment === value ? "bg-[#105091] text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"}`}>{buttonLabel}</button>)}
                  </div>
                </div>
              )}
              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="Isi konten"
                onInput={(event) => update("content", event.currentTarget.innerHTML)}
                onKeyUp={rememberEditorSelection}
                onMouseUp={rememberEditorSelection}
                onClick={selectInlineImage}
                data-placeholder="Tulis isi artikel di sini. Anda dapat menempelkan teks atau menggunakan toolbar format."
                className="cms-editor-content min-h-[310px] rounded-b-2xl border border-t-0 px-5 py-4 text-base leading-8 outline-none"
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-800">Ringkasan <span className="font-normal text-slate-500">(opsional)</span></span>
              <textarea value={editor.excerpt} onChange={(event) => update("excerpt", event.target.value)} rows={3} className="editor-field w-full resize-y rounded-2xl border px-4 py-3 text-sm leading-6 outline-none transition" placeholder="Ringkasan singkat untuk daftar berita." />
            </label>
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-20">
          <section className="cms-panel rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#105091]"><FaSave /></div>
              <div><h2 className="font-display font-bold text-slate-900">Status konten</h2><p className="text-xs text-slate-500">{isPublishedPost ? "Sudah dipublikasikan" : "Belum dipublikasikan"}</p></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{isPublishedPost ? "Perubahan akan menggantikan versi publik sekarang. Versi sebelumnya disimpan sebagai revisi terlebih dahulu." : "Draft hanya terlihat oleh admin dan dapat disunting kembali setelah disimpan."}</p>
            <button disabled={saving} type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d5cad] px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0a4d91] disabled:cursor-not-allowed disabled:opacity-60"><FaSave /> {saving ? "Menyimpan..." : isPublishedPost ? "Simpan perubahan" : "Simpan draft"}</button>
          </section>

          <section className="cms-panel rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#105091]"><FaImage /></div><div><h2 className="font-display font-bold text-slate-900">Gambar unggulan</h2><p className="text-xs text-slate-500">Tampil pada kartu berita</p></div></div>
            {editor.featuredMedia ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {editor.featuredMedia.url ? <img src={editor.featuredMedia.url} alt={editor.featuredMedia.altText || editor.featuredMedia.title} className="aspect-[16/10] w-full object-cover" /> : <div className="flex aspect-[16/10] items-center justify-center text-sm font-semibold text-amber-700">Pratinjau file tidak tersedia</div>}
                <div className="p-3"><p className="line-clamp-2 text-xs font-bold text-slate-800">{editor.featuredMedia.title}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => openMediaPicker("featured")} className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#105091] transition hover:bg-blue-50">Ganti</button><button type="button" onClick={clearFeaturedMedia} className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 transition hover:bg-red-50" aria-label="Hapus gambar unggulan"><FaTimes /></button></div></div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center"><FaImage className="mx-auto text-xl text-slate-400" /><p className="mt-2 text-xs leading-5 text-slate-500">Belum ada gambar unggulan.</p></div>
            )}
            <button type="button" onClick={() => openMediaPicker("featured")} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-[#105091] transition hover:bg-blue-50"><FaImage /> Pilih dari pustaka</button>
          </section>

          {type === "post" && (
            <section className="cms-panel rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-display font-bold text-slate-900">Kategori & tag</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">Pilih pengelompokan yang relevan untuk konten ini.</p>
              <h3 className="mt-5 text-sm font-bold text-slate-800">Kategori</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((term) => {
                  const selected = editor.categoryIds.includes(term.id);
                  return <button key={term.id} type="button" aria-pressed={selected} onClick={() => toggleTerm("categoryIds", term.id)} className={`editor-chip ${selected ? "editor-chip-selected" : ""}`}>{selected && <FaCheck />} {term.name}</button>;
                })}
              </div>
              <h3 className="mt-6 text-sm font-bold text-slate-800">Tag</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((term) => {
                  const selected = editor.tagIds.includes(term.id);
                  return <button key={term.id} type="button" aria-pressed={selected} onClick={() => toggleTerm("tagIds", term.id)} className={`editor-chip ${selected ? "editor-chip-selected" : ""}`}>{selected && <FaCheck />} {term.name}</button>;
                })}
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-slate-800"><FaEye className="text-[#105091]" /><h2 className="font-display text-sm font-bold">Pratinjau aman</h2></div>
            <iframe title="Pratinjau draft" sandbox="" srcDoc={preview} className="min-h-[240px] w-full bg-white" />
          </section>
        </aside>
      </form>
      <MediaPickerModal open={mediaPickerPurpose !== null} purpose={mediaPickerPurpose ?? "featured"} selectedMediaId={mediaPickerPurpose === "featured" ? editor.featuredMedia?.id ?? null : null} onClose={() => setMediaPickerPurpose(null)} onSelect={chooseMedia} onUnauthorized={() => { adminAuth.logout(); navigate("/admin/login", { replace: true }); }} />
    </CmsAdminShell>
  );
};

export default AdminCmsEditorPage;
