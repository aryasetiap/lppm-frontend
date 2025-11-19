/**
 * Komponen Header modern dan elegan untuk LPPM Unila.
 * Design modern dengan font yang bagus, responsif, dan dropdown navigasi yang ditingkatkan.
 */

"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ExternalLink, Menu, X } from "lucide-react";

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
    name: "Administrasi",
    type: "dropdown",
    items: [{ name: "Bagian Umum", href: "/administrasi/bagian-umum" }],
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
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white/95 backdrop-blur-xs shadow-sm sticky top-0 z-50 rounded-b-3xl border-b border-gray-100/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src="/logo-lppm-unila.png"
                alt="Logo LPPM Unila"
                width={200}
                height={52}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <ul className="flex items-center space-x-2">
              {navLinks.map((link) =>
                link.type === "link" ? (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="font-display font-medium text-[15px] text-gray-700 hover:text-[#105091] px-4 py-2 rounded-lg hover:bg-gray-50/50 transition-all duration-200 relative group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#105091] transition-all duration-300 group-hover:w-8 transform -translate-x-1/2"></span>
                    </Link>
                  </li>
                ) : (
                  <li key={link.name} className="relative">
                    <button
                      className="font-display font-medium text-[15px] text-gray-700 hover:text-[#105091] px-4 py-2 rounded-lg hover:bg-gray-50/50 transition-all duration-200 flex items-center space-x-1 group"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === link.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Enhanced Dropdown Menu */}
                    <div
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-lg transition-all duration-300 ${
                        activeDropdown === link.name
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2"
                      } z-50`}
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="py-2">
                        {link.items.map((item, index) => (
                          <div key={item.name} className="relative">
                            {item.external ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-5 py-3 text-sm font-body text-gray-600 hover:bg-gradient-to-r hover:from-[#105091] hover:to-[#0d3a6b] hover:text-white transition-all duration-200 group/item hover:px-6"
                              >
                                <span className="flex-1 font-medium">
                                  {item.name}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 ml-2 text-gray-400 group-hover/item:text-white transition-colors duration-200" />
                              </a>
                            ) : (
                              <Link
                                to={item.href}
                                className="block px-5 py-3 text-sm font-body text-gray-600 hover:bg-gradient-to-r hover:from-[#105091] hover:to-[#0d3a6b] hover:text-white transition-all duration-200 group/item hover:px-6 font-medium"
                              >
                                {item.name}
                              </Link>
                            )}
                            {index < link.items.length - 1 && (
                              <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-700 hover:text-[#105091] hover:bg-gray-50 transition-all duration-200"
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

      {/* Enhanced Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xs shadow-lg rounded-b-3xl border-t border-gray-100/50">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) =>
              link.type === "link" ? (
                <Link
                  key={`mobile-${link.name}`}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-display font-medium text-[15px] text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-[#0d3a6b] px-4 py-3 rounded-xl transition-all duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <div key={`mobile-${link.name}`} className="space-y-2">
                  <div className="font-display font-semibold text-[13px] text-gray-500 uppercase tracking-wider px-4 py-2">
                    {link.name}
                  </div>
                  <div className="ml-2 space-y-1">
                    {link.items.map((item) =>
                      item.external ? (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-body text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-[#0d3a6b] transition-all duration-200 group/item"
                        >
                          <span className="font-medium">{item.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-white transition-colors duration-200" />
                        </a>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 rounded-xl text-sm font-body text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#105091] hover:to-[#0d3a6b] transition-all duration-200 font-medium"
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
