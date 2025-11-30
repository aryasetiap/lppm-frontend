/**
 * Komponen Header Ultra-Modern untuk LPPM Unila.
 * Design dengan glass morphism, animasi halus, dan navigasi premium.
 */

"use client";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Home,
  Users,
  Award,
  BookOpen,
  Globe,
  Settings,
  Layers,
} from "lucide-react";
import { adminAuth } from "../utils/adminAuth";

type NavLink =
  | { name: string; href: string; type: "link"; icon?: any }
  | {
      name: string;
      type: "dropdown";
      icon?: any;
      items: {
        name: string;
        href: string;
        external?: boolean;
        description?: string;
        subItems?: {
          name: string;
          href: string;
          external?: boolean;
          description?: string;
        }[];
      }[];
    };

const navLinks: NavLink[] = [
  {
    name: "Beranda",
    href: "/",
    type: "link",
    icon: Home,
  },
  {
    name: "Profil",
    type: "dropdown",
    icon: Users,
    items: [
      {
        name: "Pimpinan",
        href: "/profile#pimpinan",
        description: "Struktur kepemimpinan LPPM",
      },
      {
        name: "Visi & Misi",
        href: "/profile#visi-misi",
        description: "Tujuan dan arah LPPM",
      },
      {
        name: "Tugas dan Fungsi",
        href: "/profile#tugas-fungsi",
        description: "Peran dan tanggung jawab",
      },
      {
        name: "Struktur Organisasi",
        href: "/profile#struktur-organisasi",
        description: "Struktur organisasi lengkap",
      },
    ],
  },
  {
    name: "PUI",
    type: "dropdown",
    icon: Award,
    items: [
      {
        name: "Pusat Unggulan Ipteks Anggrek, Kopi, Lada, Kako dan Pengembangan Komoditas Strategis dan Agroindustri Lampung",
        href: "/pui/pusat-unggulan-ipteks-anggrek-kopi-lada-kako-dan-pengembangan-komoditas-strategis-dan-agroindustri-lampung",
        description: "Pusat unggulan ipteks pertanian",
      },
    ],
  },
  {
    name: "PUSLIT",
    type: "dropdown",
    icon: Layers,
    items: [
      {
        name: "Kuliah Kerja Nyata",
        href: "/puslit/pusat-penelitian-kuliah-kerja-nyata-kkn",
        description: "Program KKN",
      },
      {
        name: "Pusat Penelitian HAKI dan PATEN",
        href: "/puslit/pusat-penelitian-hak-kekayaan-intelektual-hki-dan-paten",
        description: "Proteksi kekayaan intelektual",
      },
      {
        name: "Pusat Penelitian Bencana, Lingkungan Hidup dan Sumber Daya Alam",
        href: "/puslit/pusat-penelitian-bencana-lingkungan-hidup-dan-sumber-daya-alam",
        description: "Penelitian lingkungan dan sumber daya",
      },
      {
        name: "Pusat Penelitian Studi Kebijakan Publik, Pembangunan dan Sosial Budaya",
        href: "/puslit/pusat-penelitian-studi-kebijakan-publik-pembangunan-dan-sosial-budaya",
        description: "Studi kebijakan dan sosial",
      },
      {
        name: "Pusat Penelitian Publikasi dan Kerjasama",
        href: "/puslit/pusat-penelitian-publikasi-dan-kerja-sama",
        description: "Publikasi ilmiah dan kerjasama",
      },
      {
        name: "Pusat Penelitian Inkubator Bisnis, Hilirisasi Inovasi, Ketahanan Pangan dan Sertifikasi Halal",
        href: "/puslit/pusat-penelitian-inkubator-bisnis-hilirisasi-inovasi-ketahanan-pangan-dan-sertifikasi-halal",
        description: "Inkubasi dan inovasi bisnis",
        subItems: [
          {
            name: "Unila Halal Center",
            href: "/puslit/unila-halal-center",
            description: "Lembaga Pemeriksa Halal Unila",
          },
        ],
      },
      {
        name: "Pusat Penelitian Manajemen Sistem Informasi, Komunikasi, Digitalisasi dan Kolaborasi Riset",
        href: "/puslit/pusat-penelitian-manajeman-sistem-informasi-komunikasi-digitalisasi-dan-kaloborasi-riset",
        description: "Sistem informasi dan kolaborasi",
      },
      {
        name: "Pusat Penelitian SDGs, Pengembangan Wilayah, Kemaritiman, dan Perdesaan",
        href: "/puslit/pusat-penelitian-sd-gs-pengembangan-wilayah-kemaritiman-dan-perdesaan",
        description: "SDGs dan pengembangan wilayah",
      },
      {
        name: "Pusat Penelitian Kemandirian Energi, Kelistrikan dan Material Maju",
        href: "/puslit/pusat-penelitian-kemandirian-energi-kelistrikan-dan-material-maju",
        description: "Energi dan material maju",
      },
      {
        name: "Pusat Penelitian Ekonomi Kreatif, Pariwisata, Perpajakan berkelanjutan",
        href: "/puslit/pusat-penelitian-ekonomi-kreatif-pariwisata-dan-perpajakan-berkelanjutan",
        description: "Ekonomi kreatif dan pariwisata",
      },
    ],
  },
  {
    name: "Administrasi",
    type: "dropdown",
    icon: Settings,
    items: [
      {
        name: "Bagian Umum",
        href: "/administrasi/bagian-umum",
        description: "Administrasi umum",
      },
    ],
  },
  {
    name: "Layanan",
    type: "dropdown",
    icon: BookOpen,
    items: [
      {
        name: "Silemlit 21",
        href: "https://silemlit.unila.ac.id",
        external: true,
        description: "Sistem informasi penelitian",
      },
      {
        name: "Repository",
        href: "https://repository.lppm.unila.ac.id",
        external: true,
        description: "Repository institusi",
      },
      {
        name: "Journal",
        href: "https://journal.lppm.unila.ac.id",
        external: true,
        description: "Jurnal ilmiah",
      },
      {
        name: "PPID",
        href: "https://ppid.lppm.unila.ac.id",
        external: true,
        description: "Layanan informasi publik",
      },
    ],
  },
  {
    name: "POS-AP",
    type: "dropdown",
    icon: Globe,
    items: [
      {
        name: "Download",
        href: "/pos-ap/download",
        description: "Unduhan berkas POS-AP",
      },
      {
        name: "Dokumen",
        href: "/pos-ap/dokumen",
        description: "Dokumen pedoman POS-AP",
      },
    ],
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredMegaItem, setHoveredMegaItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLoggedIn = Boolean(adminAuth.getToken());
  const adminDisplayName = adminAuth.getUser() ?? "Administrator";

  const handleAdminLogout = () => {
    adminAuth.logout();
    navigate("/admin/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      {/* Top Bar */}
      {/* <div className="bg-gradient-to-r from-[#105091] via-blue-900 to-indigo-900 text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="hidden md:flex items-center space-x-4 text-blue-100">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Bandar Lampung, Indonesia</span>
              </span>
              <span className="hidden sm:flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>lppm@unila.ac.id</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://facebook.com/lppmunila" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com/lppmunila" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a href="https://twitter.com/lppmunila" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Navigation */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src={`${import.meta.env.BASE_URL}logo-lppm-unila.png`}
                    alt="Logo LPPM Unila"
                    width={180}
                    height={48}
                    className="object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-sm"
                  />
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#105091] to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex flex-1 justify-center items-center">
              <ul className="flex items-center space-x-1">
                {navLinks.map((link) =>
                  link.type === "link" ? (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="group flex items-center space-x-2 px-4 py-3 rounded-xl font-display font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-blue-600 transition-all duration-300 relative overflow-hidden"
                      >
                        {link.icon && (
                          <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span>{link.name}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#105091]/0 to-[#105091]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </li>
                  ) : (
                    <li key={link.name} className="relative">
                      <button
                        className="group flex items-center space-x-2 px-4 py-3 rounded-xl font-display font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-blue-600 transition-all duration-300"
                        onMouseEnter={() => setActiveDropdown(link.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {link.icon && (
                          <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-300 group-hover:rotate-180 ${
                            activeDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Enhanced Mega Dropdown */}
                      <div
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 ${
                          link.name === "PUSLIT"
                            ? "w-[768px] max-w-[90vw]"
                            : "w-96"
                        } bg-white rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-xl transition-all duration-300 ${
                          activeDropdown === link.name
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible translate-y-2"
                        } z-50`}
                        onMouseEnter={() => setActiveDropdown(link.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="p-4">
                          {link.name === "PUSLIT" ? (
                            /* Special 2-column layout for PUSLIT */
                            <div className="grid grid-cols-2 gap-2">
                              {link.items.map((item) => (
                                <div
                                  key={item.name}
                                  className="relative"
                                  onMouseEnter={() => setHoveredMegaItem(item.name)}
                                  onMouseLeave={() => setHoveredMegaItem(null)}
                                >
                                  {item.external ? (
                                    <a
                                      href={item.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/item flex items-start justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#105091]/5 hover:to-blue-600/5 transition-all duration-200"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 bg-gradient-to-r from-[#105091] to-blue-600 rounded-full flex-shrink-0"></div>
                                          <h4 className="font-display font-semibold text-gray-900 group-hover/item:text-[#105091] transition-colors duration-200 text-sm leading-tight line-clamp-2">
                                            {item.name}
                                          </h4>
                                        </div>
                                        {item.description && (
                                          <p className="text-xs text-gray-500 mt-1 ml-4 line-clamp-2">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-[#105091] transition-colors duration-200 flex-shrink-0 mt-1 ml-2" />
                                    </a>
                                  ) : (
                                    <Link
                                      to={item.href}
                                      className="group/item flex items-start justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#105091]/5 hover:to-blue-600/5 transition-all duration-200"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 bg-gradient-to-r from-[#105091] to-blue-600 rounded-full flex-shrink-0"></div>
                                          <h4 className="font-display font-semibold text-gray-900 group-hover/item:text-[#105091] transition-colors duration-200 text-sm leading-tight line-clamp-2">
                                            {item.name}
                                          </h4>
                                        </div>
                                        {item.description && (
                                          <p className="text-xs text-gray-500 mt-1 ml-4 line-clamp-2">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </Link>
                                  )}
                                {item.subItems && item.subItems.length > 0 && (
                                  <div
                                    className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transition-all duration-200 ${
                                      hoveredMegaItem === item.name
                                        ? "opacity-100 translate-y-0 visible z-50"
                                        : "opacity-0 -translate-y-2 pointer-events-none invisible"
                                    }`}
                                  >
                                    <div className="space-y-3">
                                      {item.subItems.map((subItem) =>
                                        subItem.external ? (
                                          <a
                                            key={subItem.name}
                                            href={subItem.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start justify-between text-sm text-gray-600 hover:text-[#105091] transition-colors duration-200"
                                          >
                                            <div>
                                              <div className="flex items-center space-x-2 font-semibold">
                                                <ChevronRight className="w-3 h-3 text-[#105091]" />
                                                <span>{subItem.name}</span>
                                              </div>
                                              {subItem.description && (
                                                <p className="text-xs text-gray-500 mt-1 ml-5">
                                                  {subItem.description}
                                                </p>
                                              )}
                                            </div>
                                            <ExternalLink className="w-3 h-3 text-gray-400" />
                                          </a>
                                        ) : (
                                          <Link
                                            key={subItem.name}
                                            to={subItem.href}
                                            className="flex items-start text-sm text-gray-600 hover:text-[#105091] transition-colors duration-200"
                                          >
                                            <div>
                                              <div className="flex items-center space-x-2 font-semibold">
                                                <ChevronRight className="w-3 h-3 text-[#105091]" />
                                                <span>{subItem.name}</span>
                                              </div>
                                              {subItem.description && (
                                                <p className="text-xs text-gray-500 mt-1 ml-5">
                                                  {subItem.description}
                                                </p>
                                              )}
                                            </div>
                                          </Link>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Original single-column layout for other dropdowns */
                            <div className="space-y-1">
                              {link.items.map((item, index) => (
                                <div
                                  key={item.name}
                                  className="relative"
                                  onMouseEnter={() => setHoveredMegaItem(item.name)}
                                  onMouseLeave={() => setHoveredMegaItem(null)}
                                >
                              {item.external ? (
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/item flex items-start justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#105091]/5 hover:to-blue-600/5 transition-all duration-200"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-gradient-to-r from-[#105091] to-blue-600 rounded-full"></div>
                                      <h4 className="font-display font-semibold text-gray-900 group-hover/item:text-[#105091] transition-colors duration-200">
                                        {item.name}
                                      </h4>
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-gray-500 mt-1 ml-4">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-[#105091] transition-colors duration-200 flex-shrink-0 mt-1" />
                                </a>
                              ) : (
                                <Link
                                  to={item.href}
                                  className="group/item flex items-start justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#105091]/5 hover:to-blue-600/5 transition-all duration-200"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-gradient-to-r from-[#105091] to-blue-600 rounded-full"></div>
                                      <h4 className="font-display font-semibold text-gray-900 group-hover/item:text-[#105091] transition-colors duration-200">
                                        {item.name}
                                      </h4>
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-gray-500 mt-1 ml-4">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              )}
                            {item.subItems && item.subItems.length > 0 && (
                              <div
                                className={`absolute top-3 left-full ml-4 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transition-all duration-200 ${
                                  hoveredMegaItem === item.name
                                    ? "opacity-100 translate-x-0 visible"
                                    : "opacity-0 -translate-x-2 pointer-events-none invisible"
                                }`}
                              >
                                <div className="space-y-3">
                                  {item.subItems.map((subItem) =>
                                    subItem.external ? (
                                      <a
                                        key={subItem.name}
                                        href={subItem.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start justify-between text-sm text-gray-600 hover:text-[#105091] transition-colors duration-200"
                                      >
                                        <div>
                                          <div className="flex items-center space-x-2 font-semibold">
                                            <ChevronRight className="w-3 h-3 text-[#105091]" />
                                            <span>{subItem.name}</span>
                                          </div>
                                          {subItem.description && (
                                            <p className="text-xs text-gray-500 mt-1 ml-5">
                                              {subItem.description}
                                            </p>
                                          )}
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-gray-400" />
                                      </a>
                                    ) : (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.href}
                                        className="flex items-start text-sm text-gray-600 hover:text-[#105091] transition-colors duration-200"
                                      >
                                        <div>
                                          <div className="flex items-center space-x-2 font-semibold">
                                            <ChevronRight className="w-3 h-3 text-[#105091]" />
                                            <span>{subItem.name}</span>
                                          </div>
                                          {subItem.description && (
                                            <p className="text-xs text-gray-500 mt-1 ml-5">
                                              {subItem.description}
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                            {index < link.items.length - 1 && (
                              <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                            )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </nav>

            {/* Admin Actions */}
            {isAdminRoute && isAdminLoggedIn && (
              <div className="hidden lg:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Admin</p>
                  <p className="font-semibold text-gray-800">{adminDisplayName}</p>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Keluar
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-xl text-gray-700 hover:text-[#105091] hover:bg-gradient-to-r hover:from-[#105091]/10 hover:to-blue-600/10 transition-all duration-300 border border-gray-200"
              >
                <span className="sr-only">Buka menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 bg-white/95 backdrop-blur-xl border-b border-white/20 ${
          isMenuOpen
            ? "max-h-[80vh] opacity-100 shadow-2xl overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2">
          {isAdminRoute && isAdminLoggedIn && (
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 mb-4">
              <div>
                <p className="text-xs text-gray-500">Admin</p>
                <p className="font-semibold text-gray-800">{adminDisplayName}</p>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAdminLogout();
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-white hover:bg-red-50 transition-colors"
              >
                Keluar
              </button>
            </div>
          )}
          {navLinks.map((link) =>
            link.type === "link" ? (
              <Link
                key={`mobile-${link.name}`}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center space-x-3 px-4 py-4 rounded-xl font-display font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-blue-600 transition-all duration-300"
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                <span>{link.name}</span>
              </Link>
            ) : (
              <div key={`mobile-${link.name}`} className="space-y-2">
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-2 font-display font-semibold text-sm text-gray-500 uppercase tracking-wider">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.name}</span>
                  </div>
                </div>
                <div className="ml-4 space-y-1">
                  {link.items.map((item) => (
                    <div key={item.name} className="space-y-1">
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                          className="group/item flex items-center justify-between px-4 py-3 rounded-xl font-body text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-blue-600 transition-all duration-300"
                        >
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors duration-200" />
                        </a>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 rounded-xl font-body text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-blue-600 transition-all duration-300"
                        >
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          )}
                        </Link>
                      )}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="ml-8 space-y-1">
                          {item.subItems.map((subItem) =>
                            subItem.external ? (
                              <a
                                key={subItem.name}
                                href={subItem.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-[#105091]/70 hover:to-blue-600/70 transition-all duration-300"
                              >
                                <div className="flex items-center space-x-2">
                                  <ChevronRight className="w-3 h-3" />
                                  <span className="font-medium">{subItem.name}</span>
                                </div>
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              </a>
                            ) : (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-[#105091]/70 hover:to-blue-600/70 transition-all duration-300"
                              >
                                <ChevronRight className="w-3 h-3" />
                                <span className="font-medium">{subItem.name}</span>
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
