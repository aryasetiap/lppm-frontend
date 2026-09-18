import { useEffect, useState } from "react";

const PPID_ELEMENT_NAME = "ppid-pelaksana";
const PPID_SCRIPT_ID = "ppid-pelaksana-script";
const PPID_SCRIPT_SRC = "https://monev-ppid.unila.ac.id/embed/v1.js";
const PPID_FALLBACK_URL = "https://monev-ppid.unila.ac.id/pelaksana/lppm";
const PPID_READY_TIMEOUT_MS = 10_000;

type PpidStatus = "loading" | "ready" | "error";

const isPpidElementDefined = () => customElements.get(PPID_ELEMENT_NAME) !== undefined;

const PpidPage = () => {
  const [status, setStatus] = useState<PpidStatus>("loading");

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | undefined;
    let script: HTMLScriptElement | null = null;

    const clearReadyTimeout = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const setReady = () => {
      clearReadyTimeout();
      if (isMounted) {
        setStatus("ready");
      }
    };

    const setError = () => {
      clearReadyTimeout();
      if (isMounted) {
        setStatus("error");
      }
    };

    const waitForPpidElement = () => {
      clearReadyTimeout();
      timeoutId = window.setTimeout(setError, PPID_READY_TIMEOUT_MS);

      void customElements.whenDefined(PPID_ELEMENT_NAME).then(() => {
        setReady();
      });
    };

    const handleScriptLoad = () => {
      if (isPpidElementDefined()) {
        setReady();
        return;
      }

      waitForPpidElement();
    };

    const handleScriptError = () => {
      setError();
    };

    if (isPpidElementDefined()) {
      setReady();
    } else {
      const existingElement = document.getElementById(PPID_SCRIPT_ID);

      if (existingElement && !(existingElement instanceof HTMLScriptElement)) {
        setError();
      } else {
        script = existingElement ?? document.createElement("script");
        script.addEventListener("load", handleScriptLoad);
        script.addEventListener("error", handleScriptError);

        if (!existingElement) {
          script.id = PPID_SCRIPT_ID;
          script.src = PPID_SCRIPT_SRC;
          script.defer = true;
          document.head.appendChild(script);
        }

        waitForPpidElement();
      }
    }

    return () => {
      isMounted = false;
      clearReadyTimeout();
      script?.removeEventListener("load", handleScriptLoad);
      script?.removeEventListener("error", handleScriptError);
    };
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 pt-28 pb-12 sm:pt-32">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {status === "loading" && (
          <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm" role="status">
            <p className="font-body text-gray-600">Memuat layanan PPID...</p>
          </div>
        )}

        {status === "ready" && <ppid-pelaksana unit="LPPM" lang="id" />}

        {status === "error" && (
          <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
            <h1 className="font-display text-2xl font-bold text-gray-900">PPID LPPM</h1>
            <p className="mt-3 font-body text-gray-600">
              Layanan PPID belum dapat dimuat saat ini. Silakan buka halaman resmi PPID LPPM.
            </p>
            <a
              href={PPID_FALLBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-xl bg-[#105091] px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Buka PPID LPPM
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default PpidPage;
