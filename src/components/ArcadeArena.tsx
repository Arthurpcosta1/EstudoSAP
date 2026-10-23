import React, { useState, useEffect } from 'react';
import {
  Heart,
  Shield,
  Zap,
  HelpCircle,
  Sparkles,
  Flame,
  Award,
  Truck,
  FileCheck2,
  AlertTriangle,
  Scale,
  ThermometerSnowflake,
  Cpu
} from 'lucide-react';
import { Scenario, GameState, getCareerRank } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface ArcadeArenaProps {
  scenario: Scenario;
  gameState: GameState;
  hasAnswered: boolean;
  isCorrect: boolean | null;
  onUseFiftyFifty: () => void;
  onUseSeniorHint: () => void;
  onActivateShield: () => void;
}

export const ArcadeArena: React.FC<ArcadeArenaProps> = ({
  scenario,
  gameState,
  hasAnswered,
  isCorrect,
  onUseFiftyFifty,
  onUseSeniorHint,
  onActivateShield
}) => {
  const [floatingText, setFloatingText] = useState<{ text: string; color: string; id: number }[]>([]);
  const [heroAction, setHeroAction] = useState<'idle' | 'attack' | 'hit' | 'shield'>('idle');

  const rank = getCareerRank(gameState.xp);

  // Trigger animations and floating combat text on answer
  useEffect(() => {
    if (!hasAnswered) {
      setHeroAction('idle');
      return;
    }

    if (isCorrect) {
      sound.playLaser();
      setHeroAction('attack');
      addFloatingText(`+${scenario.xpReward} XP! HOMOLOGADO!`, 'text-emerald-400');
    } else {
      if (gameState.shieldUsedInCurrentQuestion) {
        sound.playShield();
        setHeroAction('shield');
        addFloatingText('ESCUDO ABSORVEU O DANO! 0 HP PERDIDO', 'text-cyan-300');
      } else {
        setHeroAction('hit');
        addFloatingText('-25 HP! BUG DETECTADO', 'text-rose-400');
      }
    }

    const timer = setTimeout(() => {
      setHeroAction('idle');
    }, 1800);

    return () => clearTimeout(timer);
  }, [hasAnswered, isCorrect]);

  const addFloatingText = (text: string, color: string) => {
    const id = Date.now();
    setFloatingText(prev => [...prev, { text, color, id }]);
    setTimeout(() => {
      setFloatingText(prev => prev.filter(item => item.id !== id));
    }, 2200);
  };

  const getStageIcon = (step: number) => {
    switch (step) {
      case 0:
        return <Truck className="w-6 h-6 text-emerald-400" />;
      case 1:
        return <FileCheck2 className="w-6 h-6 text-cyan-400" />;
      case 2:
        return <Scale className="w-6 h-6 text-amber-400" />;
      case 3:
        return <Truck className="w-6 h-6 text-blue-400" />;
      case 4:
        return <ThermometerSnowflake className="w-6 h-6 text-purple-400" />;
      case 5:
      default:
        return <Cpu className="w-6 h-6 text-rose-400" />;
    }
  };

  const renderStageVisualTarget = () => {
    switch (gameState.currentStep) {
      case 0: // Cattle Truck Weigh Station
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-32 sm:w-40 h-20 sm:h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl border-2 border-emerald-500/60 p-2 flex flex-col justify-between shadow-lg relative group">
              <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300">
                <span className="bg-emerald-950 px-1 rounded">BALANÇA 01</span>
                <span className="text-rose-400 animate-pulse font-bold">5.300 KG</span>
              </div>
              <div className="flex justify-center items-center py-1">
                <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 animate-bounce" />
              </div>
              <div className="text-[9px] font-mono text-center text-slate-300 bg-slate-950/70 rounded py-0.5">
                Caminhão Boi Vivo (PO: 5.000kg)
              </div>
              <div className="absolute -top-3 -right-2 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border border-rose-300 animate-pulse">
                +300kg !
              </div>
            </div>
            <div className="w-28 h-2 bg-emerald-500/30 rounded-full mt-1 blur-xs" />
          </div>
        );

      case 1: // Invoicing 3-Way Match
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-32 sm:w-40 h-20 sm:h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl border-2 border-cyan-500/60 p-2 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300">
                <span>XML NF-e</span>
                <span className="text-amber-400 font-bold">R$ 25/KG</span>
              </div>
              <div className="flex justify-center items-center py-1">
                <FileCheck2 className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
              </div>
              <div className="text-[9px] font-mono text-center text-slate-300 bg-slate-950/70 rounded py-0.5">
                PO: R$ 20/KG vs NF: R$ 25/KG
              </div>
            </div>
            <div className="w-28 h-2 bg-cyan-500/30 rounded-full mt-1 blur-xs" />
          </div>
        );

      case 2: // Accounting Ledger
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-32 sm:w-40 h-20 sm:h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl border-2 border-amber-500/60 p-2 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center text-[10px] font-mono text-amber-300">
                <span>RAZÃO FI</span>
                <span className="text-amber-400 font-bold">BKPF/BSEG</span>
              </div>
              <div className="flex justify-center items-center py-1">
                <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
              </div>
              <div className="text-[9px] font-mono text-center text-slate-300 bg-slate-950/70 rounded py-0.5">
                Débito (S) = Crédito (H)
              </div>
            </div>
            <div className="w-28 h-2 bg-amber-500/30 rounded-full mt-1 blur-xs" />
          </div>
        );

      case 3: // Order to Cash
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-32 sm:w-40 h-20 sm:h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl border-2 border-blue-500/60 p-2 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center text-[10px] font-mono text-blue-300">
                <span>EXPORT / O2C</span>
                <span className="text-emerald-400 font-bold">PICANHA</span>
              </div>
              <div className="flex justify-center items-center py-1">
                <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
              </div>
              <div className="text-[9px] font-mono text-center text-slate-300 bg-slate-950/70 rounded py-0.5">
                VA01 ➔ VL01N ➔ VF01
              </div>
            </div>
            <div className="w-28 h-2 bg-blue-500/30 rounded-full mt-1 blur-xs" />
          </div>
        );

      case 4: // SIF Cold Storage
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-32 sm:w-40 h-20 sm:h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-xl border-2 border-purple-500/60 p-2 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center text-[10px] font-mono text-purple-300">
                <span>SIF SANITÁRIO</span>
                <span className="text-rose-400 font-bold animate-pulse">11°C ALERTA</span>
              </div>
              <div className="flex justify-center items-center py-1">
                <ThermometerSnowflake className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
              </div>
              <div className="text-[9px] font-mono text-center text-slate-300 bg-slate-950/70 rounded py-0.5">
                Lote LOT-MB-2026-99
              </div>
            </div>
            <div className="w-28 h-2 bg-purple-500/30 rounded-full mt-1 blur-xs" />
          </div>
        );

      case 5: // Go-Live Boss
      default:
        return (
          <div className="relative flex flex-col items-center">
            <div className="w-32 sm:w-40 h-20 sm:h-24 bg-gradient-to-t from-rose-950 to-slate-900 rounded-xl border-2 border-rose-500 p-2 flex flex-col justify-between shadow-lg shadow-rose-950/50">
              <div className="flex justify-between items-center text-[10px] font-mono text-rose-300">
                <span className="animate-pulse">BOSS GO-LIVE</span>
                <span className="text-rose-400 font-bold">PRODUÇÃO</span>
              </div>
              <div className="flex justify-center items-center py-1">
                <Cpu className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400 animate-spin" />
              </div>
              <div className="text-[9px] font-mono text-center text-slate-300 bg-slate-950/70 rounded py-0.5">
                Segregação SoD & &SAP_EDIT
              </div>
            </div>
            <div className="w-28 h-2 bg-rose-500/30 rounded-full mt-1 blur-xs" />
          </div>
        );
    }
  };

  return (
    <div className="relative bg-slate-950 rounded-2xl border-2 border-cyan-500/40 p-4 sm:p-5 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Subtle retro scanlines overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 3px, 3px 100%'
        }}
      />

      {/* Arena Stage Header */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-rose-600 text-white tracking-wider shadow">
            ESTÁGIO {gameState.currentStep + 1} DE 6
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 tracking-wide">
            {scenario.module.split('-')[0].trim()}
          </span>
        </div>

        {/* Life hearts (4 hearts = 100%) */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 mr-1">VIDAS:</span>
          {[0, 1, 2, 3].map(heartIdx => {
            const heartThreshold = (heartIdx + 1) * 25;
            const isFull = gameState.hp >= heartThreshold;
            const isPartial = gameState.hp > heartIdx * 25 && gameState.hp < heartThreshold;
            return (
              <Heart
                key={heartIdx}
                className={`w-4 h-4 transition-transform ${
                  isFull
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : isPartial
                    ? 'text-rose-400 fill-rose-400/40 scale-90 animate-pulse'
                    : 'text-slate-700 scale-75'
                }`}
              />
            );
          })}
          <span className="text-xs font-mono font-bold text-rose-400 ml-1">{gameState.hp}%</span>
        </div>
      </div>

      {/* Floating Combat Text Container */}
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
        {floatingText.map(item => (
          <div
            key={item.id}
            className={`font-black font-mono text-base sm:text-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-bounce ${item.color}`}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Animated Arena Battle Field */}
      <div className="relative z-20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-xl border border-slate-800 p-4 sm:p-6 mb-4 flex items-center justify-between min-h-[140px] sm:min-h-[160px] overflow-hidden">
        {/* Background Cyber-Agro Factory Silhouette */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex justify-around items-end pb-1 font-mono text-[9px] text-cyan-400 select-none">
          <span>[FRIGORÍFICO MB-01]</span>
          <span>[ESTEIRA TRANSPORTADORA]</span>
          <span>[SISTEMA SIF 4512]</span>
        </div>

        {/* Hero Character (Inspector QA) */}
        <div
          className={`flex flex-col items-center transition-transform duration-300 relative ${
            heroAction === 'attack'
              ? 'translate-x-4 scale-110'
              : heroAction === 'hit'
              ? '-translate-x-3 rotate-6'
              : 'translate-x-0'
          }`}
        >
          {/* Hero Avatar / Sprite */}
          <div className="relative">
            {/* Hardhat / Cap */}
            <div className="w-12 h-4 bg-amber-400 rounded-t-full border border-amber-200 mx-auto -mb-1 shadow-sm flex items-center justify-center">
              <span className="text-[7px] font-black text-slate-900 font-mono">MB</span>
            </div>
            {/* Head */}
            <div className="w-10 h-10 bg-amber-200 rounded-lg mx-auto border border-amber-300 relative shadow flex items-center justify-center">
              {/* Eye safety glasses */}
              <div className="w-8 h-2.5 bg-cyan-400/80 rounded border border-cyan-200 shadow-sm" />
            </div>
            {/* Body with Reflective Vest */}
            <div className="w-12 h-10 bg-emerald-600 rounded-b-lg border border-emerald-400 mx-auto relative flex flex-col items-center justify-center">
              {/* Reflective stripes */}
              <div className="w-full h-1.5 bg-yellow-300/90 mb-1" />
              <div className="flex items-center gap-1 text-[8px] font-mono text-white font-bold">
                <span>QA</span>
              </div>
            </div>

            {/* Glowing Shield Aura if dump shield is active */}
            {gameState.powerUps.dumpShield && (
              <div className="absolute -inset-3 rounded-full border-2 border-cyan-400 animate-spin opacity-75" />
            )}
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-mono font-bold text-slate-200 block truncate max-w-[110px]">
              {rank.badge} {rank.title.split(' ')[0]}
            </span>
            <span className="text-[9px] font-mono text-cyan-400 block">QA Inspetor</span>
          </div>

          {/* Laser beam effect when attack */}
          {heroAction === 'attack' && (
            <div className="absolute left-14 top-8 w-40 sm:w-56 h-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent rounded-full shadow-[0_0_15px_#22c55e] animate-pulse z-40 flex items-center justify-end">
              <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-1 rounded -mr-3">
                HOMOLOGADO!
              </span>
            </div>
          )}
        </div>

        {/* Center Versus / Status Indicator */}
        <div className="flex flex-col items-center px-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-black text-cyan-400 shadow">
            VS
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
            Alvo de Teste
          </span>
        </div>

        {/* Target Stage Object / Bug Challenge */}
        {renderStageVisualTarget()}
      </div>

      {/* Power-Ups Action Bar */}
      <div className="relative z-20 bg-slate-900/80 rounded-xl border border-slate-800 p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-slate-200">POWER-UPS DE QA:</span>
        </div>

        <div className="flex items-center gap-2">
          {/* 50/50 Power-up */}
          <button
            type="button"
            disabled={hasAnswered || gameState.powerUps.fiftyFifty <= 0 || gameState.eliminatedOptions.length > 0}
            onClick={onUseFiftyFifty}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition border ${
              !hasAnswered && gameState.powerUps.fiftyFifty > 0 && gameState.eliminatedOptions.length === 0
                ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600 shadow-md cursor-pointer'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Elimina 2 alternativas incorretas deste teste"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>50 / 50</span>
            <span className="bg-amber-900/60 px-1 py-0.2 rounded text-[10px] text-amber-200">
              {gameState.powerUps.fiftyFifty}
            </span>
          </button>

          {/* Dump Shield Power-up */}
          <button
            type="button"
            disabled={hasAnswered || gameState.powerUps.dumpShield}
            onClick={onActivateShield}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition border ${
              gameState.powerUps.dumpShield
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] cursor-default'
                : !hasAnswered
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700 cursor-pointer'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Escudo de DUMP: Protege contra a perda de HP se você errar!"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>{gameState.powerUps.dumpShield ? 'Escudo Ativo' : 'Ativar Escudo'}</span>
          </button>

          {/* Senior Tech Lead Hint */}
          <button
            type="button"
            disabled={hasAnswered || gameState.powerUps.seniorHint <= 0 || Boolean(gameState.activeSeniorHint)}
            onClick={onUseSeniorHint}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition border ${
              !hasAnswered && gameState.powerUps.seniorHint > 0 && !gameState.activeSeniorHint
                ? 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border-purple-600 shadow-md cursor-pointer'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Dica do Tech Lead: revela insight do SAP para esta questão"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Dica Tech Lead</span>
            <span className="bg-purple-900/60 px-1 py-0.2 rounded text-[10px] text-purple-200">
              {gameState.powerUps.seniorHint}
            </span>
          </button>
        </div>
      </div>

      {/* Senior Tech Lead Hint Alert if activated */}
      {gameState.activeSeniorHint && (
        <div className="mt-3 p-3 bg-purple-950/60 border border-purple-600/70 rounded-xl text-xs font-mono text-purple-200 flex items-start gap-2 animate-fadeIn">
          <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase text-purple-300">Dica do Tech Lead Masterboi:</span>{' '}
            {gameState.activeSeniorHint}
          </div>
        </div>
      )}
    </div>
  );
};
