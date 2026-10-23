import React from 'react';
import { PixelHeart } from './PixelSprites.tsx';
import { GameState, getCareerRank, getNextRankProgress } from '../../game/rules.ts';

interface PixelHudProps {
  gameState: GameState;
  currentModule?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenMap: () => void;
  onOpenTerminal: () => void;
  onOpenGlossary: () => void;
  onToggleTheme: () => void;
}

export const PixelHud: React.FC<PixelHudProps> = ({
  gameState,
  currentModule = 'MM/P2P',
  isMuted,
  onToggleMute,
  onOpenMap,
  onOpenTerminal,
  onOpenGlossary,
  onToggleTheme
}) => {
  const rank = getCareerRank(gameState.xp);
  const { progressPercent } = getNextRankProgress(gameState.xp);

  // 4 hearts: 100% = 4 full, 75% = 3 full, 50% = 2, 25% = 1, 0% = 0
  const heartsCount = Math.ceil(gameState.hp / 25);

  // Segmented XP blocks (10 segments)
  const segmentsFilled = Math.min(10, Math.floor(progressPercent / 10));

  return (
    <header className="w-full bg-[#1a1033] border-b-4 border-black px-2 sm:px-4 py-2 z-40 select-none shadow-[0_4px_0_#000]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Hearts & Player Title */}
        <div className="flex items-center gap-3">
          {/* Vidas / Hearts */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(idx => (
              <PixelHeart
                key={idx}
                status={idx <= heartsCount ? 'full' : 'empty'}
              />
            ))}
          </div>

          <div className="h-4 w-[2px] bg-black hidden sm:block" />

          {/* Player Name and Level */}
          <div className="flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px]">
            <span className="text-[#ffd23f]">NV.{rank.level}</span>
            <span className="text-white uppercase truncate max-w-[130px] sm:max-w-none">
              {rank.title.split(' ')[0]} {rank.title.split(' ')[1] || 'QA'}
            </span>
          </div>
        </div>

        {/* Center: Stage Title Banner */}
        <div className="bg-[#3b2a6e] border-2 border-black px-3 py-1 shadow-[2px_2px_0_#000]">
          <span className="font-pixel text-[9px] sm:text-[10px] text-[#3de0ff] tracking-wider uppercase block text-center">
            ★ ESTÁGIO {gameState.currentStep + 1}/6: {currentModule} ★
          </span>
        </div>

        {/* Right: XP Score, Segmented Bar, and Pixel Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* XP Score & Segmented Bar */}
          <div className="flex flex-col items-end">
            <div className="font-pixel text-[11px] sm:text-xs text-[#ffd23f]">
              XP:{String(gameState.xp).padStart(4, '0')}
            </div>
            {/* Segmented XP Bar */}
            <div className="flex gap-[2px] bg-black p-[2px] border border-black mt-0.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 ${
                    i < Math.floor((progressPercent / 100) * 8)
                      ? 'bg-[#ffd23f]'
                      : 'bg-[#3b2a6e]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action buttons (Pixel styled) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-testid="toggle-modo-executivo-btn"
              onClick={onToggleTheme}
              className="pixel-btn bg-[#e2e8f0] text-black font-pixel text-[8px] sm:text-[9px] px-2 py-1.5 font-bold uppercase shadow-[2px_2px_0_#000]"
              title="Alternar para o Modo Executivo (Portal de Gestão Masterboi)"
            >
              💼 MODO EXECUTIVO
            </button>

            <button
              type="button"
              onClick={onOpenMap}
              className="pixel-btn bg-[#ffd23f] text-black font-pixel text-[8px] sm:text-[9px] px-2 py-1.5 font-bold uppercase"
              title="Abrir Mapa de Fases (Estilo Super Mario World)"
            >
              MAPA
            </button>

            <button
              type="button"
              onClick={onOpenTerminal}
              className="pixel-btn bg-[#3de0ff] text-black font-pixel text-[8px] sm:text-[9px] px-2 py-1.5 font-bold uppercase hidden sm:inline-block"
              title="Simulador de T-Codes"
            >
              /n T-CODE
            </button>

            <button
              type="button"
              onClick={onOpenGlossary}
              className="pixel-btn bg-[#3b2a6e] text-white font-pixel text-[8px] sm:text-[9px] px-2 py-1.5 font-bold uppercase hidden sm:inline-block"
              title="Guia de Tabelas & Transações"
            >
              GUIA
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className={`pixel-btn font-pixel text-[8px] sm:text-[9px] px-2 py-1.5 font-bold uppercase ${
                isMuted ? 'bg-[#ff3b5c] text-white' : 'bg-[#5cff7a] text-black'
              }`}
              title={isMuted ? 'Ativar Efeitos Sonoros 8-Bit' : 'Silenciar'}
            >
              {isMuted ? 'MUTE' : 'SOM'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
