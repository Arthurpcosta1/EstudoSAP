import React from 'react';
import { ALL_BADGES, GameState } from '../../game/rules.ts';

interface PixelStageMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  earnedBadges: string[];
}

export const PixelStageMapModal: React.FC<PixelStageMapModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  earnedBadges
}) => {
  if (!isOpen) return null;

  const stages = [
    { num: 1, name: 'BALANÇA 01', module: 'MM - GADO', icon: '🚛' },
    { num: 2, name: 'SALA FISCAL', module: 'MM/FI - MIRO', icon: '🧾' },
    { num: 3, name: 'COFRE CONTÁBIL', module: 'FI - BKPF', icon: '🏦' },
    { num: 4, name: 'CENTRO DISTRIB.', module: 'SD - VA01', icon: '🥩' },
    { num: 5, name: 'DESOSSA SIF', module: 'QM - CÂMARA', icon: '❄️' },
    { num: 6, name: 'BOSS GO-LIVE', module: 'BASIS - PROD', icon: '👑' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xs select-none"
    >
      <div className="bg-[#24174d] border-4 border-[#ffd23f] outline-4 outline-black w-full max-w-2xl p-4 sm:p-6 shadow-[8px_8px_0_#000] text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
          <div>
            <span className="font-pixel text-[8px] text-[#3de0ff] block">
              MAPA DE PROGRESSÃO DA FÁBRICA
            </span>
            <h3 id="map-title" className="font-pixel text-sm sm:text-base text-[#ffd23f]">
              ROTA DE HOMOLOGAÇÃO MASTERBOI
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-[#ff3b5c] text-white font-pixel text-xs px-2.5 py-1"
          >
            X
          </button>
        </div>

        {/* 6 Stage Nodes Map Path (Super Mario World style) */}
        <div className="bg-[#1a1033] border-4 border-black p-4 mb-5 relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stages.map((st, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isLocked = idx > currentStep;

              return (
                <div
                  key={st.num}
                  className={`border-4 border-black p-2.5 text-center flex flex-col items-center justify-between ${
                    isCurrent
                      ? 'bg-[#ffd23f] text-black shadow-[4px_4px_0_#000] animate-pixel-blink'
                      : isPast
                      ? 'bg-[#14532d] text-[#5cff7a] shadow-[2px_2px_0_#000]'
                      : 'bg-[#1e1b4b] text-slate-500 opacity-60'
                  }`}
                >
                  <div className="font-pixel text-[8px] uppercase">
                    Fase {st.num}
                  </div>
                  <div className="text-2xl my-1">{st.icon}</div>
                  <div className="font-pixel text-[7px] font-bold block truncate w-full">
                    {st.name}
                  </div>
                  <div className="font-pixel text-[6px] opacity-80 mt-1">
                    {isPast ? '★ CONCLUÍDO' : isCurrent ? '▶ ATUAL' : '🔒 BLOQUEADO'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges / Achievements Collection */}
        <div className="bg-[#3b2a6e] border-2 border-black p-3 mb-4">
          <div className="font-pixel text-[8px] text-[#ffd23f] mb-2">
            TROFÉUS E CONQUISTAS DESBLOQUEADAS:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_BADGES.map(b => {
              const unlocked = earnedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-1.5 border-2 border-black flex items-center gap-1.5 ${
                    unlocked
                      ? 'bg-[#1a1033] text-[#ffd23f]'
                      : 'bg-black/40 text-slate-600 opacity-40'
                  }`}
                >
                  <span className="text-base">{b.icon}</span>
                  <div className="min-w-0">
                    <span className="font-pixel text-[7px] block truncate">
                      {b.name}
                    </span>
                    <span className="font-pixel text-[6px] text-slate-400 block truncate">
                      {unlocked ? 'DESBLOQUEADO' : 'BLOQUEADO'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-[#ffd23f] text-black font-pixel text-[9px] px-4 py-2 font-bold"
          >
            VOLTAR À BATALHA ▶
          </button>
        </div>
      </div>
    </div>
  );
};
