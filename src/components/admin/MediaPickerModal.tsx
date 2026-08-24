import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FaCheck, FaChevronLeft, FaChevronRight, FaImage, FaSearch, FaTimes, FaUpload } from "react-icons/fa";
import { AdminApiError, adminForm, adminGet } from "../../utils/adminApi";

export interface MediaAsset {
  id: number;
  title: string;
  mime: string;
  alt_text: string;
  file: {
    reference: string | null;
    url: string | null;
    exists: boolean | null;
  };
}

interface MediaResponse {
  meta: {
    pagination: {
      total: number;
      current_page: number;
      last_page: number;
    };
  };
  data: MediaAsset[];
}

interface MediaPickerModalProps {
  open: boolean;
  purpose: "featured" | "inline";
  selectedMediaId: number | null;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  onUnauthorized: () => void;
}

const MediaPickerModal = ({ open, purpose, selectedMediaId, onClose, onSelect, onUnauthorized }: MediaPickerModalProps) => {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const loadMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams({ kind: "image", status: "inherit", per_page: "18", page: String(page) });
        if (appliedSearch.trim()) query.set("search", appliedSearch.trim());
        const result = await adminGet<MediaResponse>(`/admin/media?${query.toString()}`, controller.signal);
        setItems(result.data);
        setLastPage(result.meta.pagination.last_page);
        setTotal(result.meta.pagination.total);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          onUnauthorized();
          return;
        }
        setError(caught instanceof Error ? caught.message : "Pustaka media tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadMedia();
    return () => controller.abort();
  }, [appliedSearch, onUnauthorized, open, page]);

  if (!open) return null;

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput);
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    event.target.value = "";
    if (!image) return;

    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("image", image);
      body.append("title", image.name.replace(/\.[^.]+$/, ""));
      const result = await adminForm<{ data: MediaAsset }>("/admin/media/images", body);
      onSelect(result.data);
      onClose();
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        onUnauthorized();
        return;
      }
      setUploadError(caught instanceof Error ? caught.message : "Gambar tidak dapat diunggah.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 px-4 py-8 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="media-picker-title" className="my-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/20 bg-slate-50 shadow-2xl">
        <header className="flex items-center justify-between gap-5 bg-gradient-to-r from-[#082d52] to-[#105091] px-5 py-4 text-white sm:px-7">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><FaImage /></div><div><h2 id="media-picker-title" className="font-display text-lg font-bold">{purpose === "featured" ? "Pilih gambar unggulan" : "Sisipkan gambar ke isi"}</h2><p className="text-xs text-blue-100">Pustaka media website LPPM</p></div></div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-blue-100 transition hover:bg-white/15 hover:text-white" aria-label="Tutup pustaka media"><FaTimes /></button>
        </header>

        <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className="sr-only" />
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-bold text-[#0c4178]">Upload dari komputer</p><p className="mt-0.5 text-xs text-slate-600">JPEG, PNG, atau WebP, maksimal 8 MB. File akan tersimpan di pustaka media website.</p></div>
            <button type="button" disabled={uploading} onClick={() => uploadInputRef.current?.click()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0a3b6d] disabled:cursor-not-allowed disabled:opacity-60"><FaUpload /> {uploading ? "Mengunggah..." : "Pilih file"}</button>
          </div>
          {uploadError && <p role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{uploadError}</p>}
          <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 flex-1"><span className="sr-only">Cari gambar</span><FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100" placeholder="Cari nama gambar..." /></label>
            <button type="submit" className="rounded-2xl bg-[#105091] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0a3b6d]">Cari</button>
          </form>
          <p className="mt-3 text-xs text-slate-500">{loading ? "Memuat gambar..." : `${total.toLocaleString("id-ID")} gambar ditemukan. File yang tidak tersedia tidak dapat dipilih.`}</p>
        </div>

        <div className="min-h-[420px] bg-slate-100 p-5 sm:p-7">
          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
            : loading ? <div className="py-24 text-center text-sm font-medium text-slate-500">Memuat pustaka media...</div>
              : items.length === 0 ? <div className="py-24 text-center text-sm font-medium text-slate-500">Tidak ada gambar yang cocok.</div>
                : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {items.map((asset) => {
                    const available = asset.file.exists === true && Boolean(asset.file.url);
                    const selected = selectedMediaId === asset.id;
                    return <button key={asset.id} type="button" disabled={!available} onClick={() => { onSelect(asset); onClose(); }} className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${selected ? "border-[#105091] ring-4 ring-blue-200" : "border-slate-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"} ${available ? "" : "cursor-not-allowed opacity-50"}`}>
                      <div className="aspect-square bg-slate-200">{asset.file.url ? <img src={asset.file.url} alt={asset.alt_text || asset.title} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center text-slate-400"><FaImage /></div>}</div>
                      <div className="min-h-14 p-2.5"><p className="line-clamp-2 text-xs font-bold leading-4 text-slate-700">{asset.title || "Tanpa judul"}</p>{!available && <p className="mt-1 text-[10px] font-semibold text-red-600">File tidak tersedia</p>}</div>
                      {selected && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#105091] text-xs text-white shadow"><FaCheck /></span>}
                    </button>;
                  })}
                </div>}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#105091] hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400"><FaChevronLeft /> Sebelumnya</button>
          <span className="text-xs font-semibold text-slate-500">Halaman {page} dari {lastPage}</span>
          <button type="button" disabled={page >= lastPage || loading} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#105091] hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">Berikutnya <FaChevronRight /></button>
        </footer>
      </section>
    </div>
  );
};

export default MediaPickerModal;
