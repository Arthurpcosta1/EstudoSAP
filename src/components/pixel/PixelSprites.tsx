import React from 'react';

/**
 * Pure SVG Pixel Art Sprites with crispEdges rendering.
 * Hand-drawn rect-by-rect in 16-bit SNES aesthetics.
 */

export const PixelTrainee: React.FC<{ isHit?: boolean; isAttacking?: boolean }> = ({
  isHit = false,
  isAttacking = false
}) => {
  return (
    <svg
      viewBox="0 0 32 40"
      className={`w-20 h-28 sm:w-32 sm:h-44 transition-none ${
        isHit ? 'translate-x-[-6px] filter contrast-200' : isAttacking ? 'translate-x-3' : 'animate-pixel-idle'
      }`}
      style={{ shapeRendering: 'crispEdges' }}
      aria-label="Sprite do Estagiário QA Masterboi"
    >
      {/* Shadow on ground */}
      <ellipse cx="16" cy="38" rx="12" ry="2" fill="#000000" opacity="0.6" />

      {/* Boots */}
      <rect x="9" y="34" width="6" height="4" fill="#1e293b" />
      <rect x="17" y="34" width="6" height="4" fill="#1e293b" />
      <rect x="8" y="36" width="3" height="2" fill="#0f172a" />
      <rect x="21" y="36" width="3" height="2" fill="#0f172a" />

      {/* Pants (Dark Blue) */}
      <rect x="10" y="27" width="5" height="7" fill="#1e3a8a" />
      <rect x="17" y="27" width="5" height="7" fill="#1e3a8a" />
      <rect x="13" y="25" width="6" height="3" fill="#172554" />

      {/* Body / Reflective Safety Vest */}
      <rect x="8" y="15" width="16" height="11" fill="#16a34a" /> {/* Green vest */}
      {/* Reflective Neon Yellow Stripes */}
      <rect x="8" y="18" width="16" height="2" fill="#facc15" />
      <rect x="8" y="22" width="16" height="2" fill="#facc15" />
      {/* White undershirt */}
      <rect x="14" y="15" width="4" height="4" fill="#ffffff" />
      {/* ID Badge */}
      <rect x="10" y="19" width="3" height="2" fill="#ffffff" />
      <rect x="10" y="20" width="3" height="1" fill="#ef4444" />

      {/* Arms & Hands */}
      <rect x="6" y="17" width="3" height="7" fill="#16a34a" />
      <rect x="6" y="24" width="3" height="3" fill="#fed7aa" />
      {/* Right arm holding QA scanner tablet */}
      <rect x="23" y="17" width="3" height="6" fill="#16a34a" />
      <rect x="23" y="23" width="3" height="3" fill="#fed7aa" />
      {/* QA Scanner Tablet */}
      <rect x="24" y="20" width="6" height="8" fill="#0f172a" />
      <rect x="25" y="21" width="4" height="6" fill="#3de0ff" />
      <rect x="26" y="23" width="2" height="2" fill="#ffffff" />

      {/* Neck */}
      <rect x="14" y="13" width="4" height="2" fill="#fed7aa" />

      {/* Head */}
      <rect x="10" y="7" width="12" height="7" fill="#fed7aa" />
      {/* Safety Goggles (Cyan visor) */}
      <rect x="9" y="8" width="14" height="4" fill="#0284c7" />
      <rect x="10" y="9" width="5" height="2" fill="#3de0ff" />
      <rect x="17" y="9" width="5" height="2" fill="#3de0ff" />
      <rect x="11" y="9" width="1" height="1" fill="#ffffff" />
      <rect x="18" y="9" width="1" height="1" fill="#ffffff" />
      {/* Nose & Mouth */}
      <rect x="15" y="12" width="2" height="1" fill="#ea580c" />

      {/* Yellow Safety Hardhat with MB logo */}
      <rect x="8" y="2" width="16" height="6" fill="#ffd23f" />
      <rect x="7" y="6" width="18" height="2" fill="#eab308" />
      <rect x="9" y="1" width="14" height="2" fill="#fef08a" />
      {/* MB Red logo on helmet */}
      <rect x="13" y="3" width="6" height="3" fill="#ff3b5c" />
      <rect x="14" y="4" width="1" height="2" fill="#ffffff" />
      <rect x="15" y="4" width="1" height="1" fill="#ffffff" />
      <rect x="16" y="4" width="1" height="1" fill="#ffffff" />
      <rect x="17" y="4" width="1" height="2" fill="#ffffff" />
    </svg>
  );
};

export const PixelTruckBoss: React.FC<{ isDamaged?: boolean }> = ({ isDamaged = false }) => {
  return (
    <div className={`relative transition-none ${isDamaged ? 'animate-shake' : ''}`}>
      <svg
        viewBox="0 0 64 36"
        className="w-36 h-22 sm:w-60 sm:h-34"
        style={{ shapeRendering: 'crispEdges' }}
        aria-label="Caminhão de Boi Vivo na Balança 01"
      >
        {/* Shadow on scale */}
        <rect x="2" y="32" width="60" height="3" fill="#000000" opacity="0.7" />

        {/* Weighing scale platform (Balança) with hazard stripes */}
        <rect x="0" y="30" width="64" height="4" fill="#334155" />
        <rect x="2" y="31" width="6" height="2" fill="#ffd23f" />
        <rect x="12" y="31" width="6" height="2" fill="#ffd23f" />
        <rect x="22" y="31" width="6" height="2" fill="#ffd23f" />
        <rect x="32" y="31" width="6" height="2" fill="#ffd23f" />
        <rect x="42" y="31" width="6" height="2" fill="#ffd23f" />
        <rect x="52" y="31" width="6" height="2" fill="#ffd23f" />

        {/* Wheels */}
        <rect x="10" y="26" width="6" height="6" fill="#0f172a" />
        <rect x="12" y="28" width="2" height="2" fill="#94a3b8" />
        <rect x="20" y="26" width="6" height="6" fill="#0f172a" />
        <rect x="22" y="28" width="2" height="2" fill="#94a3b8" />
        <rect x="48" y="26" width="6" height="6" fill="#0f172a" />
        <rect x="50" y="28" width="2" height="2" fill="#94a3b8" />

        {/* Cattle Cage Trailer (Carreta Boiadeira Masterboi) */}
        <rect x="4" y="8" width="38" height="19" fill="#78350f" />
        {/* Slits of the cattle truck */}
        <rect x="6" y="11" width="34" height="2" fill="#1e1005" />
        <rect x="6" y="16" width="34" height="2" fill="#1e1005" />
        <rect x="6" y="21" width="34" height="2" fill="#1e1005" />
        {/* Cattle silhouettes inside */}
        <rect x="10" y="12" width="4" height="3" fill="#ffffff" />
        <rect x="22" y="12" width="4" height="3" fill="#ffffff" />
        <rect x="32" y="17" width="4" height="3" fill="#ffffff" />
        {/* Masterboi Brand on Trailer */}
        <rect x="8" y="8" width="20" height="2" fill="#ff3b5c" />
        <rect x="9" y="8" width="18" height="1" fill="#ffffff" />

        {/* Truck Cabin (Cabine Vermelha Masterboi) */}
        <rect x="42" y="12" width="18" height="15" fill="#e11d48" />
        {/* Windshield */}
        <rect x="52" y="14" width="7" height="6" fill="#3de0ff" />
        <rect x="53" y="15" width="2" height="2" fill="#ffffff" />
        {/* Bumper and Grill */}
        <rect x="58" y="20" width="3" height="7" fill="#475569" />
        {/* Headlight (yellow glow) */}
        <rect x="59" y="21" width="2" height="2" fill="#ffd23f" />
        {/* Exhaust pipe */}
        <rect x="43" y="4" width="2" height="9" fill="#94a3b8" />
        <rect x="42" y="3" width="4" height="2" fill="#64748b" />
      </svg>

      {/* Floating Weight Alert Billboard */}
      <div className="absolute -top-6 -right-2 sm:-right-4 bg-black border-2 border-red-500 p-1 text-center shadow-[3px_3px_0_#000]">
        <span className="block font-pixel text-[9px] text-[#ff3b5c] animate-pulse">
          +300KG!
        </span>
      </div>

      <div className="bg-[#1a1033] border-2 border-[#ffd23f] px-2 py-0.5 mt-1 text-center shadow-[2px_2px_0_#000]">
        <span className="font-pixel text-[8px] sm:text-[9px] text-[#ffd23f] block">
          BALANÇA: 5.300 KG
        </span>
        <span className="font-pixel text-[7px] text-[#3de0ff] block">
          PO MÁX: 5.000 KG (0%)
        </span>
      </div>
    </div>
  );
};

export const PixelTechLeadPortrait: React.FC = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-[#3b2a6e] border-2 border-black"
      style={{ shapeRendering: 'crispEdges' }}
      aria-label="Retrato Pixel do Tech Lead Masterboi"
    >
      {/* Background Frame */}
      <rect x="0" y="0" width="24" height="24" fill="#24174d" />

      {/* Hair & Beard */}
      <rect x="6" y="3" width="12" height="4" fill="#451a03" />
      <rect x="5" y="5" width="3" height="6" fill="#451a03" />
      <rect x="16" y="5" width="3" height="6" fill="#451a03" />
      {/* Beard */}
      <rect x="6" y="15" width="12" height="4" fill="#451a03" />
      <rect x="8" y="19" width="8" height="2" fill="#451a03" />

      {/* Face */}
      <rect x="7" y="6" width="10" height="9" fill="#fed7aa" />

      {/* Glasses (Cyan Frame) */}
      <rect x="6" y="8" width="5" height="3" fill="#0f172a" />
      <rect x="7" y="9" width="3" height="2" fill="#3de0ff" />
      <rect x="13" y="8" width="5" height="3" fill="#0f172a" />
      <rect x="14" y="9" width="3" height="2" fill="#3de0ff" />
      <rect x="11" y="9" width="2" height="1" fill="#0f172a" />

      {/* Nose & Mouth */}
      <rect x="11" y="12" width="2" height="1" fill="#ea580c" />
      <rect x="10" y="14" width="4" height="1" fill="#b45309" />

      {/* Headset microphone */}
      <rect x="4" y="7" width="2" height="6" fill="#94a3b8" />
      <rect x="4" y="13" width="4" height="1" fill="#94a3b8" />
      <rect x="7" y="13" width="2" height="2" fill="#ffd23f" />

      {/* Masterboi Polo Collar */}
      <rect x="5" y="19" width="14" height="5" fill="#e11d48" />
      <rect x="10" y="19" width="4" height="4" fill="#ffffff" />
    </svg>
  );
};

export const PixelHeart: React.FC<{ status: 'full' | 'empty' | 'breaking' }> = ({ status }) => {
  if (status === 'empty') {
    return (
      <svg
        viewBox="0 0 10 9"
        className="w-5 h-5 sm:w-6 sm:h-6"
        style={{ shapeRendering: 'crispEdges' }}
      >
        <rect x="1" y="0" width="3" height="1" fill="#475569" />
        <rect x="6" y="0" width="3" height="1" fill="#475569" />
        <rect x="0" y="1" width="5" height="3" fill="#1e293b" />
        <rect x="5" y="1" width="5" height="3" fill="#1e293b" />
        <rect x="1" y="4" width="8" height="2" fill="#1e293b" />
        <rect x="2" y="6" width="6" height="1" fill="#1e293b" />
        <rect x="3" y="7" width="4" height="1" fill="#1e293b" />
        <rect x="4" y="8" width="2" height="1" fill="#1e293b" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 10 9"
      className={`w-5 h-5 sm:w-6 sm:h-6 ${status === 'breaking' ? 'animate-shake' : ''}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="1" y="0" width="3" height="1" fill="#ff3b5c" />
      <rect x="6" y="0" width="3" height="1" fill="#ff3b5c" />
      <rect x="0" y="1" width="5" height="3" fill="#ff3b5c" />
      <rect x="5" y="1" width="5" height="3" fill="#ff3b5c" />
      {/* Gloss shine */}
      <rect x="1" y="1" width="2" height="1" fill="#ffffff" />
      <rect x="1" y="2" width="1" height="1" fill="#ffffff" />
      <rect x="1" y="4" width="8" height="2" fill="#ff3b5c" />
      <rect x="2" y="6" width="6" height="1" fill="#ff3b5c" />
      <rect x="3" y="7" width="4" height="1" fill="#ff3b5c" />
      <rect x="4" y="8" width="2" height="1" fill="#ff3b5c" />
      {/* Dark outline */}
      <rect x="4" y="1" width="2" height="1" fill="#000000" opacity="0.4" />
      <rect x="0" y="0" width="1" height="1" fill="#000000" opacity="0.3" />
      <rect x="9" y="0" width="1" height="1" fill="#000000" opacity="0.3" />
    </svg>
  );
};
