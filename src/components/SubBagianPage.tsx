import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Target,
  Briefcase,
  Building,
  Award,
  ArrowLeft,
  BookOpen,
  Star,
  Shield,
  Lightbulb,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PimpinanData {
  ketua: {
    nama: string;
    foto: string;
    placeholder: string;
    jabatan: string;
    periode: string;
  };
  staff?: {
    nama: string;
    foto: string;
    placeholder: string;
    jabatan: string;
    periode: string;
  }[];
}

interface ProfilData {
  visi: string;
  misi: string[];
  program_unggulan: string[];
  prestasi: string[];
  keunggulan: string[];
}

interface SubBagianData {
  nama: string;
  singkatan: string;
  kategori: string;
  pimpinan: PimpinanData;
  profile_singkat: string;
  profil: ProfilData;
  tugas_fungsi: string[];
  struktur_organisasi: {
    gambar_struktur: string;
    gambar_placeholder: string;
  };
}

interface SubBagianResponse {
  metadata: {
    last_updated: string;
    data_source: string;
    description: string;
  };
  sub_bagian: {
    [key: string]: {
      [key: string]: SubBagianData;
    };
  };
}

const SubBagianPage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const [subBagianData, setSubBagianData] = useState<SubBagianData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (!subBagianData?.pimpinan) return;
    const totalMembers = 1 + (subBagianData.pimpinan.staff?.length || 0);
    setCurrentSlide((prev) => (prev + 1) % totalMembers);
  };

  const prevSlide = () => {
    if (!subBagianData?.pimpinan) return;
    const totalMembers = 1 + (subBagianData.pimpinan.staff?.length || 0);
    setCurrentSlide((prev) => (prev - 1 + totalMembers) % totalMembers);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!subBagianData?.pimpinan) return;
    const totalMembers = 1 + (subBagianData.pimpinan.staff?.length || 0);

    if (totalMembers <= 1) return; // Don't auto-slide if only one member

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalMembers);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [subBagianData]);

  // Helper function to resolve image paths (handle subfolder deployment)
  const resolveImagePath = (path: string): string => {
    if (!path) return "";
    // If path is a full URL, return it as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // If path starts with /, it's relative to root, need to add /app prefix if not already there
    // and if we are not in dev mode (where / is root) - but here we assume /app is always needed based on previous context
    // or better yet, use import.meta.env.BASE_URL
    if (path.startsWith('/')) {
      const baseUrl = import.meta.env.BASE_URL;
      // Remove leading slash from path to avoid double slashes if baseUrl ends with slash
      const cleanPath = path.substring(1);
      // Ensure baseUrl ends with slash
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      return cleanBaseUrl + cleanPath;
    }
    return path;
  };

  useEffect(() => {
    const loadSubBagianData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/sub-bagian-lppm.json`);
        if (!response.ok) {
          throw new Error("Gagal memuat data sub bagian");
        }
        const data: SubBagianResponse = await response.json();

        // Find the sub bagian data based on category and slug
        const categoryData = data.sub_bagian[category || ""];
        if (categoryData && categoryData[slug || ""]) {
          setSubBagianData(categoryData[slug || ""]);
        } else {
          setError("Sub bagian tidak ditemukan");
        }
      } catch (err) {
        console.error("Error loading sub bagian data:", err);
        setError("Gagal memuat data sub bagian");
      } finally {
        setLoading(false);
      }
    };

    if (category && slug) {
      loadSubBagianData();
    } else {
      setError("Parameter tidak lengkap");
      setLoading(false);
    }
  }, [category, slug]);

  // Function to get category display name
  const getCategoryDisplayName = (cat: string): string => {
    const categoryNames: { [key: string]: string } = {
      pui: "Pusat Unggulan Ipteks",
      puslit: "Pusat Penelitian",
      administrasi: "Administrasi",
    };
    return categoryNames[cat] || cat.toUpperCase();
  };

  // Function to get category icon
  const getCategoryIcon = (cat: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      pui: Award,
      puslit: BookOpen,
      administrasi: Building,
    };
    return icons[cat] || Target;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-600">Memuat data sub bagian...</p>
        </div>
      </div>
    );
  }

  if (error || !subBagianData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Data Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#105091] to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(category || "");

  return (
    <div className="min-h-screen">
      {/* Hero Section - Senada dengan HomePage */}
      <div className="relative h-screen bg-gradient-to-br from-[#105091] via-blue-900 to-indigo-900 text-white overflow-hidden">
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
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 left-10 text-blue-300/20 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "6s" }}
          >
            <Users className="w-8 h-8" />
          </div>
          <div
            className="absolute top-40 right-20 text-indigo-300/20 animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "6s" }}
          >
            <Target className="w-6 h-6" />
          </div>
          <div
            className="absolute bottom-40 left-20 text-purple-300/20 animate-bounce"
            style={{ animationDelay: "4s", animationDuration: "6s" }}
          >
            <Building className="w-10 h-10" />
          </div>
          <div
            className="absolute bottom-20 right-1/3 text-blue-300/20 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "6s" }}
          >
            <CategoryIcon className="w-8 h-8" />
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {/* <div className="absolute top-8 left-6 right-6 z-10">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Beranda
            </button>
            <span className="text-white/60">/</span>
            <span className="text-white/80">
              {getCategoryDisplayName(category || "")}
            </span>
            <span className="text-white/60">/</span>
            <span className="text-white font-medium">{subBagianData?.nama}</span>
          </nav>
        </div> */}

        {/* Hero Content */}
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl"></div>
            </div>

            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-4">
                <CategoryIcon className="w-4 h-4 mr-2" />
                {getCategoryDisplayName(category || "")}
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                {subBagianData?.nama}
              </span>
            </h1>

            <div className="mb-8">
              <p className="font-display text-xl lg:text-2xl font-light text-blue-100">
                {subBagianData?.singkatan}
              </p>
            </div>

            <p className="font-body text-base lg:text-lg text-blue-50/90 leading-relaxed max-w-2xl mx-auto mb-12">
              {subBagianData?.profile_singkat}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Users, text: "Profesional", delay: 100 },
                { icon: Target, text: "Berkomitmen", delay: 200 },
                { icon: Award, text: "Unggul", delay: 300 },
                { icon: Lightbulb, text: "Inovatif", delay: 400 },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  style={{
                    animationDelay: `${feature.delay}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  <feature.icon className="w-4 h-4 text-blue-200" />
                  <span className="text-sm font-medium text-white/90">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Pimpinan Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"
            style={{ animation: "float 6s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"
            style={{
              animation: "float 6s ease-in-out infinite",
              animationDelay: "2s",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-blue-600 bg-clip-text text-transparent mb-6">
              {subBagianData?.pimpinan?.staff && subBagianData.pimpinan.staff.length > 0 ? "Pimpinan dan Staff" : "Pimpinan"}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kepemimpinan yang berdedikasi untuk mengemban amanah dalam
              mengembangkan {subBagianData?.nama?.toLowerCase()}.
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {subBagianData?.pimpinan?.staff && subBagianData.pimpinan.staff.length > 0 ? (
              <div className="relative">
                {/* Slider Container */}
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg text-[#105091] transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex-1 overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {[subBagianData.pimpinan.ketua, ...subBagianData.pimpinan.staff].map((person, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-4">
                          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                            {/* Top Gradient Bar */}
                            <div className="h-1 bg-gradient-to-r from-[#105091] to-blue-600"></div>

                            {/* Glass Effect Overlay */}
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative p-8 text-center">
                              {/* Image Container */}
                              <div className="relative mb-6">
                                <div className="mx-auto w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                                  <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                                    <img
                                      src={resolveImagePath(person.foto)}
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src !== person.placeholder) {
                                          target.src = person.placeholder || "https://via.placeholder.com/400x400?text=No+Image";
                                        }
                                      }}
                                      alt={person.nama}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                {/* Glow Effect */}
                                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 blur-xl opacity-20 transition-opacity duration-500"></div>
                              </div>

                              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-[#105091]">
                                {person.nama}
                              </h3>

                              <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#105091] to-blue-600 text-white font-semibold text-sm rounded-xl mb-3 shadow-lg">
                                <Award className="w-4 h-4 mr-2" />
                                {person.jabatan}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg text-[#105091] transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {[subBagianData.pimpinan.ketua, ...subBagianData.pimpinan.staff].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-[#105091] w-6" : "bg-blue-200 hover:bg-blue-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  {/* Top Gradient Bar */}
                  <div className="h-1 bg-gradient-to-r from-[#105091] to-blue-600"></div>

                  {/* Glass Effect Overlay */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative p-8 text-center">
                    {/* Image Container */}
                    <div className="relative mb-6">
                      <div className="mx-auto w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                        <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                          <img
                            src={resolveImagePath(subBagianData?.pimpinan?.ketua?.foto)}
                            onError={(e) => {
                              const target = e.currentTarget;
                              // Prevent infinite loop if placeholder also fails
                              if (target.src !== subBagianData?.pimpinan?.ketua?.placeholder) {
                                target.src = subBagianData?.pimpinan?.ketua?.placeholder || "https://via.placeholder.com/400x400?text=No+Image";
                              }
                            }}
                            alt={subBagianData?.pimpinan?.ketua?.nama}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {/* Glow Effect */}
                      <div className="absolute inset-0 w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 blur-xl opacity-20 transition-opacity duration-500"></div>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-[#105091]">
                      {subBagianData?.pimpinan?.ketua?.nama}
                    </h3>

                    <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#105091] to-blue-600 text-white font-semibold text-sm rounded-xl mb-3 shadow-lg">
                      <Award className="w-4 h-4 mr-2" />
                      {subBagianData?.pimpinan?.ketua?.jabatan}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profil Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-slate-100 py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-blue-600 bg-clip-text text-transparent mb-6">
              Profil {subBagianData?.nama}
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Visi, misi, dan keunggulan {subBagianData?.nama} dalam mendukung
              keunggulan LPPM Universitas Lampung.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-1 gap-8">
            {/* Visi dan Misi */}
            <div className="space-y-6">
              {/* Visi */}
              <div className="group relative">
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  <div className="h-1 bg-gradient-to-r from-[#105091] to-blue-600"></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#105091] to-blue-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-[#105091]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-[#105091]">
                          Visi
                        </h3>
                        <p className="font-body text-gray-700 leading-relaxed">
                          {subBagianData?.profil?.visi}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Misi */}
              <div className="group relative">
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-blue-600">
                          Misi
                        </h3>
                        <ul className="space-y-2">
                          {subBagianData?.profil?.misi?.map((item, index) => (
                            <li
                              key={index}
                              className="font-body text-gray-700 leading-relaxed flex items-start gap-2"
                            >
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Unggulan dan Prestasi */}
            {/* <div className="space-y-6"> */}
            {/* Program Unggulan */}
            {/* <div className="group relative">
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-indigo-600">
                          Program Unggulan
                        </h3>
                        <ul className="space-y-2">
                          {subBagianData.profil.program_unggulan.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="font-body text-gray-700 leading-relaxed flex items-start gap-2"
                              >
                                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

            {/* Prestasi */}
            {/* <div className="group relative">
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-purple-600">
                          Prestasi
                        </h3>
                        <ul className="space-y-2">
                          {subBagianData.profil.prestasi.map((item, index) => (
                            <li
                              key={index}
                              className="font-body text-gray-700 leading-relaxed flex items-start gap-2"
                            >
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
          </div>

          {/* Keunggulan - Full Width */}
          {/* <div className="mt-8">
            <div className="group relative">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="h-1 bg-gradient-to-r from-[#105091] via-blue-600 to-indigo-600"></div>
                <div className="relative p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#105091] via-blue-600 to-indigo-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#105091]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-[#105091]">
                        Keunggulan
                      </h3>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subBagianData.profil.keunggulan.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-100"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-[#105091] to-blue-600 rounded-full flex-shrink-0"></div>
                        <span className="font-body text-gray-700 text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Tugas & Fungsi Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-slate-100 py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-blue-600 bg-clip-text text-transparent mb-6">
              Tugas & Fungsi
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Peran dan tanggung jawab {subBagianData?.nama} dalam mendukung
              pencapaian visi dan misi LPPM Universitas Lampung.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-1 gap-6">
              {subBagianData?.tugas_fungsi?.map((item, index) => (
                <div key={index} className="group relative">
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    {/* Top Gradient Bar */}
                    <div
                      className={`h-1 bg-gradient-to-r ${index % 2 === 0
                        ? "from-[#105091] to-blue-600"
                        : "from-blue-600 to-indigo-600"
                        }`}
                    ></div>

                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${index % 2 === 0
                            ? "from-[#105091] to-blue-600"
                            : "from-blue-600 to-indigo-600"
                            } p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                        >
                          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                            <span
                              className={`font-bold text-sm ${index % 2 === 0
                                ? "text-[#105091]"
                                : "text-blue-600"
                                }`}
                            >
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 leading-relaxed flex-1">
                          {item}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"
            style={{ animation: "float 6s ease-in-out infinite" }}
          ></div>
          <div
            className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"
            style={{
              animation: "float 6s ease-in-out infinite",
              animationDelay: "2s",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-indigo-600 bg-clip-text text-transparent mb-6">
              Struktur Organisasi
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Struktur organisasi {subBagianData?.nama} yang menggambarkan
              hierarki dan hubungan kerja antar unit dalam mencapai tujuan
              lembaga.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform overflow-hidden border border-gray-100">
              {/* Top Gradient Bar */}
              <div className="h-1 bg-gradient-to-r from-[#105091] to-indigo-600"></div>

              {/* Glass Effect Overlay */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative p-8 md:p-12">
                <div className="relative group">
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src={resolveImagePath(subBagianData?.struktur_organisasi?.gambar_struktur)}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== subBagianData?.struktur_organisasi?.gambar_placeholder) {
                          target.src = subBagianData?.struktur_organisasi?.gambar_placeholder || "https://via.placeholder.com/1200x800?text=No+Image";
                        }
                      }}
                      alt={`Struktur Organisasi ${subBagianData?.nama}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#105091] to-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse backdrop-blur-sm border border-white/20">
                    Struktur {subBagianData?.singkatan}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubBagianPage;
