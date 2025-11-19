import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaTag,
  FaUser,
  FaArrowLeft,
  FaShare,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Types for News API
interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  date: string;
  category: string;
  image?: string;
  content: string;
  author?: string;
  published_at?: string;
}

const BeritaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news detail by slug (will need to find by slug from API)
  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!slug) {
        setError("Slug berita tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // First, try to find the news by slug from the list endpoint
        const listResponse = await fetch(`http://127.0.0.1:8000/api/posts?search=${encodeURIComponent(slug)}`);

        if (!listResponse.ok) {
          throw new Error("Failed to fetch news");
        }

        const listData = await listResponse.json();
        const newsItem = listData.data?.find((item: any) => item.slug === slug);

        if (!newsItem) {
          throw new Error("Berita tidak ditemukan");
        }

        // Then fetch the full details using the ID
        const detailResponse = await fetch(`http://127.0.0.1:8000/api/posts/${newsItem.id}`);

        if (!detailResponse.ok) {
          throw new Error("Failed to fetch news details");
        }

        const detailData = await detailResponse.json();
        setNewsData(detailData.data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Gagal memuat detail berita. Berita mungkin tidak ditemukan atau telah dihapus.");

        // Fallback mock data for development
        if (slug === "pengumuman-hibah-penelitian-2024") {
          setNewsData({
            id: 1,
            title: "Pengumuman Hibah Penelitian 2024",
            slug: "pengumuman-hibah-penelitian-2024",
            date: "15 November 2024",
            category: "Pengumuman",
            content: `
              <p><strong>Bandar Lampung</strong> - LPPM Universitas Lampung dengan bangga mengumumkan pembukaan pendaftaran hibah penelitian untuk tahun akademik 2024/2025. Program ini bertujuan untuk mendorong peningkatan kualitas dan kuantitas penelitian di lingkungan Universitas Lampung.</p>

              <h3>Persyaratan Umum</h3>
              <ul>
                <li>Dosen tetap Universitas Lampung</li>
                <li>Memiliki NIDN yang aktif</li>
                <li>Tidak sedang dalam masa cuti atau tugas belajar</li>
                <li>Menyerahkan proposal penelitian yang sesuai dengan tema prioritas</li>
              </ul>

              <h3>Tema Prioritas Penelitian</h3>
              <ol>
                <li>Energi Terbarukan dan Konservasi Energi</li>
                <li>Ketahanan Pangan dan Pertanian Modern</li>
                <li>Kesehatan dan Obat Herbal</li>
                <li>Teknologi Informasi dan Transformasi Digital</li>
                <li>Lingkungan dan Perubahan Iklim</li>
              </ol>

              <h3>Jadwal Penting</h3>
              <ul>
                <li><strong>Pengumuman Pembukaan:</strong> 15 November 2024</li>
                <li><strong>Batas Pendaftaran:</strong> 31 Desember 2024</li>
                <li><strong>Evaluasi Proposal:</strong> 1-15 Januari 2025</li>
                <li><strong>Pengumuman Lolos Seleksi:</strong> 20 Januari 2025</li>
              </ul>

              <p>Untuk informasi lebih lanjut, silakan hubungi Sekretariat LPPM Universitas Lampung atau kunjungi website resmi kami.</p>
            `,
            author: "Admin LPPM",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [slug]);

  // Format date utility
  const formatDate = (dateString: string) => {
    // If date is already formatted like "Wednesday, 05 November 2025", return as-is
    if (dateString.includes(',')) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && newsData) {
      try {
        await navigator.share({
          title: newsData.title,
          text: `${newsData.title} - LPPM Universitas Lampung`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berita disalin ke clipboard!");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="animate-pulse">
          {/* Hero Placeholder */}
          <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaNewspaper className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Berita Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "Berita yang Anda cari tidak ditemukan atau telah dihapus."}
          </p>
          <div className="space-y-4">
            <Link
              to="/berita"
              className="inline-flex items-center px-6 py-3 bg-[#105091] text-white font-semibold rounded-xl hover:bg-[#0a3b6d] transition-colors duration-200"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Berita
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="block mx-auto text-[#105091] hover:text-[#0a3b6d] font-medium"
            >
              Kembali ke Halaman Sebelumnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get category color
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Hero Image Section */}
      {newsData.image && (
        <div className="relative h-64 lg:h-96 overflow-hidden">
          <img
            src={newsData.image}
            alt={newsData.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.className = "relative h-64 lg:h-96 overflow-hidden bg-gradient-to-br from-[#105091] to-blue-900";
                parent.innerHTML = `
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                      <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-gray-500 hover:text-[#105091] transition-colors duration-200"
            >
              Beranda
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/berita"
              className="text-gray-500 hover:text-[#105091] transition-colors duration-200"
            >
              Berita
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {newsData.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          {/* Article Header */}
          <header className="mb-10">
            {/* Category and Share */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(
                    newsData.category
                  )} shadow-lg`}
                >
                  <FaTag className="w-3 h-3 mr-2" />
                  {newsData.category}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#105091] transition-colors duration-200"
                title="Bagikan berita"
              >
                <FaShare className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Bagikan</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {newsData.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              {newsData.author && (
                <div className="flex items-center">
                  <FaUser className="w-4 h-4 mr-2" />
                  <span>{newsData.author}</span>
                </div>
              )}

              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 mr-2" />
                <span>{formatDate(newsData.date)}</span>
              </div>

              <div className="flex items-center">
                <FaClock className="w-4 h-4 mr-2" />
                <span>5 menit baca</span>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div
              className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsData.content }}
              style={{
                // Custom styles for HTML content
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: '#1f2937',
                  fontWeight: 'bold',
                  marginTop: '2rem',
                  marginBottom: '1rem',
                },
                '& h1': { fontSize: '2rem' },
                '& h2': { fontSize: '1.75rem' },
                '& h3': { fontSize: '1.5rem' },
                '& p': {
                  marginBottom: '1rem',
                  lineHeight: '1.75',
                },
                '& ul, & ol': {
                  paddingLeft: '1.5rem',
                  marginBottom: '1rem',
                },
                '& ul': {
                  listStyleType: 'disc',
                },
                '& ol': {
                  listStyleType: 'decimal',
                },
                '& li': {
                  marginBottom: '0.5rem',
                  paddingLeft: '0.5rem',
                },
                '& strong, & b': {
                  fontWeight: 'bold',
                  color: '#1f2937',
                },
                '& a': {
                  color: '#105091',
                  textDecoration: 'underline',
                  fontWeight: '500',
                },
                '& a:hover': {
                  color: '#0a3b6d',
                },
                '& blockquote': {
                  borderLeft: '4px solid #105091',
                  paddingLeft: '1rem',
                  fontStyle: 'italic',
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                },
              }}
            />
          </div>

          {/* Back to List */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              to="/berita"
              className="inline-flex items-center px-6 py-3 bg-[#105091] text-white font-semibold rounded-xl hover:bg-[#0a3b6d] transition-colors duration-200 shadow-lg"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Berita
            </Link>
          </div>
        </div>
      </article>

      {/* Related News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">
            Berita Terkait
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Fitur berita terkait akan segera hadir
            </p>
            <Link
              to="/berita"
              className="inline-flex items-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-colors duration-200"
            >
              Lihat Semua Berita
              <FaExternalLinkAlt className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeritaDetailPage;