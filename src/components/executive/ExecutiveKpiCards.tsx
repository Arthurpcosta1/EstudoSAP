import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { GameState, getCareerRank, getNextRankProgress } from '../../game/rules.ts';

interface ExecutiveKpiCardsProps {
  gameState: GameState;
  totalScenarios: number;
}

export const ExecutiveKpiCards: React.FC<ExecutiveKpiCardsProps> = ({
  gameState,
  totalScenarios
}) => {
  const rank = getCareerRank(gameState.xp);
  const { progressPercent } = getNextRankProgress(gameState.xp);

  const completedCount = gameState.currentStep;
  const criticalRiskCount = gameState.hp < 50 ? 1 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. TOTAL DE CENÁRIOS SAP */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            TOTAL DE CENÁRIOS SAP
          </span>
          <div className="text-3xl font-extrabold text-gray-950 mt-1">
            {totalScenarios}
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            5 módulos auditados (MM, SD, FI, QM, BASIS)
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
          <Briefcase className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* 2. CONCLUÍDOS / HOMOLOGADOS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            CONCLUÍDOS / APROVADOS
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">
            {completedCount}
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            no ciclo de homologação QAS
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 3. INTEGRIDADE DO SISTEMA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            INTEGRIDADE DO SISTEMA
          </span>
          <div
            className={`text-3xl font-extrabold mt-1 ${
              gameState.hp > 60
                ? 'text-[#0284c7]'
                : gameState.hp > 30
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          >
            {gameState.hp}%
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            {gameState.hp > 50 ? 'ambiente QAS estável' : 'alto risco de regressão'}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 4. QA XP ACUMULADO */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            QA XP ACUMULADO
          </span>
          <div className="text-3xl font-extrabold text-[#c2410c] mt-1">
            {gameState.xp} <span className="text-base font-medium text-gray-500">pts</span>
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            {gameState.streak > 1 ? `combo ativo: +${Math.min(50, (gameState.streak - 1) * 10)} XP` : 'pontuação de qualidade'}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#c2410c] shrink-0">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      {/* 5. NÍVEL PROFISSIONAL / PROGRESSO */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            NÍVEL PROFISSIONAL
          </span>
          <div className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-1.5">
            <span>{rank.badge}</span>
            <span className="truncate max-w-[170px]">{rank.title}</span>
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            {progressPercent}% até próximo nível
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* 6. CRÍTICOS / FALHAS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            CRÍTICOS / DUMPS
          </span>
          <div
            className={`text-3xl font-extrabold mt-1 ${
              criticalRiskCount > 0 ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {criticalRiskCount}
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            {criticalRiskCount > 0 ? '1 aviso em atenção' : '0 bloqueios de produção'}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
