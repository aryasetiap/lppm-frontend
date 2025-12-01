import React, { useState, useEffect } from "react";
import {
  Users,
  Target,
  Briefcase,
  Building,
  Award,
  BookOpen,
  Star,
  Lightbulb,
} from "lucide-react";

interface ProfileData {
  metadata: {
    last_updated: string;
    data_source: string;
    description: string;
  };
  pimpinan: {
    kepala_lppm: {
      nama: string;
      foto: string;
      placeholder: string;
      jabatan: string;
      periode: string;
    };
    sekretaris_lppm: {
      nama: string;
      foto: string;
      placeholder: string;
      jabatan: string;
      periode: string;
    };
  };
  visi_misi: {
    visi: string;
    misi: Array<{ id: number; item: string }>;
  };
  tugas_fungsi: {
    tugas: Array<{ id: number; item: string }>;
    fungsi: Array<{ id: number; item: string }>;
  };
  struktur_organisasi: {
    gambar_struktur: string;
    gambar_placeholder: string;
    deskripsi: string;
  };
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to resolve image paths (handle subfolder deployment)
  const resolveImagePath = (path: string): string => {
    if (!path) return path;
    // If path starts with /, it's relative to root, need to add /app prefix
    if (path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/http')) {
      return '/app' + path;
    }
    return path;
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/profile-lppm.json`);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Handle URL hash for direct navigation to sections
  useEffect(() => {
    if (!profileData) return;

    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      ["pimpinan", "visi-misi", "tugas-fungsi", "struktur-organisasi"].includes(
        hash
      )
    ) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, [profileData]);

  // Smooth scroll to section with offset for fixed header
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Intersection Observer for active section detection (disabled - navigation commented out)
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setActiveSection(entry.target.id);
  //         }
  //       });
  //     },
  //     { threshold: 0.3 }
  //   );

  //   const sections = document.querySelectorAll("section[id]");
  //   sections.forEach((section) => observer.observe(section));

  //   return () => observer.disconnect();
  // }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            ❌ Gagal memuat data profil
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // const navigation = [
  //   { id: "pimpinan", name: "Pimpinan", icon: Users },
  //   { id: "visi-misi", name: "Visi & Misi", icon: Target },
  //   { id: "tugas-fungsi", name: "Tugas & Fungsi", icon: Briefcase },
  //   { id: "struktur-organisasi", name: "Struktur Organisasi", icon: Building },
  // ];

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
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl"></div>
            </div>

            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                Profile LPPM
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                Universitas Lampung
              </span>
            </h1>

            <div className="mb-8">
              <p className="font-display text-xl lg:text-2xl font-light text-blue-100">
                Lembaga Penelitian dan Pengabdian kepada Masyarakat
              </p>
            </div>

            <p className="font-body text-base lg:text-lg text-blue-50/90 leading-relaxed max-w-2xl mx-auto mb-12">
              Mengembangkan ilmu pengetahuan, teknologi, dan inovasi untuk
              kesejahteraan masyarakat melalui penelitian berkualitas dan
              pengabdian berdampak.
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

      {/* Sticky Navigation */}
      {/* <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-4">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex md:hidden gap-2 overflow-x-auto pb-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div> */}

      {/* Pimpinan Section */}
      <section
        id="pimpinan"
        className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 overflow-hidden"
      >
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
              Pimpinan LPPM
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Tim kepemimpinan yang berdedikasi untuk mengemban amanah dalam
              mengembangkan penelitian dan pengabdian masyarakat di Universitas
              Lampung.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Kepala LPPM */}
            <div className="group relative">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Top Gradient Bar */}
                <div className="h-1 bg-gradient-to-r from-[#105091] to-blue-600"></div>

                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-8 text-center">
                  {/* Image Container */}
                  <div className="relative mb-6">
                    <div className="mx-auto w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                        <img
                          src={resolveImagePath(profileData.pimpinan.kepala_lppm.foto)}
                          onError={(e) => {
                            e.currentTarget.src =
                              profileData.pimpinan.kepala_lppm.placeholder;
                          }}
                          alt={profileData.pimpinan.kepala_lppm.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#105091]">
                    {profileData.pimpinan.kepala_lppm.nama}
                  </h3>

                  <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#105091] to-blue-600 text-white font-semibold text-sm rounded-xl mb-3 shadow-lg">
                    <Award className="w-4 h-4 mr-2" />
                    {profileData.pimpinan.kepala_lppm.jabatan}
                  </div>

                  {/* <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    {profileData.pimpinan.kepala_lppm.periode}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Sekretaris LPPM */}
            <div className="group relative">
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Top Gradient Bar */}
                <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-8 text-center">
                  {/* Image Container */}
                  <div className="relative mb-6">
                    <div className="mx-auto w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-full h-full bg-white rounded-xl overflow-hidden">
                        <img
                          src={resolveImagePath(profileData.pimpinan.sekretaris_lppm.foto)}
                          onError={(e) => {
                            e.currentTarget.src =
                              profileData.pimpinan.sekretaris_lppm.placeholder;
                          }}
                          alt={profileData.pimpinan.sekretaris_lppm.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#105091]">
                    {profileData.pimpinan.sekretaris_lppm.nama}
                  </h3>

                  <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl mb-3 shadow-lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {profileData.pimpinan.sekretaris_lppm.jabatan}
                  </div>

                  {/* <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    {profileData.pimpinan.sekretaris_lppm.periode}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section
        id="visi-misi"
        className="relative bg-gradient-to-br from-gray-50 to-slate-100 py-20 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-indigo-600 bg-clip-text text-transparent mb-6">
              Visi & Misi
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Arah dan tujuan LPPM Universitas Lampung dalam mencapai keunggulan
              dan memberikan dampak positif bagi masyarakat melalui penelitian
              dan pengabdian.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Visi */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 text-white mb-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Visi</h3>
                </div>
                <p className="text-xl text-blue-50 leading-relaxed pl-15">
                  {profileData.visi_misi.visi}
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.visi_misi.misi.map((item, index) => (
                <div key={item.id} className="group relative">
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    {/* Top Gradient Bar */}
                    <div
                      className={`h-1 bg-gradient-to-r ${
                        index % 2 === 0
                          ? "from-[#105091] to-blue-600"
                          : "from-blue-600 to-indigo-600"
                      }`}
                    ></div>

                    {/* Glass Effect Overlay */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                            index % 2 === 0
                              ? "from-[#105091] to-blue-600"
                              : "from-blue-600 to-indigo-600"
                          } p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                        >
                          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                            <span
                              className={`font-bold text-sm ${
                                index % 2 === 0
                                  ? "text-[#105091]"
                                  : "text-blue-600"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 leading-relaxed flex-1">
                          {item.item}
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

      {/* Tugas & Fungsi Section */}
      <section
        id="tugas-fungsi"
        className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-20 overflow-hidden"
      >
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#105091] to-blue-600 bg-clip-text text-transparent mb-6">
              Tugas & Fungsi
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Peran dan tanggung jawab LPPM Universitas Lampung dalam mengelola
              penelitian dan pengabdian kepada masyarakat untuk mendukung
              pencapaian visi institusi.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Tugas */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900">
                  Tugas
                </h3>
              </div>
              <div className="space-y-4">
                {profileData.tugas_fungsi.tugas.map((item, index) => (
                  <div key={item.id} className="group flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#105091] to-blue-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm text-[#105091]">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-gray-700 leading-relaxed">
                      {item.item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fungsi */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900">
                  Fungsi
                </h3>
              </div>
              <div className="space-y-4">
                {profileData.tugas_fungsi.fungsi.map((item, index) => (
                  <div key={item.id} className="group flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-lg transform transition-all duration-500 group-hover:scale-110">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-gray-700 leading-relaxed">
                      {item.item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section
        id="struktur-organisasi"
        className="relative bg-gradient-to-br from-gray-50 to-slate-100 py-20 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
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
              Struktur organisasi LPPM Universitas Lampung yang menggambarkan
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
                <div className="mb-8">
                  <p className="font-body text-gray-600 text-center text-lg leading-relaxed">
                    {profileData.struktur_organisasi.deskripsi}
                  </p>
                </div>

                <div className="relative group">
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <img
                      src={resolveImagePath(profileData.struktur_organisasi.gambar_struktur)}
                      onError={(e) => {
                        e.currentTarget.src =
                          profileData.struktur_organisasi.gambar_placeholder;
                      }}
                      alt="Struktur Organisasi LPPM"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#105091] to-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse backdrop-blur-sm border border-white/20">
                    Organisasi LPPM
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

export default ProfilePage;
