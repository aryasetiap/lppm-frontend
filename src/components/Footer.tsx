/**
 * Komponen Footer Ultra-Modern untuk LPPM Unila.
 * Design dengan glass morphism, animasi halus, gradient modern, dan layout yang responsif.
 */

import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
  FaBuilding,
  FaGraduationCap,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";

/**
 * Data link navigasi footer yang diperkaya dengan deskripsi.
 */
const footerSections = {
  profil: {
    title: "Profil",
    icon: FaBuilding,
    links: [
      {
        name: "Pimpinan",
        href: "/profil#pimpinan",
        description: "Struktur kepemimpinan",
      },
      {
        name: "Visi & Misi",
        href: "/profil#visi-misi",
        description: "Tujuan LPPM",
      },
      {
        name: "Tugas dan Fungsi",
        href: "/profil#tugas-fungsi",
        description: "Peran institusi",
      },
      {
        name: "Struktur Organisasi",
        href: "/profil#struktur-organisasi",
        description: "Struktur lengkap",
      },
    ],
  },
  pui: {
    title: "PUI",
    icon: FaGraduationCap,
    links: [
      {
        name: "Pusat Unggulan Ipteks Anggrek, Kopi, Lada, Kako dan Pengembangan Komoditas Strategis dan Agroindustri Lampung",
        href: "/pui/pusat-unggulan-ipteks-anggrek-kopi-lada-kako-dan-pengembangan-komoditas-strategis-dan-agroindustri-lampung",
        description: "Pertanian & agroindustri",
      },
    ],
  },
  puslit: {
    title: "Pusat Penelitian",
    icon: FaGraduationCap,
    links: [
      {
        name: "Pusat Penelitian KKN",
        href: "/puslit/pusat-penelitian-kuliah-kerja-nyata-kkn",
        description: "Program KKN",
      },
      {
        name: "Pusat Penelitian HKI dan PATEN",
        href: "/puslit/pusat-penelitian-hak-kekayaan-intelektual-hki-dan-paten",
        description: "Proteksi kekayaan intelektual",
      },
      {
        name: "Pusat Penelitian Lingkungan Hidup dan Penanggulangan Bencana",
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
        name: "Pusat Penelitian Ekonomi Kreatif, Pariwisata, dan Perpajakan Berkelanjutan",
        href: "/puslit/pusat-penelitian-ekonomi-kreatif-pariwisata-dan-perpajakan-berkelanjutan",
        description: "Ekonomi kreatif dan pariwisata",
      },
    ],
  },
  administrasi: {
    title: "Administrasi",
    icon: FaBuilding,
    links: [
      {
        name: "Bagian Umum",
        href: "/administrasi/bagian-umum",
        description: "Layanan administrasi",
      },
    ],
  },
  layanan: {
    title: "Layanan Digital",
    icon: FaGlobe,
    links: [
      {
        name: "Silemlit 21",
        href: "https://silemlit.unila.ac.id",
        external: true,
        description: "Sistem penelitian",
      },
      {
        name: "Repository",
        href: "https://repository.lppm.unila.ac.id",
        external: true,
        description: "Koleksi digital",
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
        description: "Informasi publik",
      },
    ],
  },
};

/**
 * Data ikon sosial media dengan efek hover yang ditingkatkan.
 */
const socialMedia = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100093413097453&locale=id_ID",
    icon: FaFacebook,
    gradient: "from-blue-600 to-blue-700",
    hover: "hover:shadow-blue-500/25",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/lppm_unila/?hl=en",
    icon: FaInstagram,
    gradient: "from-pink-600 via-purple-600 to-orange-600",
    hover: "hover:shadow-pink-500/25",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/6285380464628",
    icon: FaWhatsapp,
    gradient: "from-green-600 to-green-700",
    hover: "hover:shadow-green-500/25",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@lppmunila",
    icon: FaTiktok,
    gradient: "from-gray-700 to-black",
    hover: "hover:shadow-gray-500/25",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@lppmunila2879",
    icon: FaYoutube,
    gradient: "from-red-600 to-red-700",
    hover: "hover:shadow-red-500/25",
  },
];

/**
 * Komponen utama Footer Ultra-Modern.
 * @returns {React.ReactElement} Footer dengan glass morphism, gradient, dan animasi modern.
 */
const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#105091] via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section with Contact Info */}
        <div className="border-b border-white/10">
          <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-1 space-y-6">
                <div className="group">
                  <div className="relative inline-block">
                    <img
                      src={`${import.meta.env.BASE_URL}logo-footer-lppm-unila.png`}
                      alt="Logo LPPM Unila"
                      width={260}
                      height={60}
                      className="object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-lg"
                    />
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    LPPM Universitas Lampung
                  </h3>
                  <p className="font-body text-blue-100 leading-relaxed text-sm max-w-xs">
                    Mendukung pengembangan penelitian dan pengabdian masyarakat
                    yang inovatif serta berkelanjutan.
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="font-display font-semibold text-sm text-blue-200 uppercase tracking-wider mb-4">
                    Hubungi Kami
                  </h4>
                  <div className="flex gap-3">
                    {socialMedia.map((social) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          className={`group relative flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br ${social.gradient} ${social.hover} hover:shadow-xl`}
                        >
                          <IconComponent className="w-5 h-5 text-white group-hover:scale-110 transition-all duration-300" />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h4 className="font-display text-xl font-bold text-white mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-lg flex items-center justify-center mr-3">
                      <FaMapMarkerAlt className="w-4 h-4 text-white" />
                    </div>
                    Informasi Kontak
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-white">Alamat</h5>
                          <p className="text-blue-100 text-sm mt-1">
                            Jl. Prof Dr. Sumantri Brojonegoro No. 1<br />
                            Bandar Lampung, 35145, Lampung
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaEnvelope className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-white">Email</h5>
                          <a
                            href="mailto:lppm@unila.ac.id"
                            className="text-blue-100 text-sm hover:text-white transition-colors duration-200 mt-1 block"
                          >
                            lppm@unila.ac.id
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaClock className="w-5 h-5 text-orange-300" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-white">
                            Jam Operasional
                          </h5>
                          <p className="text-blue-100 text-sm mt-1">
                            Senin - Jumat: 08:00 - 16:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {Object.entries(footerSections).map(([key, section]) => (
              <FooterSection key={key} section={section} />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <p className="text-blue-100 text-sm">
                  © {new Date().getFullYear()} LPPM Universitas Lampung. All
                  rights reserved.
                </p>
              </div>
              <div className="flex justify-center flex-shrink-0 px-4">
                <img
                  src={`${import.meta.env.BASE_URL}logolppm.png`}
                  alt="Kolaborasi Logo LPPM"
                  className="h-14 lg:h-16 w-auto object-contain drop-shadow-md"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center space-x-1 text-blue-100">
                  <span>Developed with</span>
                  <span className="text-red-400">❤</span>
                  <span>by</span>
                  <span className="text-white font-semibold">LPPM Unila</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
  description?: string;
}

interface FooterSectionType {
  title: string;
  icon: any;
  links: FooterLink[];
}

/**
 * Komponen bagian footer dengan design modern.
 * @param section Data section footer
 * @returns {React.ReactElement} Footer section dengan icon dan link modern
 */
const FooterSection = ({ section }: { section: FooterSectionType }) => {
  const IconComponent = section.icon;
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center">
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-display font-bold text-white">{section.title}</h3>
      </div>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.name}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start space-x-2 text-blue-100 hover:text-white transition-all duration-200"
              >
                <span className="text-xs group-hover:translate-x-1 transition-transform duration-200 inline-block mt-1">
                  <FaExternalLinkAlt className="w-3 h-3" />
                </span>
                <div>
                  <div className="font-medium group-hover:text-white transition-colors duration-200">
                    {link.name}
                  </div>
                  {link.description && (
                    <div className="text-xs text-blue-200/70 group-hover:text-blue-100/70 transition-colors duration-200">
                      {link.description}
                    </div>
                  )}
                </div>
              </a>
            ) : (
              <Link
                to={link.href}
                className="group flex items-start space-x-2 text-blue-100 hover:text-white transition-all duration-200"
              >
                <span className="text-xs group-hover:translate-x-1 transition-transform duration-200 inline-block mt-1">
                  <FaArrowRight className="w-3 h-3" />
                </span>
                <div>
                  <div className="font-medium group-hover:text-white transition-colors duration-200">
                    {link.name}
                  </div>
                  {link.description && (
                    <div className="text-xs text-blue-200/70 group-hover:text-blue-100/70 transition-colors duration-200">
                      {link.description}
                    </div>
                  )}
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
