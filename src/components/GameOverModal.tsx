import React from 'react';
import { AlertOctagon, RotateCcw, HelpCircle, ShieldAlert, BookOpen } from 'lucide-react';
import { GameState } from '../game/rules.ts';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
  onOpenGlossary: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  onRestart,
  onOpenGlossary
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-center space-y-5">
        <div className="inline-flex p-4 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 animate-pulse">
          <AlertOctagon className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase block mb-1">
            INTEGRIDADE DO SISTEMA ATINGIU 0%
          </span>
          <h2 id="game-over-title" className="text-2xl font-black text-white">
            DUMP CRÍTICO EM PRODUÇÃO!
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Múltiplos bugs graves vazaram da esteira de testes de homologação (QAS) para o ambiente produtivo (PRD). O faturamento de carnes ou recebimento na portaria foi paralisado!
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-2">
          <div className="text-slate-400 flex items-center justify-between">
            <span>QA XP Acumulado:</span>
            <span className="text-amber-400 font-bold">{state.xp} pts</span>
          </div>
          <div className="text-slate-400 flex items-center justify-between">
            <span>Bugs Críticos Vazados:</span>
            <span className="text-rose-400 font-bold">4 incidentes P1</span>
          </div>
          <div className="text-slate-400 flex items-center justify-between">
            <span>Impacto no Negócio:</span>
            <span className="text-rose-300">Fila na Balança & Glosa Fiscal</span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Revise os conceitos de <strong>3-Way Matching</strong>, tabelas de controle e regras de movimentação física do SAP antes de reiniciar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenGlossary}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Consultar Guia SAP</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar QAS & Tentar de Novo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
