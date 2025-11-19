/**
 * Komponen Footer multi-kolom untuk website LPPM Unila.
 * Menampilkan logo, informasi kontak, link sosial media, dan navigasi cepat ke berbagai bagian situs.
 * Data link dikelola dalam objek agar mudah diperbarui.
 * @module Footer
 */

import { Link } from "react-router-dom";

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
 * Data ikon sosial media pada footer.
 */
const socialIcons = [
  {
    name: "Facebook",
    href: "#",
    src: "/ico-facebook.png",
    alt: "Facebook",
  },
  {
    name: "Instagram",
    href: "#",
    src: "/ico-instagram.png",
    alt: "Instagram",
  },
  {
    name: "WhatsApp",
    href: "#",
    src: "/ico-whatsapp.png",
    alt: "WhatsApp",
  },
  {
    name: "YouTube",
    href: "#",
    src: "/ico-youtube.png",
    alt: "YouTube",
  },
];

/**
 * Komponen utama Footer.
 * @returns {React.ReactElement} Footer multi-kolom dengan logo, kontak, sosial media, dan navigasi.
 */
const Footer = () => (
  <footer className="bg-white border-t-2 border-gray-100">
    <div className="max-w-[1600px] mx-auto px-16 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr_1fr_1fr] gap-8">
        <div>
          <div className="mb-6">
            <img
              src="/logo-footer-lppm-unila.png"
              alt="Logo LPPM Unila"
              width={260}
              height={60}
              className="object-contain"
            />
          </div>
          <h3 className="text-[22px] font-extrabold text-[#105091] mb-3">
            LPPM Universitas Lampung
          </h3>
          <div className="text-[15px] text-black mb-2 leading-snug">
            Jl. Prof Dr. Sumantri Brojonegoro No. 1 Bandar Lampung, <br />
            35145, Lampung, Indonesia
          </div>
          <div className="text-[15px] text-black mb-1 leading-snug">
            Telp +62 853-8046-4628
          </div>
          <div className="text-[15px] text-black mb-2 leading-snug">
            Email{" "}
            <a
              href="mailto:lppm@kpa.unila.ac.id"
              className="hover:underline text-black"
            >
              lppm@kpa.unila.ac.id
            </a>
          </div>
          <div className="flex gap-5 mt-4">
            {socialIcons.map((icon) => (
              <Link key={icon.name} to={icon.href} aria-label={icon.name}>
                <img
                  src={icon.src}
                  alt={icon.alt}
                  width={26}
                  height={26}
                  className="hover:scale-110 transition-transform"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <FooterLinkSection title="Profil" links={footerLinks.profil} />
          <FooterLinkSection title="PUI" links={footerLinks.pui} />
        </div>
        <div>
          <FooterLinkSection title="PUSLIT" links={footerLinks.puslit} />
        </div>
        <div>
          <FooterLinkSection title="Layanan" links={footerLinks.layanan} />
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
 * Komponen bagian link pada footer.
 * @param title Judul bagian link
 * @param links Daftar link yang akan ditampilkan
 * @returns {React.ReactElement} Daftar link navigasi footer
 */
const FooterLinkSection = ({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) => (
  <div>
    <h3 className="text-black font-medium text-lg mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-gray-600 hover:text-[#105091] transition-colors duration-200 text-sm flex items-center group"
          >
            <span className="flex-1">{link.name}</span>
            {link.external && (
              <svg
                className="w-3 h-3 ml-1 text-gray-400 group-hover:text-[#105091] transition-colors duration-200"
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
            )}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;