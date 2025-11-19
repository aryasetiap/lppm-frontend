import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHandsHelping,
  FaDatabase,
  FaBook,
  FaInfoCircle,
  FaArrowRight
} from "react-icons/fa";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#105091] to-[#0a3b6d] text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                LPPM Universitas Lampung
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                Lembaga Penelitian dan Pengabdian kepada Masyarakat
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                Mendukung pengembangan penelitian dan pengabdian masyarakat yang inovatif
                serta berkelanjutan untuk kemajuan bangsa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/penelitian"
                  className="bg-white text-[#105091] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Penelitian
                </Link>
                <Link
                  to="/pengabdian"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#105091] transition-all duration-300 transform hover:scale-105"
                >
                  Pengabdian
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/hero-image.jpg"
                  alt="LPPM Unila Activities"
                  className="rounded-lg w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23f0f9ff' width='800' height='400'/%3E%3Ctext fill='%23105091' font-family='Arial' font-size='24' text-anchor='middle' x='400' y='200'%3ELPPM Unila Hero Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Layanan Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              PORTAL LAYANAN
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              LPPM Universitas Lampung Menyediakan Berbagai Layanan Untuk Mendukung Kegiatan Penelitian,
              Pengabdian Kepada Masyarakat, Serta Akses Informasi Dan Publikasi Ilmiah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Penelitian",
                icon: FaSearch,
                color: "from-blue-500 to-blue-600",
                description: "Kelola dan ajukan proposal penelitian",
                link: "/penelitian"
              },
              {
                title: "Pengabdian",
                icon: FaHandsHelping,
                color: "from-green-500 to-green-600",
                description: "Program pengabdian kepada masyarakat",
                link: "/pengabdian"
              },
              {
                title: "Repository",
                icon: FaDatabase,
                color: "from-purple-500 to-purple-600",
                description: "Koleksi karya ilmiah universitas",
                link: "https://repository.lppm.unila.ac.id",
                external: true
              },
              {
                title: "Journal",
                icon: FaBook,
                color: "from-orange-500 to-orange-600",
                description: "Jurnal ilmiah dan publikasi",
                link: "https://journal.lppm.unila.ac.id",
                external: true
              },
              {
                title: "PPID",
                icon: FaInfoCircle,
                color: "from-red-500 to-red-600",
                description: "Informasi publik dan transparansi",
                link: "https://ppid.lppm.unila.ac.id",
                external: true
              }
            ].map((portal, index) => {
              const IconComponent = portal.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  <div className={`h-2 bg-gradient-to-r ${portal.color}`}></div>
                  <div className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${portal.color} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3 text-center">
                      {portal.title}
                    </h3>
                    <p className="font-body text-gray-600 mb-6 text-center leading-relaxed">
                      {portal.description}
                    </p>
                    {portal.external ? (
                      <a
                        href={portal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-colors duration-200 group"
                      >
                        Akses Portal
                        <FaArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    ) : (
                      <Link
                        to={portal.link}
                        className="flex items-center justify-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-colors duration-200 group"
                      >
                        Akses Portal
                        <FaArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/layanan"
              className="inline-flex items-center bg-gradient-to-r from-[#105091] to-[#0a3b6d] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-[#0a3b6d] hover:to-[#082847] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Lihat Semua Layanan
              <FaArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Berita & Pengumuman
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Informasi terkini mengenai kegiatan penelitian dan pengabdian masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-[#105091] to-[#0a3b6d] flex items-center justify-center">
                  <span className="text-white text-6xl">📰</span>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">15 November 2024</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Judul Berita Penelitian Terkini {item}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore...
                  </p>
                  <Link
                    to="/berita/1"
                    className="text-[#105091] font-semibold hover:text-[#0a3b6d] transition-colors duration-200"
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/berita"
              className="bg-[#105091] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0a3b6d] transition-colors duration-200"
            >
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;