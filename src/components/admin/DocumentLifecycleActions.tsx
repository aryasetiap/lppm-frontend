import { useEffect, useState } from "react";
import { FaGlobe, FaLock, FaSave, FaTrashAlt, FaUndo } from "react-icons/fa";
import { AdminApiError, adminJson } from "../../utils/adminApi";
import { adminAuth } from "../../utils/adminAuth";

interface DocumentLifecycleActionsProps {
  document: {
    id: number;
    source: "wpdmpro" | "book_writing" | "attachment";
    status: string;
    modified_at: string;
    file: { available: boolean; access: "public" | "restricted" };
  };
  onUnauthorized: () => void;
  onCompleted: () => void;
}

interface ActionResponse {
  meta: { message?: string };
  data: { status: string; access?: "public" | "restricted"; modified_at: string };
}

const DocumentLifecycleActions = ({ document, onUnauthorized, onCompleted }: DocumentLifecycleActionsProps) => {
  const [access, setAccess] = useState<"guest" | "administrator">(document.file.access === "public" ? "guest" : "administrator");
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAccess(document.file.access === "public" ? "guest" : "administrator");
    setError(null);
  }, [document.file.access, document.id, document.status]);

  if (document.source !== "wpdmpro") return null;

  const submit = async (path: string, body: Record<string, unknown>, confirmation: string) => {
    if (!window.confirm(confirmation)) return;
    try {
      setActing(true);
      setError(null);
      await adminJson<ActionResponse>(path, "POST", body);
      onCompleted();
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        adminAuth.logout();
        onUnauthorized();
        return;
      }
      setError(caught instanceof Error ? caught.message : "Aksi dokumen tidak dapat diselesaikan.");
    } finally {
      setActing(false);
    }
  };

  const basePath = `/admin/cms/documents/${document.id}`;
  const isPublic = access === "guest";

  return (
    <section className="cms-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-display font-bold text-slate-900">Aksi dokumen</h3>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
      {document.status === "publish" && <>
        <label className="mt-4 block text-sm font-bold text-slate-800">Akses unduhan
          <select value={access} onChange={(event) => setAccess(event.target.value as "guest" | "administrator")} disabled={acting} className="cms-admin-control mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#105091] focus:ring-2 focus:ring-blue-100">
            <option value="administrator">Terbatas — hanya admin</option>
            <option value="guest">Publik — pengunjung dapat mengunduh</option>
          </select>
        </label>
        <p className="mt-3 flex gap-2 text-xs leading-5 text-slate-600">{isPublic ? <><FaGlobe className="mt-0.5 shrink-0 text-emerald-700" />Akses publik hanya tersedia bila file valid.</> : <><FaLock className="mt-0.5 shrink-0 text-amber-700" />Unduhan memerlukan sesi admin.</>}</p>
        <button type="button" disabled={acting} onClick={() => void submit(`${basePath}/access`, { expected_modified_at: document.modified_at, access }, isPublic ? "Jadikan dokumen ini publik? Pengunjung situs akan dapat mengunduh file." : "Batasi unduhan dokumen ini hanya untuk admin?")} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#105091] bg-white px-4 py-2.5 text-sm font-bold text-[#105091] transition hover:bg-blue-50 disabled:opacity-60"><FaSave /> Simpan akses</button>
      </>}
      {document.status === "trash" ? <button type="button" disabled={acting} onClick={() => void submit(`${basePath}/restore`, { expected_modified_at: document.modified_at }, "Pulihkan dokumen ini dari Sampah?")} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"><FaUndo /> {acting ? "Memulihkan..." : "Pulihkan dokumen"}</button> : <button type="button" disabled={acting} onClick={() => void submit(`${basePath}/trash`, { expected_modified_at: document.modified_at }, "Pindahkan dokumen ini ke Sampah? File fisik tidak akan dihapus dan dokumen dapat dipulihkan.")} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 transition hover:bg-red-100 disabled:opacity-60"><FaTrashAlt /> {acting ? "Memindahkan..." : "Pindahkan ke Sampah"}</button>}
    </section>
  );
};

export default DocumentLifecycleActions;
