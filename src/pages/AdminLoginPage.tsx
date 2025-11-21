import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserShield, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { adminAuth } from "../utils/adminAuth";

const LARAVEL_API_BASE =
  (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!username || !password) {
        throw new Error("Masukkan username dan password.");
      }

      let token: string | null = null;
      let displayName = username;

      const response = await fetch(`${LARAVEL_API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message || "Gagal melakukan autentikasi. Periksa kredensial."
        );
      }

      const data = await response.json();
      token = data?.meta?.token || null;
      displayName = data?.data?.display_name || data?.data?.username || username;

      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      adminAuth.login(token, displayName);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a3a75] via-blue-900 to-indigo-950 text-white overflow-hidden relative">
      {/* Background ornaments */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-indigo-600/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_2s]"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[length:24px_24px]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8">
          <div className="hidden lg:flex flex-col justify-center space-y-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-10 shadow-2xl">
            <div className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-blue-100">
              <FaUserShield className="w-5 h-5" />
              Admin Suite
            </div>
            <h1 className="text-4xl font-display font-bold leading-tight">
              Dashboard Admin LPPM Unila
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Kelola konten, pantau statistik penelitian & pengabdian, dan lakukan
              sinkronisasi data langsung dengan kredensial WordPress Admin yang sudah ada.
            </p>
            {/* <ul className="space-y-3 text-blue-50">
              {[
                "Tema dan gaya visual konsisten dengan tampilan utama LPPM.",
                "Autentikasi memanfaatkan data user dari WordPress (wp-admin).",
                "Akses aman hanya melalui path khusus /admin/login.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-2"></span>
                  {item}
                </li>
              ))}
            </ul> */}
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
              <div className="text-sm uppercase tracking-widest text-blue-100 mb-2">
                Selamat Datang Kembali
              </div>
                <h2 className="text-3xl font-display font-semibold">Masuk Admin</h2>
                <p className="text-blue-200 text-sm mt-2">
                Gunakan akun admin yang terdaftar.
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#105091] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaLock className="w-5 h-5 text-white" />
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2">
                  Username / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    placeholder="admin@unila.ac.id"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <FaUserShield className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-100 text-sm rounded-2xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#105091] to-blue-600 rounded-2xl py-3 font-display font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Memverifikasi..." : "Masuk Dashboard"}
                {!loading && <FaArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-blue-200">
              Akses ini tidak dipublikasikan pada beranda. Ketik langsung URL{" "}
              <span className="font-semibold text-white">/admin/login</span> untuk masuk.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

