import React, { useState, useEffect } from 'react';
import { GameState, Scenario, getCareerRank } from '../../game/rules.ts';
import { sound } from '../../utils/audio.ts';

interface PixelStageClearModalProps {
  scenario: Scenario;
  gameState: GameState;
  onNextStage: () => void;
  isLastStage: boolean;
}

export const PixelStageClearModal: React.FC<PixelStageClearModalProps> = ({
  scenario,
  gameState,
  onNextStage,
  isLastStage
}) => {
  const [animatedXp, setAnimatedXp] = useState(0);
  const [stars, setStars] = useState(0);

  const rank = getCareerRank(gameState.xp);

  useEffect(() => {
    sound.playStageClear();

    // Animate XP counting up number by number
    let current = 0;
    const target = scenario.xpReward;
    const step = Math.max(1, Math.floor(target / 25));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedXp(target);
        clearInterval(timer);
      } else {
        setAnimatedXp(current);
      }
    }, 30);

    // Sequence 3 stars
    setTimeout(() => setStars(1), 400);
    setTimeout(() => setStars(2), 800);
    setTimeout(() => setStars(3), 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xs select-none"
    >
      {/* Square pixel confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 animate-bounce"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 90}%`,
              backgroundColor: ['#ffd23f', '#5cff7a', '#3de0ff', '#ff3b5c', '#ffffff'][i % 5],
              animationDelay: `${(i * 0.1) % 1}s`
            }}
          />
        ))}
      </div>

      <div className="bg-[#24174d] border-4 border-[#ffd23f] outline-4 outline-black w-full max-w-lg p-6 shadow-[8px_8px_0_#000] text-center relative z-10">
        {/* Giant Bouncing Title */}
        <h2 className="font-pixel text-xl sm:text-2xl text-[#ffd23f] tracking-wide mb-1 animate-bounce drop-shadow-[4px_4px_0_#000]">
          FASE CONCLUÍDA!
        </h2>
        <span className="font-pixel text-[9px] text-[#5cff7a] block mb-4">
          ★ CASO DE TESTE HOMOLOGADO COM SUCESSO ★
        </span>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`font-pixel text-3xl sm:text-4xl transition-none ${
                s <= stars ? 'text-[#ffd23f] scale-110' : 'text-slate-700 opacity-30'
              }`}
            >
              ★
            </div>
          ))}
        </div>

        {/* Stats Box */}
        <div className="bg-[#1a1033] border-4 border-black p-4 my-4 font-pixel text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3de0ff]">XP DA MISSÃO:</span>
            <span className="text-[#ffd23f]">+{animatedXp} XP</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3de0ff]">TOTAL ACUMULADO:</span>
            <span className="text-[#ffd23f]">{gameState.xp} XP</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#3de0ff]">STATUS DO SISTEMA:</span>
            <span className="text-[#5cff7a]">{gameState.hp}% ESTÁVEL</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-black">
            <span className="text-[#3de0ff]">CARREIRA:</span>
            <span className="text-white truncate max-w-[160px]">{rank.title}</span>
          </div>
        </div>

        {/* Advance Button */}
        <button
          type="button"
          onClick={onNextStage}
          className="w-full pixel-btn bg-[#5cff7a] hover:bg-[#4ade80] text-black font-pixel text-xs sm:text-sm py-3 font-black shadow-[4px_4px_0_#000]"
        >
          {isLastStage ? 'VER LAUDO FINAL DE HOMOLOGAÇÃO ▶' : 'PRÓXIMA FASE ▶'}
        </button>
      </div>
    </div>
  );
};
