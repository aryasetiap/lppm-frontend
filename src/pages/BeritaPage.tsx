import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaTag,
  FaUser,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

// Types for News API
interface NewsItem {
  id: number;
  title: string;
  slug: string;
  date: string;
  category: string;
  thumbnail?: string;
  excerpt: string;
  content?: string;
  image?: string;
  author?: string;
  published_at?: string;
  read_time?: number;
  tags?: string[];
}

interface PaginationData {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

const BeritaPage = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch news data with pagination and filters
  useEffect(() => {
    const fetchNews = async (page: number = 1) => {
      try {
        setIsLoading(true);
        let url = `http://127.0.0.1:8000/api/posts?page=${page}&limit=12`;

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setNewsData(data.data || []);
        setPagination(data.pagination || null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Gagal memuat berita. Silakan coba lagi nanti.");

        // Fallback mock data
        setNewsData([
          {
            id: 1,
            title: "Pengumuman Hibah Penelitian 2024",
            slug: "pengumuman-hibah-penelitian-2024",
            date: "15 Nov 2024",
            category: "Pengumuman",
            excerpt: "LPPM Universitas Lampung membuka pendaftaran hibah penelitian untuk tahun akademik 2024/2025.",
            thumbnail: undefined,
          },
          {
            id: 2,
            title: "Workshop Penulisan Proposal Pengabdian",
            slug: "workshop-penulisan-proposal-pengabdian",
            date: "14 Nov 2024",
            category: "Workshop",
            excerpt: "Ikuti workshop intensif penulisan proposal pengabdian kepada masyarakat yang akan diselenggarakan bulan depan.",
            thumbnail: undefined,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [searchTerm, selectedCategory]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.last_page) {
      // This will trigger the useEffect to fetch new data
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Format date utility
  const formatDate = (dateString: string) => {
    // If date is already formatted like "05 Nov 2025", return as-is
    if (dateString.includes(' ')) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Pengumuman: "from-blue-500 to-blue-600",
      Workshop: "from-purple-500 to-purple-600",
      Seminar: "from-green-500 to-green-600",
      Kerjasama: "from-orange-500 to-orange-600",
      Prestasi: "from-yellow-500 to-yellow-600",
      Jurnal: "from-red-500 to-red-600",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  // Extract unique categories for filter
  const categories = [...new Set(newsData.map(news => news.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#105091] via-blue-900 to-indigo-900 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 border border-white/20">
            <FaNewspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6">
            Berita &amp; Pengumuman
          </h1>
          <p className="font-body text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Informasi terkini mengenai kegiatan penelitian dan pengabdian
            masyarakat serta pengumuman penting dari LPPM Universitas Lampung.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="relative bg-white py-8 border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#105091] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#105091] focus:border-transparent bg-white"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          {/* Results Info */}
          {!isLoading && !error && pagination && (
            <div className="mb-8 text-gray-600">
              Menampilkan {newsData.length} dari {pagination.total} berita
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
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
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <FaNewspaper className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Gagal Memuat Berita
              </h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-[#105091] text-white font-semibold rounded-xl hover:bg-[#0a3b6d] transition-colors duration-200"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* News Grid */}
          {!isLoading && !error && newsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {newsData.map((news) => (
                <article
                  key={news.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    {news.thumbnail ? (
                      <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = `h-full bg-gradient-to-br ${getCategoryColor(news.category)} flex items-center justify-center`;
                            fallbackDiv.innerHTML = `<svg class="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" /><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" /></svg>`;
                            parent.appendChild(fallbackDiv);
                          }
                        }}
                      />
                    ) : (
                      <div
                        className={`h-full bg-gradient-to-br ${getCategoryColor(
                          news.category
                        )} flex items-center justify-center`}
                      >
                        <FaNewspaper className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(
                          news.category
                        )} shadow-lg`}
                      >
                        <FaTag className="w-3 h-3 mr-1" />
                        {news.category}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        {formatDate(news.date)}
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {news.author && (
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <FaUser className="w-4 h-4 mr-1" />
                          {news.author}
                        </span>
                      </div>
                    )}

                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#105091] transition-colors duration-300">
                      {news.title}
                    </h3>

                    <p className="font-body text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>

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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tidak Ada Berita Ditemukan
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory
                  ? "Tidak ada berita yang sesuai dengan kriteria pencarian Anda."
                  : "Belum ada berita atau pengumuman yang tersedia saat ini."}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                  className="inline-flex items-center px-6 py-3 bg-[#105091] text-white font-semibold rounded-xl hover:bg-[#0a3b6d] transition-colors duration-200"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && pagination && pagination.last_page > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  pagination.current_page <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#105091] hover:text-[#105091]"
                }`}
              >
                <FaChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                const pageNumber = i + 1;
                const isActive = pageNumber === pagination.current_page;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-[#105091] text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#105091] hover:text-[#105091]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  pagination.current_page >= pagination.last_page
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#105091] hover:text-[#105091]"
                }`}
              >
                Next
                <FaChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BeritaPage;