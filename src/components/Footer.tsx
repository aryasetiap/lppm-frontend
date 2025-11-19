/**
 * Komponen Footer modern dan elegan untuk website LPPM Unila.
 * Menampilkan logo, informasi kontak, social media icons modern, dan navigasi cepat ke berbagai bagian situs.
 * Data link dikelola dalam objek agar mudah diperbarui dengan design yang ditingkatkan.
 * @module Footer
 */

import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaExternalLinkAlt } from "react-icons/fa";

/**
 * Data link navigasi footer.
 */
const footerLinks = {
  profil: [
    { name: "Pimpinan", href: "/profil#pimpinan" },
    { name: "Visi & Misi", href: "/profil#visi-misi" },
    { name: "Tugas dan Fungsi", href: "/profil#tugas-fungsi" },
    { name: "Struktur Organisasi", href: "/profil#struktur-organisasi" },
  ],
  administrasi: [
    { name: "Bagian Umum", href: "/administrasi/bagian-umum" },
    { name: "Bagian Keuangan", href: "/administrasi/bagian-keuangan" },
    { name: "Bagian Sumber Daya", href: "/administrasi/bagian-sumber-daya" },
    { name: "Bagian Kerjasama", href: "/administrasi/bagian-kerjasama" },
    { name: "Bagian Umum & Akademik", href: "/administrasi/bagian-umum-akademik" },
  ],
  pui: [
    {
      name: "Anggrek, Kopi, Lada, Kako",
      href: "/pui/anggrek-kopi-lada-kako",
    },
  ],
  puslit: [
    { name: "Kuliah Kerja Nyata", href: "/puslit/kuliah-kerja-nyata" },
    { name: "Lingkungan Hidup", href: "/puslit/lingkungan-hidup" },
    { name: "Studi Kebijakan Publik", href: "/puslit/studi-kebijakan-publik" },
    {
      name: "Publikasi dan Kerjasama",
      href: "/puslit/publikasi-dan-kerjasama",
    },
    { name: "Inkubator Bisnis", href: "/puslit/inkubator-bisnis" },
    {
      name: "Manajemen Sistem Informasi",
      href: "/puslit/manajemen-sistem-informasi",
    },
    { name: "SDGs", href: "/puslit/sdgs" },
    { name: "Kemandirian Energi", href: "/puslit/kemandirian-energi" },
    { name: "Ekonomi Kreatif", href: "/puslit/ekonomi-kreatif" },
  ],
  layanan: [
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
    {
      name: "PPID",
      href: "https://ppid.lppm.unila.ac.id",
      external: true,
    },
  ],
};

/**
 * Data ikon sosial media modern pada footer dengan react-icons.
 */
const socialIcons = [
  {
    name: "Facebook",
    href: "https://facebook.com/lppmunila",
    icon: FaFacebook,
    color: "hover:bg-blue-600",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/lppmunila",
    icon: FaInstagram,
    color: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-600",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/6285380464628",
    icon: FaWhatsapp,
    color: "hover:bg-green-600",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@lppmunila",
    icon: FaYoutube,
    color: "hover:bg-red-600",
  },
];

/**
 * Komponen utama Footer modern.
 * @returns {React.ReactElement} Footer multi-kolom modern dengan logo, kontak, sosial media modern, dan navigasi.
 */
const Footer = () => (
  <footer className="bg-gradient-to-br from-white via-gray-50/50 to-white border-t border-gray-100/80 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23105091' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
    </div>

    <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr_1fr_1fr] gap-12">
        {/* Logo and Contact Section */}
        <div className="space-y-6">
          <div className="group">
            <img
              src="/logo-footer-lppm-unila.png"
              alt="Logo LPPM Unila"
              width={280}
              height={64}
              className="object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-bold text-[24px] text-[#105091] leading-tight">
              LPPM Universitas Lampung
            </h3>

            <div className="space-y-3 font-body text-[15px] text-gray-700 leading-relaxed">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <svg className="w-full h-full text-[#105091]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>
                  Jl. Prof Dr. Sumantri Brojonegoro No. 1<br />
                  Bandar Lampung, 35145, Lampung
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg className="w-full h-full text-[#105091]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <a
                  href="tel:+6285380464628"
                  className="hover:text-[#105091] transition-colors duration-200"
                >
                  +62 853-8046-4628
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg className="w-full h-full text-[#105091]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <a
                  href="mailto:lppm@kpa.unila.ac.id"
                  className="hover:text-[#105091] transition-colors duration-200"
                >
                  lppm@kpa.unila.ac.id
                </a>
              </div>
            </div>
          </div>

          {/* Modern Social Media Icons */}
          <div className="pt-2">
            <h4 className="font-display font-semibold text-sm text-gray-600 uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialIcons.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`group relative flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 ${social.color} hover:shadow-lg`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex flex-col gap-8">
          <FooterLinkSection title="Profil" links={footerLinks.profil} />
          <FooterLinkSection title="Administrasi" links={footerLinks.administrasi} />
        </div>

        <div className="flex flex-col gap-8">
          <FooterLinkSection title="PUI" links={footerLinks.pui} />
          <FooterLinkSection title="Layanan" links={footerLinks.layanan} />
        </div>

        <div>
          <FooterLinkSection title="PUSLIT" links={footerLinks.puslit} />
        </div>
      </div>
    </div>
  </footer>
);

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

/**
 * Komponen bagian link modern pada footer.
 * @param title Judul bagian link
 * @param links Daftar link yang akan ditampilkan
 * @returns {React.ReactElement} Daftar link navigasi footer modern
 */
const FooterLinkSection = ({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) => (
  <div>
    <h3 className="font-display font-semibold text-lg text-gray-800 mb-5 relative">
      <span className="relative z-10">{title}</span>
      <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-[#105091] to-blue-600 rounded-full"></div>
    </h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="font-body text-gray-600 hover:text-[#105091] transition-all duration-200 text-sm flex items-center group py-1 px-2 rounded-lg hover:bg-gray-50/50 -mx-2"
          >
            <span className="flex-1 font-medium">{link.name}</span>
            {link.external && (
              <FaExternalLinkAlt className="w-3 h-3 ml-2 text-gray-400 group-hover:text-[#105091] transition-colors duration-200 opacity-0 group-hover:opacity-100" />
            )}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;