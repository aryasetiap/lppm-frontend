import { Link } from "react-router-dom";

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

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Penelitian per Tahun" },
              { number: "300+", label: "Pengabdian Masyarakat" },
              { number: "50+", label: "Pusat Studi" },
              { number: "1000+", label: "Peneliti" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#105091] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai layanan penelitian dan pengabdian masyarakat untuk mendukung
              pengembangan ilmu pengetahuan dan pemberdayaan komunitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Penelitian",
                description: "Fasilitas dan dukungan untuk kegiatan penelitian yang inovatif dan bermutu.",
                icon: "🔬",
                link: "/penelitian",
              },
              {
                title: "Pengabdian Masyarakat",
                description: "Program pemberdayaan masyarakat berbasis penelitian dan kearifan lokal.",
                icon: "🤝",
                link: "/pengabdian",
              },
              {
                title: "Publikasi Ilmiah",
                description: "Platform publikasi karya ilmiah untuk mendukung diseminasi hasil penelitian.",
                icon: "📚",
                link: "https://journal.lppm.unila.ac.id",
                external: true,
              },
              {
                title: "Kerjasama",
                description: "Jalinan kerjasama institusional untuk pengembangan riset kolaboratif.",
                icon: "🤝",
                link: "/kerjasama",
              },
              {
                title: "Sistem Informasi",
                description: "Sistem terintegrasi untuk pengelolaan penelitian dan pengabdian masyarakat.",
                icon: "💻",
                link: "https://silemlit.unila.ac.id",
                external: true,
              },
              {
                title: "Repository",
                description: "Digital repository untuk menyimpan dan mengakses karya ilmiah Unila.",
                icon: "📁",
                link: "https://repository.lppm.unila.ac.id",
                external: true,
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="p-8">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  {service.external ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-colors duration-200"
                    >
                      Selengkapnya
                      <svg
                        className="w-5 h-5 ml-2"
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
                      to={service.link}
                      className="inline-flex items-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-colors duration-200"
                    >
                      Selengkapnya
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#105091] to-[#0a3b6d] py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Bergabunglah dengan Kami
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Mari bersama-sama memajukan penelitian dan pengabdian masyarakat untuk Indonesia yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontak"
              className="bg-white text-[#105091] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Hubungi Kami
            </Link>
            <Link
              to="/berita"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#105091] transition-all duration-300 transform hover:scale-105"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;