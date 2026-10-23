import React from 'react';
import { ShieldCheck, ShieldAlert, Award, Flame, Zap, CheckCircle2 } from 'lucide-react';
import { getNextRankProgress, ALL_BADGES } from '../game/rules.ts';

interface PlayerHudProps {
  hp: number;
  xp: number;
  streak: number;
  currentStep: number;
  totalSteps: number;
  earnedBadges: string[];
}

export const PlayerHud: React.FC<PlayerHudProps> = ({
  hp,
  xp,
  streak,
  currentStep,
  totalSteps,
  earnedBadges
}) => {
  const { currentRank, nextRank, progressPercent } = getNextRankProgress(xp);

  const getHpColor = () => {
    if (hp > 60) return 'text-emerald-400 bg-emerald-500';
    if (hp > 30) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500 animate-pulse';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: System Integrity (HP) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              {hp > 30 ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              )}
              Integridade do Sistema
            </span>
            <span className={`text-base font-mono font-bold ${hp > 60 ? 'text-emerald-400' : hp > 30 ? 'text-amber-400' : 'text-rose-400'}`}>
              {hp}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getHpColor().split(' ')[1]}`}
              style={{ width: `${hp}%` }}
            />
          </div>
          {hp <= 30 && (
            <p className="text-[10px] text-rose-400 font-mono mt-1 font-semibold flex items-center gap-1">
              ⚠️ Risco de DUMP crítico em Produção!
            </p>
          )}
        </div>

        {/* Metric 2: QA XP & Streak */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              QA XP Acumulado
            </span>
            {streak > 1 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400 animate-bounce" />
                {streak}x Combo
              </span>
            )}
          </div>
          <div className="text-xl font-mono font-black text-amber-400 mt-1">
            {xp} <span className="text-xs font-normal text-amber-500/80">pts</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            {streak > 1 ? `Bônus ativo: +${Math.min(50, (streak - 1) * 10)} XP por acerto` : 'Acerte consecutivamente para bônus de XP'}
          </div>
        </div>

        {/* Metric 3: Career Level & Rank */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              Nível Profissional
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">
              Nv. {currentRank.level}
            </span>
          </div>
          <div className="text-sm font-semibold text-purple-300 mt-0.5 truncate flex items-center gap-1.5">
            <span>{currentRank.badge}</span>
            <span className="truncate">{currentRank.title}</span>
          </div>
          <div className="mt-1.5">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>{xp} XP</span>
              <span>{nextRank ? `${nextRank.minXp} XP (${nextRank.title.split(' ')[0]})` : 'Nível Máximo'}</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Test Progress & Badges */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Sessão de Testes
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto py-0.5">
            {ALL_BADGES.map(badge => {
              const isEarned = earnedBadges.includes(badge.id);
              return (
                <span
                  key={badge.id}
                  title={`${badge.name}: ${badge.desc} (${isEarned ? 'Desbloqueado' : 'Bloqueado'})`}
                  className={`text-sm px-1.5 py-0.5 rounded cursor-help border transition-all ${
                    isEarned
                      ? 'bg-slate-800 border-cyan-500/60 shadow-sm scale-105'
                      : 'bg-slate-950/40 border-slate-800 opacity-30 grayscale'
                  }`}
                >
                  {badge.icon}
                </span>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            {earnedBadges.length} de {ALL_BADGES.length} conquistas liberadas
          </p>
        </div>
      </div>
    </div>
  );
};
