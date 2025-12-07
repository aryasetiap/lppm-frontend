import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaTag,
  FaUser,
  FaArrowLeft,
  FaShare,
  FaClock,
  FaNewspaper,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

// Types corresponding to the new API response
interface RelatedPost {
  title: string;
  slug: string;
  date: string;
  image: string;
}

interface RecentPost {
  title: string;
  slug: string;
  date: string;
}

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  date: string;
  author: string;
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  image?: string;
  content: string;
  related_posts: RelatedPost[];
  recent_posts: RecentPost[];
}

const BeritaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!slug) {
        setError("Slug berita tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use the new slug-based endpoint
        const apiBase = (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
          (window.location.hostname === "lppm.unila.ac.id" || window.location.hostname.includes("unila.ac.id")
            ? "https://lppm.unila.ac.id/api"
            : "http://localhost:8000/api");

        const response = await fetch(`${apiBase}/posts/slug/${slug}`);

        if (!response.ok) {
          throw new Error("Berita tidak ditemukan");
        }

        const json = await response.json();
        setNewsData(json.data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Gagal memuat detail berita. Berita mungkin tidak ditemukan atau telah dihapus.");
      } finally {
        setIsLoading(false);
        // Scroll to top when slug changes
        window.scrollTo(0, 0);
      }
    };

    fetchNewsDetail();
  }, [slug]);

  // Handle Share functionality
  const handleShare = async (platform?: string) => {
    if (!newsData) return;
    const url = window.location.href;
    const text = `${newsData.title} - LPPM Universitas Lampung`;

    if (platform) {
      let shareUrl = "";
      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(newsData.title)}`;
          break;
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
          break;
      }
      if (shareUrl) window.open(shareUrl, "_blank");
    } else {
      // Native Share or Copy
      if (navigator.share) {
        try {
          await navigator.share({ title: newsData.title, text: text, url: url });
        } catch (err) { console.log("Share cancelled"); }
      } else {
        navigator.clipboard.writeText(url);
        alert("Link berita disalin ke clipboard!");
      }
    }
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4 pt-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          <div className="hidden lg:block space-y-8 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaNewspaper className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button onClick={() => navigate("/berita")} className="px-6 py-3 bg-[#105091] text-white rounded-xl hover:bg-[#0a3b6d] transition-colors">
            Kembali ke Daftar Berita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section with Title & Meta */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 mt-16">
          <div className="">
            {/* Category Badge */}
            <div className="flex flex-wrap gap-2 mb-6">
              {newsData.categories.map((cat, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-[#105091] bg-blue-50 border border-blue-100">
                  <FaTag className="w-3 h-3 mr-2" />
                  {cat.name}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 w-full">
              {newsData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm md:text-base">
              <div className="flex items-center">
                <FaUser className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium text-gray-700">{newsData.author}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                <span>{newsData.date}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="w-4 h-4 mr-2 text-gray-400" />
                <span>3 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Featured Image */}
              {newsData.image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={newsData.image}
                    alt={newsData.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-gray-200');
                    }}
                  />
                </div>
              )}

              {/* Content Body */}
              <div className="p-6 md:p-10">
                <div
                  className="news-content prose prose-lg max-w-none text-gray-700 text-justify
                    prose-headings:font-bold prose-headings:text-gray-900 
                    prose-a:text-[#105091] prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                    prose-strong:font-bold prose-strong:text-gray-900
                    prose-p:mb-6
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-[#105091] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic"
                  dangerouslySetInnerHTML={{ __html: newsData.content }}
                />

                {/* Tags */}
                {newsData.tags.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {newsData.tags.map((tag, idx) => (
                        <Link key={idx} to={`/berita?tag=${tag.slug}`} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#105091] hover:text-white transition-colors text-sm">
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Share Footer */}
              <div className="bg-gray-50 px-6 md:px-10 py-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="font-semibold text-gray-700">Bagikan artikel ini:</span>
                <div className="flex gap-3">
                  <button onClick={() => handleShare('facebook')} className="p-2.5 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition"><FaFacebook /></button>
                  <button onClick={() => handleShare('twitter')} className="p-2.5 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition"><FaTwitter /></button>
                  <button onClick={() => handleShare('linkedin')} className="p-2.5 bg-[#0A66C2] text-white rounded-full hover:opacity-90 transition"><FaLinkedin /></button>
                  <button onClick={() => handleShare('whatsapp')} className="p-2.5 bg-[#25D366] text-white rounded-full hover:opacity-90 transition"><FaWhatsapp /></button>
                  <button onClick={() => handleShare()} className="p-2.5 bg-gray-600 text-white rounded-full hover:opacity-90 transition ml-2"><FaShare /></button>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Recent Posts Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Berita Terbaru</h3>
              <div className="space-y-6">
                {newsData.recent_posts.map((post, idx) => (
                  <Link key={idx} to={`/berita/${post.slug}`} className="group flex gap-4 items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#105091] transition-colors leading-snug mb-1">
                        {post.title}
                      </h4>
                      <span className="text-xs text-gray-400 block">{post.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/berita" className="mt-6 inline-flex items-center text-sm font-semibold text-[#105091] hover:text-[#0a3b6d]">
                Lihat Semua Berita <FaArrowLeft className="ml-2 rotate-180" />
              </Link>
            </div>

            {/* Quick Links / CTA Widget */}
            <div className="bg-gradient-to-br from-[#105091] to-[#0a3b6d] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Punya Pertanyaan?</h3>
                <p className="text-blue-100 text-sm mb-6">Hubungi kami untuk informasi lebih lanjut mengenai penelitian dan pengabdian.</p>
                <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-white text-[#105091] rounded-lg font-bold text-sm hover:bg-gray-100 transition shadow-sm">
                  <FaWhatsapp className="mr-2" /> Hubungi Kami
                </a>
              </div>
              {/* Decorative circles */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </aside>

          {/* Related Posts */}
          {newsData.related_posts.length > 0 && (
            <div className="mt-12 lg:col-span-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-8 bg-[#105091] rounded-full mr-3"></span>
                Berita Terkait
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsData.related_posts.map((post, idx) => (
                  <Link key={idx} to={`/berita/${post.slug}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
                    <div className="h-48 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <FaCalendarAlt className="mr-1.5" /> {post.date}
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#105091] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeritaDetailPage;