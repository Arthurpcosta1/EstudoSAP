import React, { useState, useEffect } from 'react';
import { PixelTrainee, PixelTruckBoss } from './PixelSprites.tsx';
import { Scenario, GameState } from '../../game/rules.ts';

interface PixelArenaProps {
  scenario: Scenario;
  gameState: GameState;
  hasAnswered: boolean;
  isCorrect: boolean | null;
  floatingText: { text: string; color: string; id: number }[];
}

export const PixelArena: React.FC<PixelArenaProps> = ({
  scenario,
  gameState,
  hasAnswered,
  isCorrect,
  floatingText
}) => {
  const isAttacking = hasAnswered && isCorrect === true;
  const isHit = hasAnswered && isCorrect === false;

  // Boss health display: 4 segments (representing system integrity)
  const bossSegments = Math.ceil(gameState.hp / 25);

  return (
    <div className="w-full relative bg-[#1a1033] border-4 border-black overflow-hidden select-none shadow-[4px_4px_0_#000]">
      {/* Stepped Banded Sky (16-bit SNES twilight gradient) */}
      <div className="w-full h-10 bg-[#24174d] border-b-2 border-black flex items-center justify-between px-3 text-[8px] font-pixel text-[#3de0ff] opacity-80">
        <span>🏭 UNIDADE SÃO GERALDO DO ARAGUAIA / PA</span>
        <span className="text-[#ffd23f]">FRIGORÍFICO MASTERBOI S/A</span>
      </div>
      <div className="w-full h-8 bg-[#312066]" />
      <div className="w-full h-8 bg-[#3e2980]" />

      {/* Industrial Factory Chimneys & Roof Silhouette in background */}
      <div className="absolute top-12 left-0 right-0 flex items-end justify-between px-6 opacity-30 pointer-events-none">
        <div className="w-8 h-16 bg-[#1a1033] border-t-2 border-r-2 border-black" />
        <div className="w-16 h-12 bg-[#1a1033] border-t-2 border-l-2 border-black" />
        <div className="w-12 h-20 bg-[#1a1033] border-t-2 border-black" />
        <div className="w-20 h-10 bg-[#1a1033] border-t-2 border-black" />
      </div>

      {/* Arena Stage: Characters and Challenge Battle */}
      <div className="relative px-2 sm:px-10 pt-2 sm:pt-4 pb-3 sm:pb-8 flex items-end justify-between min-h-[220px] sm:min-h-[260px] z-10">
        {/* Floating Combat Text */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          {floatingText.map(item => (
            <div
              key={item.id}
              className={`font-pixel text-sm sm:text-lg drop-shadow-[3px_3px_0_#000] animate-bounce ${item.color} bg-black/80 px-3 py-1 border-2 border-black`}
            >
              {item.text}
            </div>
          ))}
        </div>

        {/* Left Side: Estagiário QA (Player Sprite) */}
        <div className="flex flex-col items-center">
          {/* Player Tag */}
          <div className="bg-[#3b2a6e] border-2 border-black px-2 py-0.5 mb-2 shadow-[2px_2px_0_#000]">
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#5cff7a]">
              [ESTAGIÁRIO QA]
            </span>
          </div>

          <PixelTrainee isHit={isHit} isAttacking={isAttacking} />

          {/* Laser beam effect when attacking */}
          {isAttacking && (
            <div
              className="absolute left-24 sm:left-36 bottom-20 w-36 sm:w-64 h-3 bg-[#5cff7a] border-y-2 border-white shadow-[0_0_10px_#5cff7a] animate-pulse z-20 flex items-center justify-end"
              style={{ shapeRendering: 'crispEdges' }}
            >
              <span className="bg-[#ffd23f] text-black font-pixel text-[8px] px-1 -mr-2 border border-black">
                MIGO OK!
              </span>
            </div>
          )}
        </div>

        {/* Center: VS pixel badge */}
        <div className="hidden sm:flex flex-col items-center justify-center my-auto">
          <div className="bg-[#ff3b5c] border-2 border-black p-1 shadow-[3px_3px_0_#000]">
            <span className="font-pixel text-xs text-white">VS</span>
          </div>
          <span className="font-pixel text-[7px] text-[#ffd23f] mt-1 bg-black px-1">
            HOMOLOGAÇÃO
          </span>
        </div>

        {/* Right Side: Boss Challenge (Cattle Truck on Balança 01) */}
        <div className="flex flex-col items-center">
          {/* Boss Header & Integrity Bar */}
          <div className="bg-[#24174d] border-2 border-black p-1.5 mb-2 shadow-[2px_2px_0_#000] w-full max-w-[200px] text-center">
            <span className="font-pixel text-[8px] text-[#3de0ff] block truncate">
              BALANÇA 01 (EXCESSO)
            </span>
            <div className="flex items-center justify-center gap-1 mt-1 bg-black p-1 border border-black">
              <span className="font-pixel text-[7px] text-[#ff3b5c] mr-1">INTEGRIDADE:</span>
              {[1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  className={`w-3 h-2.5 border border-black ${
                    idx <= bossSegments ? 'bg-[#5cff7a]' : 'bg-[#ff3b5c]'
                  }`}
                />
              ))}
            </div>
          </div>

          <PixelTruckBoss isDamaged={isAttacking} />
        </div>
      </div>

      {/* Industrial Pavement / Ground (Chequered brick tiles) */}
      <div className="w-full h-12 bg-[#334155] border-t-4 border-black relative">
        {/* Pavement yellow safety hash pattern */}
        <div
          className="w-full h-3 border-b-2 border-black"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #ffd23f, #ffd23f 10px, #000 10px, #000 20px)'
          }}
        />
        <div className="flex justify-between px-4 pt-1 font-pixel text-[7px] text-slate-400">
          <span>PORTARIA 01 - BALANÇA RODOVIÁRIA</span>
          <span>PISTA DE PESAGEM PESADA</span>
        </div>
      </div>
    </div>
  );
};
