import { Link } from "react-router-dom";
import {
  FaHandsHelping,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTag,
  FaNewspaper,
  FaChartBar,
  FaChartLine,
  FaProjectDiagram,
  FaTrophy,
  FaRocket,
  FaLightbulb,
  FaGlobe,
  FaAward,
} from "react-icons/fa";
import { useState, useEffect } from "react";

// Add custom styles for animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInWidth {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: var(--final-width);
      opacity: 1;
    }
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

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

// Types for Statistics Data
interface StatisticsData {
  metadata: {
    last_updated: string;
    data_source: string;
    description: string;
  };
  yearly_data: {
    year: number;
    penelitian_blu: number;
    pengabdian_blu: number;
    paten: number;
    haki: number;
    pengabdian_breakdown?: {
      [key: string]: number;
    };
  }[];
  total_summary: {
    total_penelitian_blu: number;
    total_pengabdian_blu: number;
    total_paten: number;
    total_haki: number;
    growth_penelitian: number;
    growth_pengabdian: number;
    growth_paten: number;
    growth_haki: number;
  };
  quarterly_data: {
    quarter: string;
    penelitian_blu: number;
    pengabdian_blu: number;
  }[];
}

const Homepage = () => {
  // Inject custom styles
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // State for news data
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for statistics data
  const [statsData, setStatsData] = useState<StatisticsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch statistics data from JSON
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);
        // Fetch from local JSON file
        const response = await fetch(`${import.meta.env.BASE_URL}data/statistics.json`);

        if (!response.ok) {
          throw new Error("Failed to fetch statistics data");
        }

        const data = await response.json();
        setStatsData(data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setStatsError("Failed to load statistics data.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        // Using the Laravel API endpoint from integration docs
        const apiBase = (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
          (window.location.hostname === "lppm.unila.ac.id" || window.location.hostname.includes("unila.ac.id")
            ? "https://lppm.unila.ac.id/api"
            : "http://localhost:8000/api");
        const response = await fetch(`${apiBase}/posts?limit=6`);

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setNewsData(data.data || []); // API returns {status: "success", data: [...]}
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Gagal memuat berita. Menggunakan data fallback.");

        // Fallback mock data for development
        setNewsData([
          {
            id: 1,
            title: "Pengumuman Hibah Penelitian 2024",
            slug: "pengumuman-hibah-penelitian-2024",
            date: "15 Nov 2024",
            category: "Pengumuman",
            excerpt:
              "LPPM Universitas Lampung membuka pendaftaran hibah penelitian untuk tahun akademik 2024/2025.",
            thumbnail: undefined,
          },
          {
            id: 2,
            title: "Workshop Penulisan Proposal Pengabdian",
            slug: "workshop-penulisan-proposal-pengabdian",
            date: "14 Nov 2024",
            category: "Workshop",
            excerpt:
              "Ikuti workshop intensif penulisan proposal pengabdian kepada masyarakat yang akan diselenggarakan bulan depan.",
            thumbnail: undefined,
          },
          {
            id: 3,
            title: "Seminar Nasional Hasil Penelitian",
            slug: "seminar-nasional-hasil-penelitian",
            date: "13 Nov 2024",
            category: "Seminar",
            excerpt:
              "Pendaftaran seminar nasional hasil penelitian telah dibuka. Segera daftarkan penelitian terbaik Anda.",
            thumbnail: undefined,
          },
          {
            id: 4,
            title: "Kerjasama Internasional dengan University of Tokyo",
            slug: "kerjasama-internasional-university-tokyo",
            date: "12 Nov 2024",
            category: "Kerjasama",
            excerpt:
              "Universitas Lampung menjalin kerjasama penelitian dengan University of Tokyo untuk riset terbarukan.",
            thumbnail: undefined,
          },
          {
            id: 5,
            title: "Publikasi Scopus Q1 Dosen Unila",
            slug: "publikasi-scopus-q1-dosen-unila",
            date: "11 Nov 2024",
            category: "Prestasi",
            excerpt:
              "Pencapaian gemilang dosen Unila dengan publikasi internasional di jurnal Q1 Scopus.",
            thumbnail: undefined,
          },
          {
            id: 6,
            title: "Call for Paper Jurnal LPPM",
            slug: "call-for-paper-jurnal-lppm",
            date: "10 Nov 2024",
            category: "Jurnal",
            excerpt:
              "Jurnal LPPM Universitas Lampung membuka call for paper untuk edisi terbaru tahun 2024.",
            thumbnail: undefined,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const yearsCount = statsData?.yearly_data.length ?? 0;
  const safeYearsCount = yearsCount > 0 ? yearsCount : 1;
  const yearsRangeLabel =
    yearsCount > 0 ? `${yearsCount} Tahun Terakhir` : "Periode Terbaru";
  const chartMaxValue =
    statsData && statsData.yearly_data.length > 0
      ? Math.max(
        ...statsData.yearly_data.map((d) =>
          Math.max(d.penelitian_blu, d.pengabdian_blu)
        )
      )
      : 0;

  // Format date utility - handle both API formats
  const formatDate = (dateString: string) => {
    // If date is already formatted like "05 Nov 2025", return as-is
    if (dateString.includes(' ')) {
      return dateString;
    }

    // Try to parse ISO date format
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
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

  // Calculate reading time
  const getReadingTime = (content?: string, readTime?: number) => {
    if (readTime) return readTime;
    if (!content) return 3; // Default reading time for news without content
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatTrend = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

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

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section - Modern UI/UX with Hero Image */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#105091] via-blue-900 to-indigo-900 text-white overflow-hidden pt-20 md:pt-24">
        {/* Animated Background Elements */}
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

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 text-blue-300/20 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "6s" }}
          >
            <FaRocket className="w-8 h-8" />
          </div>
          <div
            className="absolute top-40 right-20 text-indigo-300/20 animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "6s" }}
          >
            <FaLightbulb className="w-6 h-6" />
          </div>
          <div
            className="absolute bottom-40 left-20 text-purple-300/20 animate-bounce"
            style={{ animationDelay: "4s", animationDuration: "6s" }}
          >
            <FaGlobe className="w-10 h-10" />
          </div>
          <div
            className="absolute bottom-20 right-1/3 text-blue-300/20 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "6s" }}
          >
            <FaAward className="w-8 h-8" />
          </div>
        </div>

        <div className="relative min-h-[calc(100vh-5rem)] max-w-screen-2xl mx-auto px-4 sm:px-8 flex items-center py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Logo/Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl"></div>
              </div>

              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                    LPPM
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                    Universitas Lampung
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <p className="font-display text-xl lg:text-2xl font-light text-blue-100">
                  Lembaga Penelitian dan Pengabdian kepada Masyarakat
                </p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="font-body text-base lg:text-lg text-blue-50/90 leading-relaxed max-w-2xl">
                  Mendukung pengembangan penelitian dan pengabdian masyarakat
                  yang inovatif serta berkelanjutan untuk kemajuan bangsa
                  melalui riset berkualitas dan pemberdayaan komunitas.
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: FaRocket, text: "Inovasi Riset", delay: 0 },
                    {
                      icon: FaHandsHelping,
                      text: "Pengabdian Masyarakat",
                      delay: 100,
                    },
                    { icon: FaGlobe, text: "Kerjasama Global", delay: 200 },
                    { icon: FaAward, text: "Prestasi Unggul", delay: 300 },
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20"
                        style={{
                          animationDelay: `${feature.delay}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                        }}
                      >
                        <IconComponent className="w-4 h-4 text-blue-200" />
                        <span className="text-xs font-medium text-white/90">
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {/* Main Visual Card with Hero Image */}
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 transform group-hover:scale-105"></div>

                {/* Glass Card Frame */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-2 border border-white/20 transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Hero Image */}
                    <img
                      src={`${import.meta.env.BASE_URL}hero-image.jpg`}
                      alt="LPPM Universitas Lampung"
                      className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to gradient background if image fails
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="h-80 lg:h-96 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
                              <div class="text-center space-y-4">
                                <div class="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30">
                                  <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                  </svg>
                                </div>
                                <div class="space-y-2">
                                  <h3 class="font-display text-2xl font-bold text-white">
                                    Menuju Inovasi
                                  </h3>
                                  <p class="text-blue-100 max-w-xs mx-auto px-4">
                                    Wujudkan riset berkualitas dan pengabdian berdampak
                                  </p>
                                </div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />

                    {/* Overlay Gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse backdrop-blur-sm border border-white/20">
                      2025
                    </div>
                  </div>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                    {[
                      { value: "825+", label: "Penelitian" },
                      { value: "342+", label: "Pengabdian" },
                      { value: "91", label: "HKI/Paten" },
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-blue-200">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Layanan Section - Enhanced with Custom Icons */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23105091' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
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
                icon: `${import.meta.env.BASE_URL}icons/penelitian.png`,
                color: "from-blue-500 to-blue-600",
                description: "Kelola dan ajukan proposal penelitian",
                link: "/penelitian",
                gradient: "from-blue-500/10 to-blue-600/10",
                borderColor: "border-blue-200",
              },
              {
                title: "Pengabdian",
                icon: `${import.meta.env.BASE_URL}icons/pengabdian.png`,
                color: "from-emerald-500 to-emerald-600",
                description: "Program pengabdian kepada masyarakat",
                link: "/pengabdian",
                gradient: "from-emerald-500/10 to-emerald-600/10",
                borderColor: "border-emerald-200",
              },
              {
                title: "Repository",
                icon: `${import.meta.env.BASE_URL}icons/repository.png`,
                color: "from-purple-500 to-purple-600",
                description: "Koleksi karya ilmiah universitas",
                link: "https://repository.lppm.unila.ac.id",
                external: true,
                gradient: "from-purple-500/10 to-purple-600/10",
                borderColor: "border-purple-200",
              },
              {
                title: "Journal",
                icon: `${import.meta.env.BASE_URL}icons/journal.png`,
                color: "from-orange-500 to-orange-600",
                description: "Jurnal ilmiah dan publikasi",
                link: "https://journal.lppm.unila.ac.id",
                external: true,
                gradient: "from-orange-500/10 to-orange-600/10",
                borderColor: "border-orange-200",
              },
              {
                title: "PPID",
                icon: `${import.meta.env.BASE_URL}icons/ppid.png`,
                color: "from-red-500 to-red-600",
                description: "Informasi publik dan transparansi",
                link: "https://ppid.lppm.unila.ac.id",
                external: true,
                gradient: "from-red-500/10 to-red-600/10",
                borderColor: "border-red-200",
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
                    <div
                      className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${portal.color} p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                        <img
                          src={portal.icon}
                          alt={portal.title}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            // Fallback to emoji if image fails
                            const fallbackEmojis = {
                              Penelitian: "🔬",
                              Pengabdian: "🤝",
                              Repository: "📚",
                              Journal: "📖",
                              PPID: "📋",
                            };
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-2xl">${fallbackEmojis[
                                portal.title as keyof typeof fallbackEmojis
                              ] || "📁"
                                }</span>`;
                            }
                          }}
                        />
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${portal.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                    ></div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#105091]">
                    {portal.title}
                  </h3>
                  <p className="font-body text-sm text-gray-600 mb-6 leading-relaxed">
                    {portal.description}
                  </p>

                  {/* Button */}
                  {/* {portal.external ? (
                    <a
                      href={portal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r ${portal.color} text-white font-semibold text-sm hover:shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1`}
                    >
                      Akses Portal
                      <svg
                        className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      to={portal.link}
                      className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-gradient-to-r ${portal.color} text-white font-semibold text-sm hover:shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1`}
                    >
                      Akses Portal
                      <svg
                        className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  )} */}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          {/* <div className="text-center mt-16">
            <Link
              to="/layanan"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#105091] via-blue-600 to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border border-white/20"
            >
              <span>Lihat Semua Layanan</span>
              <svg
                className="w-6 h-6 ml-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div> */}
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
              Informasi terkini mengenai kegiatan penelitian dan pengabdian
              masyarakat serta pengumuman penting dari LPPM Universitas Lampung.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
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
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 overflow-hidden border border-white/50 hover:border-[#105091]/20"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.8s ease-out forwards",
                    opacity: 0
                  }}
                >
                  {/* Gradient Border Top */}
                  <div className={`h-1 bg-gradient-to-r ${getCategoryColor(news.category)} opacity-80`}></div>

                  {/* Image Section with Modern Design */}
                  <div className="relative h-56 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23105091' fill-opacity='0.3'%3E%3Cpath d='M10 10c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm4 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      ></div>
                    </div>

                    {news.thumbnail ? (
                      <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        onError={(e) => {
                          // Enhanced fallback to gradient if image fails
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = `h-full bg-gradient-to-br ${getCategoryColor(news.category)} flex items-center justify-center relative`;
                            fallbackDiv.innerHTML = `
                              <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                              <div class="relative z-10 text-center">
                                <svg class="w-20 h-20 text-white/70 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                                </svg>
                                <p class="text-white/80 text-sm font-medium">${news.category}</p>
                              </div>
                            `;
                            parent.appendChild(fallbackDiv);
                          }
                        }}
                      />
                    ) : (
                      <div
                        className={`h-full bg-gradient-to-br ${getCategoryColor(
                          news.category
                        )} flex items-center justify-center relative`}
                      >
                        {/* Overlay Pattern */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                        {/* Icon and Text */}
                        <div className="relative z-10 text-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                            <FaNewspaper className="w-10 h-10 text-white/80" />
                          </div>
                          <p className="text-white/90 text-sm font-semibold">{news.category}</p>
                        </div>
                      </div>
                    )}

                    {/* Modern Category Badge with Glass Effect */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="relative group/badge">
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(news.category)} blur-lg opacity-50 group-hover/badge:opacity-70 transition-opacity duration-300`}></div>

                        <span className={`relative inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(news.category)} shadow-lg backdrop-blur-sm border border-white/20`}>
                          <FaTag className="w-3 h-3 mr-1.5" />
                          {news.category}
                        </span>
                      </div>
                    </div>

                    {/* Modern Date Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="relative group/date">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-white/30 blur-lg opacity-50 group-hover/date:opacity-70 transition-opacity duration-300"></div>

                        <span className="relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-700 shadow-lg border border-white/50">
                          <FaCalendarAlt className="w-3 h-3 mr-1.5 text-[#105091]" />
                          {formatDate(news.date)}
                        </span>
                      </div>
                    </div>

                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                    {/* Floating Action Button on Hover */}
                    <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <Link
                        to={`/berita/${news.slug}`}
                        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${getCategoryColor(news.category)} rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-12`}
                      >
                        <FaArrowRight className="w-5 h-5 text-white" />
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Content Section */}
                  <div className="p-8 relative">
                    {/* Subtle Background Gradient */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#105091]/10 to-transparent"></div>

                    {news.author && (
                      <div className="flex items-center text-sm text-gray-600 mb-4 font-medium">
                        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <FaUser className="w-4 h-4 mr-2 text-[#105091]" />
                          <span>{news.author}</span>
                        </div>
                      </div>
                    )}

                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#105091] transition-colors duration-500 leading-tight">
                      {news.title}
                    </h3>

                    <p className="font-body text-gray-600 mb-6 leading-relaxed line-clamp-3 text-sm">
                      {news.excerpt}
                    </p>

                    {/* Enhanced Tags Section */}
                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {news.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full hover:from-[#105091]/10 hover:to-blue-50 hover:text-[#105091] transition-all duration-300 border border-gray-200 hover:border-[#105091]/30 cursor-default"
                          >
                            #{tag}
                          </span>
                        ))}
                        {news.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500">
                            +{news.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Enhanced Read More Button */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/berita/${news.slug}`}
                        className="group/btn inline-flex items-center text-[#105091] font-semibold hover:text-[#0a3b6d] transition-all duration-300"
                      >
                        <span className="text-sm font-bold">Baca Selengkapnya</span>
                        <div className="ml-2 flex items-center justify-center w-8 h-8 bg-[#105091]/10 rounded-full group-hover/btn:bg-[#105091]/20 transition-all duration-300">
                          <FaArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </div>
                      </Link>

                      {/* Reading Time */}
                      <div className="flex items-center text-xs text-gray-500">
                        <FaClock className="w-3 h-3 mr-1" />
                        {getReadingTime(news.content, news.read_time)} min
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Border */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getCategoryColor(news.category)} opacity-60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>
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
                Belum Ada Berita
              </h3>
              <p className="text-gray-500">
                Belum ada berita atau pengumuman yang tersedia saat ini.
              </p>
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

      {/* Enhanced Statistics Section - Charts with JSON Data */}
      <section className="relative bg-gradient-to-br from-[#105091] via-blue-900 to-indigo-900 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "4s" }}
          ></div>
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
              Data dan statistik terkini kegiatan penelitian BLU, pengabdian
              BLU, serta paten dan HKI LPPM Universitas Lampung dalam enam tahun
              terakhir (periode 2020-2025).
            </p>
            {statsData && (
              <p className="text-blue-200 text-sm mt-4">
                Terakhir diperbarui:{" "}
                {new Date(statsData.metadata.last_updated).toLocaleDateString(
                  "id-ID",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            )}
          </div>

          {/* Loading State */}
          {statsLoading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-6">
                <FaChartBar className="w-10 h-10 text-white animate-pulse" />
              </div>
              <p className="text-white text-xl">Memuat data statistik...</p>
            </div>
          )}

          {/* Error State */}
          {statsError && !statsLoading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-500/30 mb-6">
                <FaChartBar className="w-10 h-10 text-red-400" />
              </div>
              <p className="text-white text-xl mb-4">
                Gagal memuat data statistik
              </p>
              <p className="text-blue-200">{statsError}</p>
            </div>
          )}

          {/* Statistics Content */}
          {!statsLoading && !statsError && statsData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {[
                  {
                    title: "Total Penelitian BLU",
                    value:
                      statsData.total_summary.total_penelitian_blu.toLocaleString(
                        "id-ID"
                      ),
                    subtitle: yearsRangeLabel,
                    icon: FaProjectDiagram,
                    color: "from-emerald-400 to-emerald-600",
                    trend: formatTrend(
                      statsData.total_summary.growth_penelitian
                    ),
                  },
                  {
                    title: "Total Pengabdian BLU",
                    value:
                      statsData.total_summary.total_pengabdian_blu.toLocaleString(
                        "id-ID"
                      ),
                    subtitle: yearsRangeLabel,
                    icon: FaHandsHelping,
                    color: "from-blue-400 to-blue-600",
                    trend: formatTrend(
                      statsData.total_summary.growth_pengabdian
                    ),
                  },
                  {
                    title: "Total Paten",
                    value:
                      statsData.total_summary.total_paten.toLocaleString(
                        "id-ID"
                      ),
                    subtitle: yearsRangeLabel,
                    icon: FaTrophy,
                    color: "from-purple-400 to-purple-600",
                    trend: formatTrend(statsData.total_summary.growth_paten),
                  },
                  {
                    title: "Total HKI",
                    value:
                      statsData.total_summary.total_haki.toLocaleString(
                        "id-ID"
                      ),
                    subtitle: yearsRangeLabel,
                    icon: FaAward,
                    color: "from-orange-400 to-orange-600",
                    trend: formatTrend(statsData.total_summary.growth_haki),
                  },
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
                    >
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Value */}
                      <div className="text-4xl font-bold text-white mb-1 font-display">
                        {stat.value}
                      </div>

                      {/* Subtitle */}
                      <div className="text-blue-100 text-sm font-medium mb-3">
                        {stat.subtitle}
                      </div>

                      {/* Title */}
                      <div className="text-white text-base font-semibold mb-3">
                        {stat.title}
                      </div>

                      {/* Trend */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center text-emerald-300 font-semibold text-sm">
                          <FaChartLine className="w-3 h-3 mr-1" />
                          {stat.trend}
                        </span>
                        <span className="text-blue-200 text-xs">growth</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Statistics Charts - Modern Data Visualization */}
              <div className="space-y-12 mb-20">
                {/* Combined Line Chart for Trends */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl border border-white/20 mb-4">
                        <FaChartLine className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        Tren Kinerja{" "}
                        {yearsCount > 0 ? `${yearsCount} Tahun` : "Multitahun"}
                      </h3>
                      <p className="text-blue-200 text-sm mt-2">Perkembangan Penelitian, Pengabdian, dan HKI</p>
                    </div>
                  </div>

                  <div className="relative h-80 mb-8">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-white/5 rounded-lg">
                      {[0, 20, 40, 60, 80, 100].map((line, index) => (
                        <div
                          key={index}
                          className="absolute w-full border-t border-white/10"
                          style={{ bottom: `${line}%` }}
                        >
                          <span className="absolute -left-12 -top-2 text-xs text-blue-200 font-medium">
                            {Math.round(
                              ((chartMaxValue || 0) * (100 - line)) / 100
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Chart Container */}
                    <div className="relative h-full flex items-end justify-around px-4">
                      {statsData.yearly_data.map((yearData, index) => {
                        const maxValue = chartMaxValue || 1;
                        const penelitianHeight = (yearData.penelitian_blu / maxValue) * 240; // 240px is max height
                        const pengabdianHeight = (yearData.pengabdian_blu / maxValue) * 240;

                        return (
                          <div key={yearData.year} className="flex flex-col items-center flex-1 max-w-[80px]">
                            {/* Year Label */}
                            <div className="text-xs text-blue-200 font-semibold mb-3">
                              {yearData.year}
                            </div>

                            {/* Bars Container */}
                            <div className="relative h-56 w-full flex justify-center items-end gap-1">
                              {/* Penelitian Bar */}
                              <div
                                className="w-6 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-emerald-500 hover:to-emerald-300 group relative cursor-pointer shadow-lg"
                                style={{
                                  height: `${penelitianHeight}px`,
                                  transform: 'translateY(20px)',
                                  opacity: 0,
                                  minHeight: "4px",
                                  animation: `fadeInUp 0.8s ease-out ${index * 100}ms forwards`
                                }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
                                  {yearData.penelitian_blu}
                                </div>
                              </div>

                              {/* Pengabdian Bar */}
                              <div
                                className="w-6 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-blue-500 hover:to-blue-300 group relative cursor-pointer shadow-lg"
                                style={{
                                  height: `${pengabdianHeight}px`,
                                  transform: 'translateY(20px)',
                                  opacity: 0,
                                  minHeight: "4px",
                                  animation: `fadeInUp 0.8s ease-out ${index * 100 + 50}ms forwards`
                                }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
                                  {yearData.pengabdian_blu}
                                </div>
                              </div>
                            </div>

                            {/* Values Display */}
                            <div className="flex gap-2 mt-2 text-xs">
                              <div className="text-emerald-300 font-medium">{yearData.penelitian_blu}</div>
                              <div className="text-blue-300 font-medium">{yearData.pengabdian_blu}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-8 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg"></div>
                      <span className="text-white font-medium">Penelitian BLU</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg"></div>
                      <span className="text-white font-medium">Pengabdian BLU</span>
                    </div>
                  </div>
                </div>

                {/* Three Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Total Research Output */}
                  <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent rounded-3xl p-8 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaProjectDiagram className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-emerald-300">
                        {statsData.total_summary.total_penelitian_blu.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <h4 className="font-display text-xl font-bold text-white mb-2">Total Penelitian</h4>
                    <p className="text-emerald-100 text-sm mb-4">{yearsRangeLabel}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200 text-xs">Growth</span>
                      <div className="flex items-center space-x-1">
                        <FaChartLine className="w-3 h-3 text-emerald-300" />
                        <span className="text-emerald-300 font-bold text-sm">
                          {formatTrend(
                            statsData.total_summary.growth_penelitian
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Community Service */}
                  <div className="bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent rounded-3xl p-8 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaHandsHelping className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-300">
                        {statsData.total_summary.total_pengabdian_blu.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <h4 className="font-display text-xl font-bold text-white mb-2">Total Pengabdian</h4>
                    <p className="text-blue-100 text-sm mb-4">{yearsRangeLabel}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-xs">Growth</span>
                      <div className="flex items-center space-x-1">
                        <FaChartLine className="w-3 h-3 text-blue-300" />
                        <span className="text-blue-300 font-bold text-sm">
                          {formatTrend(
                            statsData.total_summary.growth_pengabdian
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Intellectual Property */}
                  <div className="bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent rounded-3xl p-8 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaTrophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-purple-300">
                        {statsData.total_summary.total_paten + statsData.total_summary.total_haki}
                      </div>
                    </div>
                    <h4 className="font-display text-xl font-bold text-white mb-2">Portfolio HKI</h4>
                    <p className="text-purple-100 text-sm mb-4">Total Paten & HKI</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="font-bold text-purple-300">{statsData.total_summary.total_paten}</div>
                        <div className="text-purple-200">Paten</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="font-bold text-purple-300">{statsData.total_summary.total_haki}</div>
                        <div className="text-purple-200">HKI</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quarterly Performance */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-8">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">
                      Kinerja Kuartalan 2024
                    </h3>
                    <p className="text-blue-200 text-sm">Tren penelitian dan pengabdian per kuartal</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Quarterly Research */}
                    <div>
                      <h4 className="font-semibold text-emerald-300 mb-4 text-center">Penelitian BLU</h4>
                      <div className="space-y-4">
                        {statsData.quarterly_data.map((quarter, index) => {
                          const maxResearch = Math.max(...statsData.quarterly_data.map(q => q.penelitian_blu));
                          const widthPercentage = (quarter.penelitian_blu / maxResearch) * 100;

                          return (
                            <div key={quarter.quarter} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-200 font-medium">{quarter.quarter}</span>
                                <span className="text-sm text-white font-bold">{quarter.penelitian_blu}</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out hover:from-emerald-400 hover:to-emerald-300"
                                  style={{
                                    width: `${widthPercentage}%`,
                                    animationDelay: `${index * 100}ms`,
                                    animation: "slideInWidth 1s ease-out forwards",
                                    opacity: 0
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quarterly Service */}
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-4 text-center">Pengabdian BLU</h4>
                      <div className="space-y-4">
                        {statsData.quarterly_data.map((quarter, index) => {
                          const maxService = Math.max(...statsData.quarterly_data.map(q => q.pengabdian_blu));
                          const widthPercentage = (quarter.pengabdian_blu / maxService) * 100;

                          return (
                            <div key={quarter.quarter} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-200 font-medium">{quarter.quarter}</span>
                                <span className="text-sm text-white font-bold">{quarter.pengabdian_blu}</span>
                              </div>
                              <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out hover:from-blue-400 hover:to-blue-300"
                                  style={{
                                    width: `${widthPercentage}%`,
                                    animationDelay: `${index * 100 + 200}ms`,
                                    animation: "slideInWidth 1s ease-out forwards",
                                    opacity: 0
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {/* Average per Year */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl mb-4 border border-yellow-400/30">
                    <FaChartLine className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    Rata-rata per Tahun
                  </h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-300">
                      {Math.round(
                        statsData.total_summary.total_penelitian_blu /
                        safeYearsCount
                      )}
                    </div>
                    <div className="text-sm text-blue-100">Penelitian BLU</div>
                    <div className="text-2xl font-bold text-blue-300">
                      {Math.round(
                        statsData.total_summary.total_pengabdian_blu /
                        safeYearsCount
                      )}
                    </div>
                    <div className="text-sm text-blue-100">Pengabdian BLU</div>
                  </div>
                </div>

                {/* Best Year */}
                {(() => {
                  const bestYear = statsData.yearly_data.reduce(
                    (best, current) =>
                      current.penelitian_blu + current.pengabdian_blu >
                        best.penelitian_blu + best.pengabdian_blu
                        ? current
                        : best
                  );
                  return (
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-2xl mb-4 border border-emerald-400/30">
                        <FaTrophy className="w-8 h-8 text-emerald-300" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white mb-2">
                        Tahun Terbaik
                      </h3>
                      <div className="text-3xl font-bold text-emerald-300 mb-2">
                        {bestYear.year}
                      </div>
                      <div className="text-sm text-blue-100">
                        Total{" "}
                        {bestYear.penelitian_blu + bestYear.pengabdian_blu}{" "}
                        Proyek
                      </div>
                    </div>
                  );
                })()}

                {/* Total HKI Portfolio */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl mb-4 border border-purple-400/30">
                    <FaAward className="w-8 h-8 text-purple-300" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    Portfolio HKI
                  </h3>
                  <div className="text-3xl font-bold text-purple-300 mb-2">
                    {statsData.total_summary.total_paten +
                      statsData.total_summary.total_haki}
                  </div>
                  <div className="text-sm text-blue-100">
                    {statsData.total_summary.total_paten} Paten +{" "}
                    {statsData.total_summary.total_haki} HKI
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
