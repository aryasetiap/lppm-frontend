import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

interface NotFoundPageProps {
  description?: string;
}

const NotFoundPage = ({
  description = "Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.",
}: NotFoundPageProps) => (
  <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-24">
    <div className="w-full max-w-xl text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-[#105091]">
        <SearchX className="h-10 w-10" aria-hidden="true" />
      </div>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
        Error 404
      </p>
      <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mx-auto mt-4 max-w-md text-gray-600">{description}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-xl bg-gradient-to-r from-[#105091] to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
      >
        <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
        Kembali ke Beranda
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
