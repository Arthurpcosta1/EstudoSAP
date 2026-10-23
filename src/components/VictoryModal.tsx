import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { GameState, getCareerRank, ALL_BADGES } from '../game/rules.ts';

interface VictoryModalProps {
  state: GameState;
  totalQuestions: number;
  onRestart: () => void;
  onOpenTerminal: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  state,
  totalQuestions,
  onRestart,
  onOpenTerminal
}) => {
  const [copied, setCopied] = useState(false);
  const rank = getCareerRank(state.xp);
  const correctCount = state.answers.filter(a => a.correct).length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const handleCopyReport = () => {
    const report = `🏆 LAUDO DE HOMOLOGAÇÃO SAP - MASTERBOI EDITION 🏆
Candidato / Analista: QA Masterboi
Nível Alcançado: ${rank.title} (Nv. ${rank.level})
QA XP Final: ${state.xp} pts
Integridade do QAS: ${state.hp}%
Casos de Teste Aprovados: ${correctCount} de ${totalQuestions} (${accuracy}%)
Conquistas: ${state.earnedBadges.length} desbloqueadas
Módulos Homologados: SAP MM, SD, FI, QM, BASIS
Status: HOMOLOGAÇÃO APROVADA PARA GO-LIVE!`;

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Certificate Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 px-6 py-6 border-b border-emerald-700/60 text-center relative">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-3 shadow-lg">
            <Award className="w-10 h-10" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase block mb-1">
            CERTIFICADO OFICIAL DE HOMOLOGAÇÃO QAS
          </span>
          <h2 id="victory-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white">
            HOMOLOGAÇÃO CONCLUÍDA COM SUCESSO!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto">
            Você validou com êxito os processos críticos da cadeia de suprimentos da Masterboi (MM, SD, FI, QM e BASIS).
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Stats Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Nível Alcançado</span>
              <span className="text-lg font-bold text-purple-400 font-mono mt-0.5 block">{rank.badge} Nv.{rank.level}</span>
              <span className="text-[11px] text-slate-300 truncate block">{rank.title.split(' ')[0]}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">QA XP Total</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">{state.xp}</span>
              <span className="text-[11px] text-slate-400 block">pontos</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Integridade</span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">{state.hp}%</span>
              <span className="text-[11px] text-slate-400 block">QAS Estável</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Acurácia</span>
              <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">{accuracy}%</span>
              <span className="text-[11px] text-slate-400 block">{correctCount}/{totalQuestions} aprovados</span>
            </div>
          </div>

          {/* Rank Recognition */}
          <div className="bg-gradient-to-r from-purple-950/40 to-slate-950 p-4 rounded-xl border border-purple-800/50 flex items-center gap-4">
            <div className="text-3xl">{rank.badge}</div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                Promovido oficialmente para:
              </span>
              <h3 className="text-lg font-bold text-white">{rank.title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{rank.description}</p>
            </div>
          </div>

          {/* Badges Earned */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Conquistas Desbloqueadas ({state.earnedBadges.length}/{ALL_BADGES.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_BADGES.map(badge => {
                const unlocked = state.earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                      unlocked
                        ? 'bg-slate-950/90 border-emerald-600/50 text-slate-200'
                        : 'bg-slate-950/30 border-slate-800/40 text-slate-600 opacity-40'
                    }`}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{badge.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{badge.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Laudo Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Laudo de QA</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenTerminal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Explorar Sandbox</span>
            </button>

            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
