import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaExternalLinkAlt, FaFolderOpen, FaHistory, FaPaperPlane, FaPen, FaTag, FaTrash, FaUndo, FaUser } from "react-icons/fa";
import CmsAdminShell from "../components/admin/CmsAdminShell";
import { AdminApiError, adminGet, adminJson } from "../utils/adminApi";
import { adminAuth } from "../utils/adminAuth";

interface Term {
  id: number;
  name: string;
  slug: string;
}

interface ContentDetail {
  id: number;
  type: "post" | "page";
  title: string;
  slug: string;
  status: string;
  date: string;
  date_gmt: string;
  modified_at: string;
  modified_gmt: string;
  scheduling_enabled: boolean;
  excerpt: string;
  content: string;
  author: { id: number; name: string };
  thumbnail: string | null;
  categories: Term[];
  tags: Term[];
}

interface DetailResponse {
  data: ContentDetail;
}

interface PublicationResponse {
  meta: { message?: string };
  data: { id: number; status: "publish" | "future"; published_at: string; modified_at: string };
}

interface ContentLifecycleResponse {
  meta: { message?: string };
  data: { id: number; type: "post" | "page"; status: string; modified_at: string };
}

interface ContentRevision {
  id: number;
  title: string;
  created_at: string;
  author: string;
  can_restore: boolean;
}

interface RevisionResponse {
  data: ContentRevision[];
}

interface RevisionRestoreResponse {
  meta: { message?: string };
  data: { id: number; type: "post" | "page"; status: "draft"; modified_at: string; restored_revision_id: number };
}

const statusLabels: Record<string, string> = {
  publish: "Terbit",
  future: "Terjadwal",
  draft: "Draft",
  pending: "Menunggu tinjauan",
  private: "Pribadi",
  trash: "Sampah",
};

const formatDateTime = (value: string): string => {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const versionedMediaUrl = (url: string | null, version: string | number): string | null => {
  if (!url) return null;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(String(version))}`;
};

const versionPreviewImages = (html: string, version: string): string => {
  if (!html || typeof DOMParser === "undefined") return html;

  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll<HTMLImageElement>("img[src]").forEach((image) => {
    const source = image.getAttribute("src");
    if (!source || /^(data:|blob:)/i.test(source)) return;
    image.setAttribute("src", versionedMediaUrl(source, version) ?? source);
  });

  return document.body.innerHTML;
};

const retryImage = (event: SyntheticEvent<HTMLImageElement>): void => {
  const image = event.currentTarget;
  const attempt = Number(image.dataset.retryAttempt ?? "0");
  const source = image.dataset.sourceUrl;
  if (!source || attempt >= 4) return;

  const nextAttempt = attempt + 1;
  image.dataset.retryAttempt = String(nextAttempt);
  window.setTimeout(() => {
    if (!image.isConnected) return;
    const separator = source.includes("?") ? "&" : "?";
    image.src = `${source}${separator}retry=${Date.now()}-${nextAttempt}`;
  }, Math.min(750 * nextAttempt, 3000));
};

const previewDocument = (html: string, version: string): string => `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:Inter,Arial,sans-serif;color:#1e293b;line-height:1.75;margin:0;padding:24px;word-wrap:break-word}img{max-width:100%;height:auto}figure{display:block;margin:1.5rem 0}figure img{display:block;width:100%;height:auto;border-radius:12px}.lppm-image-size-small{max-width:320px}.lppm-image-size-medium{max-width:520px}.lppm-image-size-large{max-width:760px}.lppm-image-size-full{max-width:100%}.lppm-image-align-left{float:left;margin:.5rem 1.5rem 1rem 0}.lppm-image-align-center{margin-left:auto;margin-right:auto}.lppm-image-align-right{float:right;margin:.5rem 0 1rem 1.5rem}table{max-width:100%;border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:8px}a{color:#105091}pre{overflow:auto;background:#f1f5f9;padding:12px}@media(max-width:640px){.lppm-image-align-left,.lppm-image-align-right{float:none;margin:1rem auto}}</style>
</head><body>${versionPreviewImages(html, version)}</body></html>`;

const AdminCmsDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [scheduledAt, setScheduledAt] = useState("");
  const [publicationAction, setPublicationAction] = useState<"publish" | "schedule" | null>(null);
  const [publicationMessage, setPublicationMessage] = useState<string | null>(null);
  const [publicationError, setPublicationError] = useState<string | null>(null);
  const [lifecycleAction, setLifecycleAction] = useState<"trash" | "restore" | null>(null);
  const [lifecycleMessage, setLifecycleMessage] = useState<string | null>(null);
  const [lifecycleError, setLifecycleError] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [revisionAction, setRevisionAction] = useState<number | null>(null);
  const [revisionMessage, setRevisionMessage] = useState<string | null>(null);
  const [revisionError, setRevisionError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      setError("ID konten tidak valid.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminGet<DetailResponse>(`/admin/posts/${id}`, controller.signal);
        setItem(result.data);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(caught instanceof Error ? caught.message : "Detail konten tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadItem();
    return () => controller.abort();
  }, [id, navigate, reloadKey]);

  useEffect(() => {
    if (!item || item.status !== "draft") {
      setRevisions([]);
      setRevisionsLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadRevisions = async () => {
      try {
        setRevisionsLoading(true);
        setRevisionError(null);
        const result = await adminGet<RevisionResponse>(`/admin/cms/posts/${item.id}/revisions`, controller.signal);
        setRevisions(result.data);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        if (caught instanceof AdminApiError && caught.status === 401) {
          adminAuth.logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setRevisionError(caught instanceof Error ? caught.message : "Riwayat revisi tidak dapat dimuat.");
      } finally {
        if (!controller.signal.aborted) setRevisionsLoading(false);
      }
    };

    void loadRevisions();
    return () => controller.abort();
  }, [item, navigate, reloadKey]);

  const handlePublicationError = (caught: unknown) => {
    if (caught instanceof AdminApiError && caught.status === 401) {
      adminAuth.logout();
      navigate("/admin/login", { replace: true });
      return;
    }

    setPublicationError(caught instanceof Error ? caught.message : "Status publikasi tidak dapat diubah.");
  };

  const publishNow = async () => {
    if (!item || !window.confirm("Terbitkan berita ini sekarang? Setelah diterbitkan, berita akan muncul pada halaman publik.")) return;

    try {
      setPublicationAction("publish");
      setPublicationError(null);
      setPublicationMessage(null);
      const result = await adminJson<PublicationResponse>(`/admin/cms/posts/${item.id}/publish`, "POST", {
        expected_modified_at: item.modified_at,
      });
      setPublicationMessage(result.meta.message ?? "Berita telah diterbitkan.");
      setReloadKey((value) => value + 1);
    } catch (caught) {
      handlePublicationError(caught);
    } finally {
      setPublicationAction(null);
    }
  };

  const schedulePublication = async () => {
    if (!item) return;
    if (!scheduledAt) {
      setPublicationError("Pilih waktu terbit terlebih dahulu.");
      return;
    }
    if (!window.confirm("Simpan jadwal terbit berita ini?")) return;

    try {
      setPublicationAction("schedule");
      setPublicationError(null);
      setPublicationMessage(null);
      const result = await adminJson<PublicationResponse>(`/admin/cms/posts/${item.id}/schedule`, "POST", {
        expected_modified_at: item.modified_at,
        scheduled_at: scheduledAt,
      });
      setPublicationMessage(result.meta.message ?? "Jadwal terbit berita telah disimpan.");
      setScheduledAt("");
      setReloadKey((value) => value + 1);
    } catch (caught) {
      handlePublicationError(caught);
    } finally {
      setPublicationAction(null);
    }
  };

  const changeContentLifecycle = async (action: "trash" | "restore") => {
    if (!item) return;

    const confirmation = action === "trash"
      ? "Pindahkan konten ini ke Sampah? Konten tidak akan dihapus permanen dan dapat dipulihkan."
      : "Pulihkan konten ini ke status sebelum dipindahkan ke Sampah?";
    if (!window.confirm(confirmation)) return;

    try {
      setLifecycleAction(action);
      setLifecycleError(null);
      setLifecycleMessage(null);
      const result = await adminJson<ContentLifecycleResponse>(`/admin/cms/posts/${item.id}/${action}`, "POST", {
        expected_modified_at: item.modified_at,
      });
      setLifecycleMessage(result.meta.message ?? "Status konten berhasil diubah.");
      setReloadKey((value) => value + 1);
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setLifecycleError(caught instanceof Error ? caught.message : "Status Sampah tidak dapat diubah.");
    } finally {
      setLifecycleAction(null);
    }
  };

  const restoreRevision = async (revision: ContentRevision) => {
    if (!item || !revision.can_restore) return;
    if (!window.confirm("Pulihkan versi ini? Isi draft saat ini akan disimpan sebagai revisi baru terlebih dahulu.")) return;

    try {
      setRevisionAction(revision.id);
      setRevisionError(null);
      setRevisionMessage(null);
      const result = await adminJson<RevisionRestoreResponse>(`/admin/cms/posts/${item.id}/revisions/${revision.id}/restore`, "POST", {
        expected_modified_at: item.modified_at,
      });
      setRevisionMessage(result.meta.message ?? "Revisi berhasil dipulihkan.");
      setReloadKey((value) => value + 1);
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setRevisionError(caught instanceof Error ? caught.message : "Revisi tidak dapat dipulihkan.");
    } finally {
      setRevisionAction(null);
    }
  };

  const previewVersion = item ? `${item.id}-${item.modified_at}` : "empty";
  const contentPreview = useMemo(
    () => previewDocument(item?.content ?? "", previewVersion),
    [item?.content, previewVersion],
  );
  const thumbnailUrl = item
    ? versionedMediaUrl(item.thumbnail, previewVersion)
    : null;
  const listPath = item?.type === "page" ? "/admin/pages" : "/admin/posts";
  const typeLabel = item?.type === "page" ? "Halaman" : "Berita";
  const canEdit = item?.status === "draft" || (item?.type === "post" && item.status === "publish");

  return (
    <CmsAdminShell title={item ? `Detail ${typeLabel}` : "Detail konten"} description="Tinjau isi, status publikasi, kategori, tag, dan riwayat perubahan konten.">
      {loading ? (
        <div className="cms-panel rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Memuat detail konten...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          <p>{error}</p>
          <Link to="/admin/posts" className="mt-4 inline-flex items-center gap-2 font-bold text-[#105091] hover:underline"><FaArrowLeft /> Kembali ke daftar berita</Link>
        </div>
      ) : item && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <article className="cms-panel min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-7 sm:py-6">
              <Link to={listPath} className="inline-flex items-center gap-2 text-sm font-bold text-[#105091] hover:underline"><FaArrowLeft /> Kembali ke daftar {item.type === "page" ? "halaman" : "berita"}</Link>
              <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{item.title || "(Tanpa judul)"}</h2>
              {item.excerpt && <p className="mt-3 text-base leading-7 text-slate-600">{item.excerpt}</p>}
            </div>
            <div className="p-4 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-bold text-slate-800">Pratinjau isi</h3>
                <span className="text-xs text-slate-500">Mode aman</span>
              </div>
              <iframe
                key={previewVersion}
                title={`Pratinjau ${item.title || "konten"}`}
                sandbox="allow-same-origin"
                srcDoc={contentPreview}
                className="min-h-[560px] w-full rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </article>

          <aside className="space-y-5">
            <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-display font-bold text-slate-900">Informasi konten</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div><dt className="text-slate-500">Status</dt><dd className="mt-1 font-semibold text-slate-900">{statusLabels[item.status] ?? item.status}</dd></div>
                <div><dt className="text-slate-500">Slug</dt><dd className="mt-1 break-all font-mono text-xs text-slate-800">{item.slug || "—"}</dd></div>
                <div className="flex gap-2"><FaUser className="mt-1 text-[#105091]" /><div><dt className="text-slate-500">Penulis</dt><dd className="font-semibold text-slate-900">{item.author.name}</dd></div></div>
                <div className="flex gap-2"><FaCalendarAlt className="mt-1 text-[#105091]" /><div><dt className="text-slate-500">Tanggal terbit</dt><dd className="font-semibold text-slate-900">{formatDateTime(item.date)}</dd></div></div>
                <div><dt className="text-slate-500">Terakhir diubah</dt><dd className="mt-1 font-semibold text-slate-900">{formatDateTime(item.modified_at)}</dd></div>
              </dl>
              {canEdit && (
                <Link to={`${listPath}/${item.id}/edit`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75]">
                  <FaPen /> {item.status === "publish" ? "Edit berita" : "Edit draft"}
                </Link>
              )}
            </section>

            {item.status === "draft" && (
              <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 font-display font-bold text-slate-900"><FaHistory className="text-[#105091]" /> Riwayat revisi</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Versi dibuat sebelum draft diubah atau sebuah revisi dipulihkan.</p>
                {revisionError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{revisionError}</p>}
                {revisionMessage && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{revisionMessage}</p>}

                {revisionsLoading ? (
                  <p className="mt-4 text-sm text-slate-500">Memuat revisi...</p>
                ) : revisions.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">Belum ada revisi. Simpan perubahan draft untuk membuat versi pertama.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {revisions.map((revision) => (
                      <div key={revision.id} className="rounded-xl border border-slate-200 bg-white/70 p-3">
                        <p className="line-clamp-2 text-sm font-bold text-slate-900">{revision.title || "(Tanpa judul)"}</p>
                        <p className="mt-1 text-xs text-slate-600">{formatDateTime(revision.created_at)} · {revision.author}</p>
                        {revision.can_restore ? (
                          <button
                            type="button"
                            onClick={() => void restoreRevision(revision)}
                            disabled={revisionAction !== null}
                            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#105091] bg-white px-3 py-2 text-xs font-bold text-[#105091] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaUndo /> {revisionAction === revision.id ? "Memulihkan..." : "Pulihkan versi ini"}
                          </button>
                        ) : (
                          <p className="mt-3 text-xs font-medium text-amber-700">Versi lama ini hanya dapat ditinjau dan belum dapat dipulihkan.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {item.status === "trash" ? (
                <>
                  <h3 className="font-display font-bold text-slate-900">Pulihkan konten</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Konten akan dikembalikan ke status sebelum masuk Sampah.</p>
                  {lifecycleError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{lifecycleError}</p>}
                  {lifecycleMessage && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{lifecycleMessage}</p>}
                  <button
                    type="button"
                    onClick={() => void changeContentLifecycle("restore")}
                    disabled={lifecycleAction !== null}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#105091] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaUndo /> {lifecycleAction === "restore" ? "Memulihkan..." : "Pulihkan dari Sampah"}
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-display font-bold text-slate-900">Sampah</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Konten dipindahkan secara reversible. Tidak ada penghapusan permanen pada tahap ini.</p>
                  {lifecycleError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{lifecycleError}</p>}
                  {lifecycleMessage && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{lifecycleMessage}</p>}
                  <button
                    type="button"
                    onClick={() => void changeContentLifecycle("trash")}
                    disabled={lifecycleAction !== null}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaTrash /> {lifecycleAction === "trash" ? "Memindahkan..." : "Pindahkan ke Sampah"}
                  </button>
                </>
              )}
            </section>

            {item.type === "post" && item.status === "draft" && (
              <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display font-bold text-slate-900">Publikasi berita</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Simpan perubahan di editor terlebih dahulu, lalu pilih terbit sekarang atau jadwalkan.</p>

                {publicationError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{publicationError}</p>}
                {publicationMessage && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{publicationMessage}</p>}

                <button
                  type="button"
                  onClick={() => void publishNow()}
                  disabled={publicationAction !== null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaPaperPlane /> {publicationAction === "publish" ? "Menerbitkan..." : "Terbitkan sekarang"}
                </button>

                {item.scheduling_enabled ? (
                  <div className="cms-publication-schedule mt-5 border-t border-slate-200 pt-4">
                    <label htmlFor="schedule-at" className="block text-sm font-bold text-slate-800">Jadwalkan terbit</label>
                    <p className="mt-1 text-xs">Pilih tanggal dan waktu mendatang.</p>
                    <input
                      id="schedule-at"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(event) => setScheduledAt(event.target.value)}
                      disabled={publicationAction !== null}
                      className="cms-publication-schedule-input mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#105091] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => void schedulePublication()}
                      disabled={publicationAction !== null || !scheduledAt}
                      className="cms-publication-schedule-button mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#105091] bg-[#105091] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3f75] disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      <FaCalendarAlt /> {publicationAction === "schedule" ? "Menyimpan jadwal..." : "Simpan jadwal"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs font-medium leading-5 text-amber-900">Penjadwalan sementara dinonaktifkan sampai zona waktu dan cron hosting selesai diuji.</p>
                )}
              </section>
            )}

            {thumbnailUrl && (
              <section className="cms-panel overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={thumbnailUrl} data-source-url={thumbnailUrl} data-retry-attempt="0" onError={retryImage} alt="Gambar unggulan" className="h-auto w-full object-cover" />
                <a href={thumbnailUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#105091] hover:bg-blue-50">
                  Buka gambar <FaExternalLinkAlt className="text-xs" />
                </a>
              </section>
            )}

            {item.categories.length > 0 && (
              <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="flex items-center gap-2 font-display font-bold text-slate-900"><FaFolderOpen className="text-[#105091]" /> Kategori</h3><div className="mt-3 flex flex-wrap gap-2">{item.categories.map((term) => <span key={term.id} className="cms-taxonomy-badge cms-category-badge">{term.name}</span>)}</div></section>
            )}

            {item.tags.length > 0 && (
              <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="flex items-center gap-2 font-display font-bold text-slate-900"><FaTag className="text-[#105091]" /> Tag</h3><div className="mt-3 flex flex-wrap gap-2">{item.tags.map((term) => <span key={term.id} className="cms-taxonomy-badge cms-tag-badge">{term.name}</span>)}</div></section>
            )}
          </aside>
        </div>
      )}
    </CmsAdminShell>
  );
};

export default AdminCmsDetailPage;
