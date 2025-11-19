import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHandsHelping,
  FaDatabase,
  FaBook,
  FaInfoCircle,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTag,
  FaNewspaper,
  FaChartBar,
  FaChartLine,
  FaUsers,
  FaProjectDiagram,
  FaTrophy,
  FaUniversity,
} from "react-icons/fa";
import { useState, useEffect } from "react";

// Types for News API
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  author: string;
  published_at: string;
  slug: string;
  read_time?: number;
  tags?: string[];
}

const Homepage = () => {
  // State for news data
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('/api/news/latest?limit=6'); // Laravel API endpoint

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNewsData(data.data || []); // Adjust based on your API response structure
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Using fallback data.');

        // Fallback mock data for development
        setNewsData([
          {
            id: 1,
            title: "Pengumuman Hibah Penelitian 2024",
            excerpt: "LPPM Universitas Lampung membuka pendaftaran hibah penelitian untuk tahun akademik 2024/2025.",
            content: "",
            category: "Pengumuman",
            author: "Admin LPPM",
            published_at: "2024-11-15T10:00:00Z",
            slug: "pengumuman-hibah-penelitian-2024",
            read_time: 5,
            tags: ["Penelitian", "Hibah", "2024"]
          },
          {
            id: 2,
            title: "Workshop Penulisan Proposal Pengabdian",
            excerpt: "Ikuti workshop intensif penulisan proposal pengabdian kepada masyarakat yang akan diselenggarakan bulan depan.",
            content: "",
            category: "Workshop",
            author: "Tim Pengabdian",
            published_at: "2024-11-14T14:30:00Z",
            slug: "workshop-penulisan-proposal-pengabdian",
            read_time: 3,
            tags: ["Workshop", "Pengabdian", "Proposal"]
          },
          {
            id: 3,
            title: "Seminar Nasional Hasil Penelitian",
            excerpt: "Pendaftaran seminar nasional hasil penelitian telah dibuka. Segera daftarkan penelitian terbaik Anda.",
            content: "",
            category: "Seminar",
            author: "Panitia Seminar",
            published_at: "2024-11-13T09:15:00Z",
            slug: "seminar-nasional-hasil-penelitian",
            read_time: 4,
            tags: ["Seminar", "Penelitian", "Nasional"]
          },
          {
            id: 4,
            title: "Kerjasama Internasional dengan University of Tokyo",
            excerpt: "Universitas Lampung menjalin kerjasama penelitian dengan University of Tokyo untuk riset terbarukan.",
            content: "",
            category: "Kerjasama",
            author: "Tim Kerjasama",
            published_at: "2024-11-12T16:45:00Z",
            slug: "kerjasama-internasional-university-tokyo",
            read_time: 6,
            tags: ["Kerjasama", "Internasional", "Tokyo"]
          },
          {
            id: 5,
            title: "Publikasi Scopus Q1 Dosen Unila",
            excerpt: "Pencapaian gemilang dosen Unila dengan publikasi internasional di jurnal Q1 Scopus.",
            content: "",
            category: "Prestasi",
            author: "Admin LPPM",
            published_at: "2024-11-11T11:20:00Z",
            slug: "publikasi-scopus-q1-dosen-unila",
            read_time: 4,
            tags: ["Publikasi", "Scopus", "Prestasi"]
          },
          {
            id: 6,
            title: "Call for Paper Jurnal LPPM",
            excerpt: "Jurnal LPPM Universitas Lampung membuka call for paper untuk edisi terbaru tahun 2024.",
            content: "",
            category: "Jurnal",
            author: "Editor Jurnal",
            published_at: "2024-11-10T13:00:00Z",
            slug: "call-for-paper-jurnal-lppm",
            read_time: 3,
            tags: ["Jurnal", "Call for Paper", "Publikasi"]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate reading time
  const getReadingTime = (content: string, readTime?: number) => {
    if (readTime) return readTime;
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Pengumuman': 'from-blue-500 to-blue-600',
      'Workshop': 'from-purple-500 to-purple-600',
      'Seminar': 'from-green-500 to-green-600',
      'Kerjasama': 'from-orange-500 to-orange-600',
      'Prestasi': 'from-yellow-500 to-yellow-600',
      'Jurnal': 'from-red-500 to-red-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

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
                Mendukung pengembangan penelitian dan pengabdian masyarakat yang
                inovatif serta berkelanjutan untuk kemajuan bangsa.
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
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23f0f9ff' width='800' height='400'/%3E%3Ctext fill='%23105091' font-family='Arial' font-size='24' text-anchor='middle' x='400' y='200'%3ELPPM Unila Hero Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Layanan Section - Enhanced with Custom Icons */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23105091' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-blue-600 bg-clip-text text-transparent mb-6">
              PORTAL LAYANAN
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              LPPM Universitas Lampung Menyediakan Berbagai Layanan Untuk
              Mendukung Kegiatan Penelitian, Pengabdian Kepada Masyarakat, Serta
              Akses Informasi Dan Publikasi Ilmiah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                title: "Penelitian",
                icon: "/icons/penelitian.png",
                color: "from-blue-500 to-blue-600",
                description: "Kelola dan ajukan proposal penelitian",
                link: "/penelitian",
                gradient: "from-blue-500/10 to-blue-600/10",
                borderColor: "border-blue-200"
              },
              {
                title: "Pengabdian",
                icon: "/icons/pengabdian.png",
                color: "from-emerald-500 to-emerald-600",
                description: "Program pengabdian kepada masyarakat",
                link: "/pengabdian",
                gradient: "from-emerald-500/10 to-emerald-600/10",
                borderColor: "border-emerald-200"
              },
              {
                title: "Repository",
                icon: "/icons/repository.png",
                color: "from-purple-500 to-purple-600",
                description: "Koleksi karya ilmiah universitas",
                link: "https://repository.lppm.unila.ac.id",
                external: true,
                gradient: "from-purple-500/10 to-purple-600/10",
                borderColor: "border-purple-200"
              },
              {
                title: "Journal",
                icon: "/icons/journal.png",
                color: "from-orange-500 to-orange-600",
                description: "Jurnal ilmiah dan publikasi",
                link: "https://journal.lppm.unila.ac.id",
                external: true,
                gradient: "from-orange-500/10 to-orange-600/10",
                borderColor: "border-orange-200"
              },
              {
                title: "PPID",
                icon: "/icons/ppid.png",
                color: "from-red-500 to-red-600",
                description: "Informasi publik dan transparansi",
                link: "https://ppid.lppm.unila.ac.id",
                external: true,
                gradient: "from-red-500/10 to-red-600/10",
                borderColor: "border-red-200"
              },
            ].map((portal, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border-2 ${portal.borderColor} ${portal.gradient} backdrop-blur-sm`}
              >
                {/* Top Gradient Bar */}
                <div className={`h-1 bg-gradient-to-r ${portal.color}`}></div>

                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${portal.color} p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                        <img
                          src={portal.icon}
                          alt={portal.title}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            // Fallback to emoji if image fails
                            const fallbackEmojis = {
                              "Penelitian": "🔬",
                              "Pengabdian": "🤝",
                              "Repository": "📚",
                              "Journal": "📖",
                              "PPID": "📋"
                            };
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-2xl">${fallbackEmojis[portal.title as keyof typeof fallbackEmojis] || '📁'}</span>`;
                            }
                          }}
                        />
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${portal.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#105091]">
                    {portal.title}
                  </h3>
                  <p className="font-body text-sm text-gray-600 mb-6 leading-relaxed">
                    {portal.description}
                  </p>

                  {/* Button */}
                  {portal.external ? (
                    <a
                      href={portal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r ${portal.color} text-white font-semibold text-sm hover:shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1`}
                    >
                      Akses Portal
                      <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      to={portal.link}
                      className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r ${portal.color} text-white font-semibold text-sm hover:shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1`}
                    >
                      Akses Portal
                      <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link
              to="/layanan"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#105091] via-blue-600 to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border border-white/20"
            >
              <span>Lihat Semua Layanan</span>
              <svg className="w-6 h-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

        {/* Enhanced News Section - API Ready */}
      <section className="relative bg-gradient-to-br from-gray-50 to-slate-100 py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <FaNewspaper className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-indigo-600 bg-clip-text text-transparent mb-6">
              Berita & Pengumuman
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Informasi terkini mengenai kegiatan penelitian dan pengabdian masyarakat
              serta pengumuman penting dari LPPM Universitas Lampung.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FaNewspaper className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          {/* News Grid */}
          {!isLoading && !error && newsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsData.map((news, index) => (
                <article
                  key={news.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    {news.image ? (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23105091' width='400' height='200'/%3E%3Ctext fill='white' font-family='Arial' font-size='18' text-anchor='middle' x='200' y='100'%3E${encodeURIComponent(news.title)}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    ) : (
                      <div className={`h-full bg-gradient-to-br ${getCategoryColor(news.category)} flex items-center justify-center`}>
                        <FaNewspaper className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(news.category)} shadow-lg`}>
                        <FaTag className="w-3 h-3 mr-1" />
                        {news.category}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        {formatDate(news.published_at)}
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <span className="flex items-center">
                        <FaUser className="w-4 h-4 mr-1" />
                        {news.author}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="w-4 h-4 mr-1" />
                        {getReadingTime(news.content, news.read_time)} min read
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#105091] transition-colors duration-300">
                      {news.title}
                    </h3>

                    <p className="font-body text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>

                    {/* Tags */}
                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {news.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More Button */}
                    <Link
                      to={`/berita/${news.slug}`}
                      className="inline-flex items-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-all duration-200 group"
                    >
                      <span>Baca Selengkapnya</span>
                      <FaArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && newsData.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <FaNewspaper className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Berita</h3>
              <p className="text-gray-500">Belum ada berita atau pengumuman yang tersedia saat ini.</p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/berita"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#105091] via-indigo-600 to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border border-white/20"
            >
              <span>Lihat Semua Berita</span>
              <FaArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Infografis Statistik Data Section */}
      <section className="relative bg-gradient-to-br from-[#105091] via-blue-900 to-indigo-900 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 border border-white/20">
              <FaChartBar className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6">
              Infografis Statistik
            </h2>
            <p className="font-body text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Data dan statistik terkini kegiatan penelitian, pengabdian masyarakat,
              serta capaian LPPM Universitas Lampung.
            </p>
          </div>

          {/* Main Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                title: "Penelitian",
                value: "1,247",
                subtitle: "Total Penelitian",
                icon: FaProjectDiagram,
                color: "from-emerald-400 to-emerald-600",
                trend: "+12.5%",
                description: "dari tahun lalu"
              },
              {
                title: "Pengabdian",
                value: "892",
                subtitle: "Program Pengabdian",
                icon: FaHandsHelping,
                color: "from-blue-400 to-blue-600",
                trend: "+18.3%",
                description: "dari tahun lalu"
              },
              {
                title: "Peneliti",
                value: "3,456",
                subtitle: "Peneliti Aktif",
                icon: FaUsers,
                color: "from-purple-400 to-purple-600",
                trend: "+8.7%",
                description: "dari tahun lalu"
              },
              {
                title: "Publikasi",
                value: "567",
                subtitle: "Publikasi Ilmiah",
                icon: FaTrophy,
                color: "from-orange-400 to-orange-600",
                trend: "+24.1%",
                description: "dari tahun lalu"
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Value */}
                  <div className="text-5xl font-bold text-white mb-2 font-display">
                    {stat.value}
                  </div>

                  {/* Subtitle */}
                  <div className="text-blue-100 font-medium mb-4">
                    {stat.subtitle}
                  </div>

                  {/* Title */}
                  <div className="text-white text-lg font-semibold mb-4">
                    {stat.title}
                  </div>

                  {/* Trend */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-emerald-300 font-semibold">
                      <FaChartLine className="w-4 h-4 mr-1" />
                      {stat.trend}
                    </span>
                    <span className="text-blue-200 text-sm">
                      {stat.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Statistics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Research Areas Chart */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20">
              <h3 className="font-display text-2xl font-bold text-white mb-8 flex items-center">
                <FaUniversity className="w-8 h-8 mr-3" />
                Bidang Penelitian
              </h3>

              <div className="space-y-6">
                {[
                  { area: "Sains & Teknologi", percentage: 85, color: "from-emerald-400 to-emerald-600" },
                  { area: "Sosial & Humaniora", percentage: 72, color: "from-blue-400 to-blue-600" },
                  { area: "Kesehatan", percentage: 68, color: "from-purple-400 to-purple-600" },
                  { area: "Pertanian", percentage: 61, color: "from-orange-400 to-orange-600" },
                  { area: "Ekonomi & Bisnis", percentage: 54, color: "from-pink-400 to-pink-600" }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{item.area}</span>
                      <span className="text-blue-200 font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${item.percentage}%`,
                          animationDelay: `${index * 200}ms`,
                          animation: 'slideInWidth 1s ease-out forwards'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Cards */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-bold text-white mb-8 flex items-center">
                <FaTrophy className="w-8 h-8 mr-3" />
                Prestasi & Penghargaan
              </h3>

              {[
                {
                  title: "Universitas Terbaik",
                  description: "Peringkat 5 Nasional dalam Publikasi Ilmiah 2024",
                  icon: "🏆",
                  color: "from-yellow-400 to-yellow-600"
                },
                {
                  title: "Inovasi Terbaik",
                  description: "12 Paten berhasil didaftarkan tahun 2024",
                  icon: "💡",
                  color: "from-purple-400 to-purple-600"
                },
                {
                  title: "Kerjasama Internasional",
                  description: "25+ Mitra Universitas dari 15 Negara",
                  icon: "🌍",
                  color: "from-blue-400 to-blue-600"
                },
                {
                  title: "Pengabdian Berdampak",
                  description: "50+ Program Kemitraan dengan Industri",
                  icon: "🤝",
                  color: "from-emerald-400 to-emerald-600"
                }
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:translate-x-2"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${achievement.color} rounded-2xl shadow-lg`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-1 group-hover:text-yellow-300 transition-colors duration-300">
                        {achievement.title}
                      </h4>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <Link
              to="/statistik"
              className="inline-flex items-center px-10 py-5 bg-white text-[#105091] font-bold text-xl rounded-3xl shadow-2xl hover:bg-blue-50 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm border border-white/30"
            >
              <span>Lihat Statistik Lengkap</span>
              <FaArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
