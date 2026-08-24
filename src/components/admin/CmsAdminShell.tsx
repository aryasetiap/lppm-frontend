import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaChevronRight,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolderOpen,
  FaHome,
  FaNewspaper,
  FaSignOutAlt,
  FaTags,
} from "react-icons/fa";
import { adminAuth } from "../../utils/adminAuth";

interface CmsAdminShellProps {
  children: ReactNode;
  title: string;
  description: string;
  mode?: "read" | "draft" | "manage" | "document" | "content";
}

interface NavigationItem {
  label: string;
  to: string;
  icon: IconType;
  active: boolean;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

const CmsAdminShell = ({ children, title, description, mode = "read" }: CmsAdminShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminName = adminAuth.getUser() ?? "Administrator";

  const groups: NavigationGroup[] = [
    {
      label: "Ringkasan",
      items: [
        { label: "Dashboard", to: "/admin/dashboard", icon: FaHome, active: location.pathname === "/admin/dashboard" },
      ],
    },
    {
      label: "Konten",
      items: [
        { label: "Berita", to: "/admin/posts", icon: FaNewspaper, active: location.pathname.startsWith("/admin/posts") },
        { label: "Halaman", to: "/admin/pages", icon: FaFileAlt, active: location.pathname.startsWith("/admin/pages") },
        { label: "Dokumen", to: "/admin/documents", icon: FaFileAlt, active: location.pathname.startsWith("/admin/documents") },
      ],
    },
    {
      label: "Taksonomi",
      items: [
        { label: "Kategori Berita", to: "/admin/categories", icon: FaFolderOpen, active: location.pathname.startsWith("/admin/categories") },
        { label: "Tag", to: "/admin/tags", icon: FaTags, active: location.pathname.startsWith("/admin/tags") },
        { label: "Kategori Dokumen", to: "/admin/document-categories", icon: FaFolderOpen, active: location.pathname.startsWith("/admin/document-categories") },
      ],
    },
    {
      label: "Pengaturan website",
      items: [
        { label: "Data portal", to: "/admin/content", icon: FaArrowRight, active: location.pathname.startsWith("/admin/content") },
      ],
    },
  ];

  const modeNotice = mode === "manage"
    ? "Kategori dan tag dapat dibuat serta diedit. Penghapusan belum tersedia."
    : mode === "document"
      ? "Kelola draft, file, publikasi, akses, dan sampah dokumen dari satu tempat."
      : mode === "draft"
        ? "Konten baru disimpan sebagai draft sampai Anda menerbitkannya dari halaman detail."
        : mode === "content"
          ? "Perubahan pada konten terbit langsung memperbarui situs dan versi sebelumnya disimpan sebagai revisi."
          : null;

  const logout = async () => {
    await adminAuth.endSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="cms-admin-theme min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo-lppm-unila.png`} alt="LPPM Universitas Lampung" className="h-10 w-auto" />
            <div className="hidden border-l border-slate-200 pl-3 sm:block">
              <p className="text-sm font-bold text-slate-900">CMS LPPM</p>
              <p className="text-xs text-slate-500">Administrasi konten</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#105091]">
              <FaExternalLinkAlt className="text-xs" />
              <span className="hidden sm:inline">Lihat website</span>
            </Link>
            <div className="hidden text-right md:block">
              <p className="max-w-52 truncate text-sm font-bold text-slate-800">{adminName}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <button type="button" onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
              <FaSignOutAlt /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1680px] items-start lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="border-b border-slate-800 bg-[#0b2d52] p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-5">
          <nav className="flex gap-3 overflow-x-auto lg:block lg:space-y-6" aria-label="Navigasi CMS">
            {groups.map((group) => (
              <div key={group.label} className="shrink-0 lg:shrink">
                <p className="mb-2 hidden px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200/70 lg:block">{group.label}</p>
                <div className="flex gap-1 lg:flex-col">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.to} to={item.to} aria-current={item.active ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${item.active ? "bg-white text-[#0b3f75] shadow-sm" : "text-blue-50 hover:bg-white/10 hover:text-white"}`}>
                        <Icon className="w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>CMS LPPM</span><FaChevronRight className="text-[9px]" /><span className="text-slate-700">{title}</span>
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
              {modeNotice && (
                <div className="mt-3 inline-flex max-w-3xl rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium leading-5 text-blue-800">
                  {modeNotice}
                </div>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CmsAdminShell;
