import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Database,
  MapPin,
  Sparkles,
  Terminal
} from 'lucide-react';
import { Scenario, ScenarioOption } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface ScenarioCardProps {
  scenario: Scenario;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  isLastScenario: boolean;
  onOpenSimulatorForTCode?: (tcode: string) => void;
  eliminatedOptions?: number[];
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  selectedOptionIndex,
  onSelectOption,
  onNext,
  isLastScenario,
  onOpenSimulatorForTCode,
  eliminatedOptions = []
}) => {
  const [showPayload, setShowPayload] = useState(false);

  // Keyboard shortcut listener for A, B, C, D and Enter/Space for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      if (selectedOptionIndex === null) {
        if (key === 'A') onSelectOption(0);
        else if (key === 'B') onSelectOption(1);
        else if (key === 'C') onSelectOption(2);
        else if (key === 'D') onSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOptionIndex, onSelectOption, onNext]);

  const hasAnswered = selectedOptionIndex !== null;
  const chosenOption: ScenarioOption | null =
    selectedOptionIndex !== null ? scenario.options[selectedOptionIndex] : null;

  const getModuleBadgeColor = (moduleText: string) => {
    if (moduleText.includes('MM')) return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80';
    if (moduleText.includes('SD')) return 'bg-cyan-950/80 text-cyan-400 border-cyan-700/80';
    if (moduleText.includes('FI')) return 'bg-amber-950/80 text-amber-400 border-amber-700/80';
    if (moduleText.includes('QM')) return 'bg-purple-950/80 text-purple-400 border-purple-700/80';
    return 'bg-rose-950/80 text-rose-400 border-rose-700/80';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-2xl transition-all">
      {/* Top Bar: Plant location + Module tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wide border shadow-sm ${getModuleBadgeColor(
              scenario.module
            )}`}
          >
            {scenario.module}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            {scenario.plantLocation}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Dificuldade: <strong className="text-cyan-400">{scenario.difficulty}</strong>
          </span>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-semibold">
            +{scenario.xpReward} XP
          </span>
        </div>
      </div>

      {/* Scenario Title & Narrative */}
      <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight mb-3">
        {scenario.title}
      </h2>

      <div
        className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 font-normal bg-slate-950/50 p-4 rounded-lg border border-slate-800/80"
        dangerouslySetInnerHTML={{ __html: scenario.desc }}
      />

      {/* Interactive SAP Document / Payload Drawer */}
      {scenario.sapDocSample && (
        <div className="mb-5 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => {
              sound.playKeyClick();
              setShowPayload(!showPayload);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono text-cyan-400 bg-slate-900/90 hover:bg-slate-900 transition text-left"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Inspecionar Registro do SAP ({scenario.sapDocSample.title})</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              {showPayload ? (
                <>
                  <span>Ocultar</span> <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Ver Campos</span> <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </span>
          </button>

          {showPayload && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {Object.entries(scenario.sapDocSample.fields).map(([k, v]) => (
                  <div key={k} className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px] uppercase">{k}</span>
                    <span className="text-cyan-300 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              {scenario.recommendedTCode && onOpenSimulatorForTCode && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">
                    Deseja testar diretamente no simulador gráfico?
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenSimulatorForTCode(scenario.recommendedTCode!)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 transition"
                  >
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    Abrir T-Code /{scenario.recommendedTCode}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Options Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
          <span>Selecione a ação ou diagnóstico correto de QA:</span>
          <span className="hidden sm:inline text-slate-400">Use teclado: [A] [B] [C] [D]</span>
        </div>

        {scenario.options.map((option, idx) => {
          const letter = ['A', 'B', 'C', 'D'][idx];
          const isSelected = selectedOptionIndex === idx;
          const isThisCorrect = option.correct;
          const isEliminated = eliminatedOptions.includes(idx);

          let btnStyles =
            'border-slate-700/80 bg-slate-950/60 hover:bg-slate-800 hover:border-cyan-500/60 text-slate-200';

          if (isEliminated) {
            btnStyles = 'border-slate-800 bg-slate-950/20 text-slate-600 line-through opacity-40 cursor-not-allowed';
          } else if (hasAnswered) {
            if (isThisCorrect) {
              btnStyles = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md shadow-emerald-950/50';
            } else if (isSelected && !isThisCorrect) {
              btnStyles = 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-md shadow-rose-950/50';
            } else {
              btnStyles = 'border-slate-800 bg-slate-950/30 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasAnswered || isEliminated}
              onClick={() => onSelectOption(idx)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 group relative ${btnStyles} ${
                !hasAnswered && !isEliminated ? 'cursor-pointer hover:translate-x-1' : 'cursor-default'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 transition ${
                  isEliminated
                    ? 'bg-slate-900 text-slate-600 line-through'
                    : hasAnswered && isThisCorrect
                    ? 'bg-emerald-500 text-slate-950'
                    : hasAnswered && isSelected && !isThisCorrect
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-600 group-hover:text-white'
                }`}
              >
                {letter}
              </div>

              <div className="flex-1 text-sm sm:text-base font-normal leading-snug">
                {option.text.replace(/^[A-D]\)\s*/, '')}
                {isEliminated && (
                  <span className="block text-[10px] font-mono text-amber-500/90 no-underline mt-0.5">
                    ⛔ Eliminado pelo 50/50
                  </span>
                )}
              </div>

              {hasAnswered && isThisCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
              )}
              {hasAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Panel */}
      {hasAnswered && chosenOption && (
        <div
          className={`mt-6 p-4 sm:p-5 rounded-xl border text-sm leading-relaxed transition-all animate-fadeIn ${
            chosenOption.correct
              ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200'
              : 'bg-rose-950/60 border-rose-600/70 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {chosenOption.correct ? (
              <div className="p-2 rounded-lg bg-emerald-900/80 text-emerald-300 shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-rose-900/80 text-rose-300 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                {chosenOption.correct ? (
                  <>
                    <span>SUCESSO NO CASO DE TESTE!</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-800 text-emerald-100 font-mono font-normal">
                      PASS
                    </span>
                  </>
                ) : (
                  <>
                    <span>FALHA DE HOMOLOGAÇÃO (BUG VAZOU PARA PRODUÇÃO)!</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-800 text-rose-100 font-mono font-normal">
                      FAIL (-25% HP)
                    </span>
                  </>
                )}
              </h4>
              <p className="text-slate-200 text-sm mb-2">{chosenOption.note}</p>

              {chosenOption.technicalDetail && (
                <div className="mt-2.5 pt-2.5 border-t border-emerald-800/40 text-xs font-mono text-emerald-300/90 flex items-start gap-2 bg-slate-950/40 p-2.5 rounded">
                  <Database className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-400 uppercase tracking-wide">
                      Detalhamento Técnico SAP:
                    </span>{' '}
                    {chosenOption.technicalDetail}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action to advance */}
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Pressione <strong className="text-cyan-400">[Enter]</strong> ou{' '}
              <strong className="text-cyan-400">[Espaço]</strong> para prosseguir
            </span>

            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-semibold text-sm shadow-lg transition-all"
            >
              <span>{isLastScenario ? 'Ver Relatório de Homologação' : 'Próximo Desafio QA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
