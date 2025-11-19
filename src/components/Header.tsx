/**
 * Komponen Header clean dan fungsional untuk LPPM Unila.
 * Design sederhana, responsif, dan mudah digunakan dengan dropdown navigasi.
 */

"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

type NavLink =
  | { name: string; href: string; type: "link" }
  | {
      name: string;
      type: "dropdown";
      items: {
        name: string;
        href: string;
        external?: boolean;
      }[];
    };

const navLinks: NavLink[] = [
  { name: "Beranda", href: "/", type: "link" },
  {
    name: "Profil",
    type: "dropdown",
    items: [
      { name: "Pimpinan", href: "/profil#pimpinan" },
      { name: "Visi & Misi", href: "/profil#visi-misi" },
      { name: "Tugas dan Fungsi", href: "/profil#tugas-fungsi" },
      { name: "Struktur Organisasi", href: "/profil#struktur-organisasi" },
    ],
  },
  {
    name: "PUI",
    type: "dropdown",
    items: [
      {
        name: "Pusat Unggulan Ipteks Anggrek, Kopi, Lada, Kako dan Pengembangan Komoditas Strategis dan Agroindustri Lampung",
        href: "/pui/pusat-unggulan-ipteks-anggrek-kopi-lada-kako-dan-pengembangan-komoditas-strategis-dan-agroindustri-lampung",
      },
    ],
  },
  {
    name: "PUSLIT",
    type: "dropdown",
    items: [
      {
        name: "Kuliah Kerja Nyata",
        href: "/puslit/pusat-penelitian-kuliah-kerja-nyata-kkn",
      },
      {
        name: "Pusat Penelitian HAKI dan PATEN",
        href: "/puslit/pusat-penelitian-hak-kekayaan-intelektual-hki-dan-paten",
      },
      {
        name: "Pusat Penelitian Bencana, Lingkungan Hidup dan Sumber Daya Alam",
        href: "/puslit/pusat-penelitian-bencana-lingkungan-hidup-dan-sumber-daya-alam",
      },
      {
        name: "Pusat Penelitian Studi Kebijakan Publik, Pembangunan dan Sosial Budaya",
        href: "/puslit/pusat-penelitian-studi-kebijakan-publik-pembangunan-dan-sosial-budaya",
      },
      {
        name: "Pusat Penelitian Publikasi dan Kerjasama",
        href: "/puslit/pusat-penelitian-publikasi-dan-kerja-sama",
      },
      {
        name: "Pusat Penelitian Inkubator Bisnis, Hilirisasi Inovasi, Ketahanan Pangan dan Sertifikasi Halal",
        href: "/puslit/pusat-penelitian-inkubator-bisnis-hilirisasi-inovasi-ketahanan-pangan-dan-sertifikasi-halal",
      },
      {
        name: "Pusat Penelitian Manajemen Sistem Informasi, Komunikasi, Digitalisasi dan Kolaborasi Riset",
        href: "/puslit/pusat-penelitian-manajeman-sistem-informasi-komunikasi-digitalisasi-dan-kaloborasi-riset",
      },
      {
        name: "Pusat Penelitian SDGs, Pengembangan Wilayah, Kemaritiman, dan Perdesaan",
        href: "/puslit/pusat-penelitian-sd-gs-pengembangan-wilayah-kemaritiman-dan-perdesaan",
      },
      {
        name: "Pusat Penelitian Kemandirian Energi, Kelistrikan dan Material Maju",
        href: "/puslit/pusat-penelitian-kemandirian-energi-kelistrikan-dan-material-maju",
      },
      {
        name: "Pusat Penelitian Ekonomi Kreatif, Pariwisata, Perpajakan berkelanjutan",
        href: "/puslit/pusat-penelitian-ekonomi-kreatif-pariwisata-dan-perpajakan-berkelanjutan",
      },
    ],
  },
  {
    name: "Layanan",
    type: "dropdown",
    items: [
      {
        name: "Silemlit 21",
        href: "https://silemlit.unila.ac.id",
        external: true,
      },
      {
        name: "Repository",
        href: "https://repository.lppm.unila.ac.id",
        external: true,
      },
      {
        name: "Journal",
        href: "https://journal.lppm.unila.ac.id",
        external: true,
      },
      { name: "PPID", href: "https://ppid.lppm.unila.ac.id", external: true },
    ],
  },
  { name: "Unduhan", href: "/unduhan", type: "link" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 rounded-b-3xl">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center min-w-[260px]">
            <Link to="/" className="flex items-center">
              <img
                src="/logo-lppm-unila.png"
                alt="Logo LPPM Unila"
                width={180}
                height={48}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-10">
            {navLinks.map((link) =>
              link.type === "link" ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-lg font-normal text-black hover:text-[#105091] transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <div key={link.name} className="relative group">
                  <button className="text-lg font-normal text-black hover:text-[#105091] transition-colors duration-200 flex items-center space-x-1">
                    <span>{link.name}</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {link.items.map((item) =>
                        item.external ? (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-[#105091] hover:text-white transition-colors duration-150 group/item"
                          >
                            <span className="flex-1">{item.name}</span>
                            <svg
                              className="w-3 h-3 ml-2 text-gray-400 group-hover/item:text-white transition-colors duration-150"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-[#105091] hover:text-white transition-colors duration-150 group/item"
                          >
                            <span className="flex-1">{item.name}</span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4 min-w-[160px] justify-end">
            {/* Search Button */}
            <Link
              to="/search"
              className="p-2 text-black hover:text-[#105091] transition-colors duration-200 rounded-full hover:bg-gray-100"
              aria-label="Pencarian"
              title="Pencarian"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-[#105091] focus:outline-none"
            >
              <span className="sr-only">Buka menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md rounded-b-3xl">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) =>
              link.type === "link" ? (
                <Link
                  key={`mobile-${link.name}`}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-white hover:bg-[#105091] transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <div key={`mobile-${link.name}`} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {link.name}
                  </div>
                  <div className="ml-4 space-y-1">
                    {link.items.map((item) =>
                      item.external ? (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-white hover:bg-[#105091] transition-colors duration-200"
                        >
                          <span>{item.name}</span>
                          <svg
                            className="w-3 h-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-white hover:bg-[#105091] transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )
            )}

            {/* Mobile Search */}
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-black hover:text-white hover:bg-[#105091] transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Pencarian
            </Link>

            {/* Mobile Language Switcher */}
            <div className="px-3 pt-4 border-t border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;