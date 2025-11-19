"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

interface DropdownItem {
  name: string;
  href: string;
  external?: boolean;
}

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  titleClassName?: string;
  isMobileMenu?: boolean;
  onItemClick?: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  items,
  titleClassName = "",
  isMobileMenu = false,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setIsOpen(false);
    if (onItemClick) {
      onItemClick();
    }
  };

  if (isMobileMenu) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${titleClassName} w-full text-left flex items-center justify-between`}
        >
          <span>{title}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
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

        {isOpen && (
          <div className="mt-2 ml-4 space-y-1">
            {items.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleItemClick}
                  className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-white hover:bg-[#105091] transition-colors duration-200"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleItemClick}
                  className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-white hover:bg-[#105091] transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`${titleClassName} flex items-center space-x-1`}>
        <span>{title}</span>
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

      <div
        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
          isOpen ? "opacity-100 visible" : ""
        }`}
      >
        <div className="py-2">
          {items.map((item) => (
            item.external ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-[#105091] hover:text-white transition-colors duration-150 group/item"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex-1">{item.name}</span>
                <svg
                  className="w-3 h-3 ml-2 text-gray-400 group-hover/item:text-white transition-colors duration-150"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-[#105091] hover:text-white transition-colors duration-150 group/item"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex-1">{item.name}</span>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;