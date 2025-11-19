"use client";

import { useState } from "react";

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState("ID");

  const languages = [
    { code: "ID", name: "Indonesia", flag: "🇮🇩" },
    { code: "EN", name: "English", flag: "🇬🇧" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    // Implement language switching logic here
    console.log(`Language changed to: ${langCode}`);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-black hover:text-[#105091] transition-colors duration-200 rounded-lg hover:bg-gray-100"
        aria-label="Language switcher"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span>{currentLang}</span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
              currentLang === lang.code
                ? "bg-[#105091] text-white hover:bg-[#105091]"
                : "text-black"
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
            {currentLang === lang.code && (
              <svg
                className="w-4 h-4 ml-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;