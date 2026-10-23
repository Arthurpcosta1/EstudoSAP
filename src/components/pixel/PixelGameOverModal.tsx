import React, { useState, useEffect } from 'react';
import { GameState } from '../../game/rules.ts';
import { sound } from '../../utils/audio.ts';

interface PixelGameOverModalProps {
  gameState: GameState;
  onRetry: () => void;
}

export const PixelGameOverModal: React.FC<PixelGameOverModalProps> = ({
  gameState,
  onRetry
}) => {
  const [countdown, setCountdown] = useState(9);

  useEffect(() => {
    sound.playGameOver();

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 select-none"
    >
      <div className="bg-[#1a1033] border-4 border-[#ff3b5c] outline-4 outline-black w-full max-w-md p-6 shadow-[8px_8px_0_#000] text-center">
        {/* Glitch Game Over Title */}
        <h2 className="font-pixel text-2xl sm:text-3xl text-[#ff3b5c] tracking-widest mb-1 drop-shadow-[4px_4px_0_#000] animate-pulse">
          GAME OVER
        </h2>
        <span className="font-pixel text-[8px] text-[#ffd23f] block mb-4">
          💥 DUMP CRÍTICO EM PRODUÇÃO! 💥
        </span>

        {/* Fallen Sprite Graphic */}
        <div className="my-4 flex justify-center">
          <div className="relative rotate-90 scale-90 opacity-80">
            <svg
              viewBox="0 0 32 40"
              className="w-24 h-24"
              style={{ shapeRendering: 'crispEdges' }}
            >
              <rect x="10" y="7" width="12" height="7" fill="#fed7aa" />
              <rect x="8" y="2" width="16" height="6" fill="#ffd23f" />
              <rect x="8" y="15" width="16" height="11" fill="#16a34a" />
              {/* X eyes */}
              <text x="11" y="13" fill="#ff3b5c" fontSize="6" fontFamily="monospace">
                X X
              </text>
            </svg>
          </div>
        </div>

        <p className="font-retro text-lg text-slate-300 mb-4 leading-tight">
          A integridade do QAS chegou a zero. A balança travou e a SEFAZ bloqueou as notas!
        </p>

        {/* Final Stats */}
        <div className="bg-black border-2 border-black p-3 mb-5 font-pixel text-xs text-left">
          <div className="flex justify-between text-[#3de0ff] mb-1">
            <span>PONTUAÇÃO FINAL:</span>
            <span className="text-[#ffd23f]">{gameState.xp} XP</span>
          </div>
          <div className="flex justify-between text-[#ff3b5c]">
            <span>BUGS VAZADOS:</span>
            <span>4 INCIDENTES</span>
          </div>
        </div>

        {/* Countdown & Retry Button */}
        <div className="space-y-3">
          <div className="font-pixel text-sm text-[#ffd23f]">
            CONTINUAR? <span className="text-xl text-[#ff3b5c]">{countdown}</span>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="w-full pixel-btn bg-[#ffd23f] hover:bg-[#facc15] text-black font-pixel text-xs sm:text-sm py-3 font-black shadow-[4px_4px_0_#000]"
          >
            INSERT COIN / REINICIAR ▶
          </button>
        </div>
      </div>
    </div>
  );
};
