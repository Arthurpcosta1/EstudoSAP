import React from 'react';

interface MasterboiLogoProps {
  className?: string;
  subtext?: string;
}

export const MasterboiLogo: React.FC<MasterboiLogoProps> = ({
  className = '',
  subtext = 'Gestão de Projetos'
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Masterboi Shield Mark */}
      <div className="w-8 h-8 rounded-lg bg-[#ba0c2f] flex items-center justify-center text-white shadow-sm shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Shield outline + Stylized Bull Horns / Crest */}
          <path
            d="M12 2L4 5V11.5C4 16.5 7.5 20.8 12 22C16.5 20.8 20 16.5 20 11.5V5L12 2Z"
            fill="#ba0c2f"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Stylized Bull Horns & Head */}
          <path
            d="M8 8C8.5 10 10.5 11.5 12 11.5C13.5 11.5 15.5 10 16 8C15.5 12 13.5 14.5 12 15C10.5 14.5 8.5 12 8 8Z"
            fill="#ffffff"
          />
          <path
            d="M7 7.5C8 8.5 10 9 12 9C14 9 16 8.5 17 7.5"
            stroke="#ba0c2f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand title */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-950 text-sm tracking-tight font-sans">
            {subtext}
          </span>
          <span className="text-[10px] font-semibold text-[#ba0c2f] bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-sans hidden sm:inline">
            MASTERBOI
          </span>
        </div>
      </div>
    </div>
  );
};
