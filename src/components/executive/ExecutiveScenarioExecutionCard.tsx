import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Lightbulb,
  Terminal,
  Database,
  Building
} from 'lucide-react';
import { Scenario, ScenarioOption, GameState } from '../../game/rules.ts';

interface ExecutiveScenarioExecutionCardProps {
  scenario: Scenario;
  gameState: GameState;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  isLastScenario: boolean;
  onOpenSimulatorForTCode?: (tcode: string) => void;
  onUseFiftyFifty: () => void;
  onUseSeniorHint: () => void;
  onActivateShield: () => void;
}

export const ExecutiveScenarioExecutionCard: React.FC<ExecutiveScenarioExecutionCardProps> = ({
  scenario,
  gameState,
  selectedOptionIndex,
  onSelectOption,
  onNext,
  isLastScenario,
  onOpenSimulatorForTCode,
  onUseFiftyFifty,
  onUseSeniorHint,
  onActivateShield
}) => {
  const [showPayload, setShowPayload] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 sm:p-7 space-y-5 font-sans">
      {/* Top Header: Breadcrumb / Area + Plant Location + Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-red-50 text-[#ba0c2f] font-bold text-xs px-2.5 py-1 rounded-md border border-red-200">
            {scenario.module}
          </span>
          <span className="text-gray-400 font-sans text-xs">•</span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#ba0c2f]" />
            {scenario.plantLocation}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full font-medium">
            Complexidade: <strong className="text-gray-800">{scenario.difficulty}</strong>
          </span>
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
            +{scenario.xpReward} XP
          </span>
        </div>
      </div>

      {/* Main Scenario Title & Business Description */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight">
          {scenario.title}
        </h2>
        <div className="mt-2.5 p-4 rounded-xl bg-[#f8f9fa] border border-gray-200/80 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
          {scenario.desc
            .split(/<br\s*[\/]?>/gi)
            .filter(p => p.trim().length > 0)
            .map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className={pIdx > 0 ? 'mt-2.5 font-semibold text-gray-900 border-t border-gray-200/60 pt-2' : ''}
              >
                {paragraph}
              </p>
            ))}
        </div>
      </div>

      {/* Senior Hint Box if active */}
      {gameState.activeSeniorHint && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950 animate-fadeIn">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-900 mb-0.5">
              💡 Parecer Técnico do Tech Lead Masterboi:
            </span>
            <p className="leading-relaxed">{gameState.activeSeniorHint}</p>
          </div>
        </div>
      )}

      {/* Collapsible SAP Technical Payload Drawer */}
      {scenario.sapDocSample && (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setShowPayload(!showPayload)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Database className="w-3.5 h-3.5 text-[#ba0c2f]" />
              <span>Inspecionar Registro SAP ({scenario.sapDocSample.title})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{showPayload ? 'Ocultar campos' : 'Ver campos'}</span>
              {showPayload ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showPayload && (
            <div className="p-4 bg-white border-t border-gray-200 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {Object.entries(scenario.sapDocSample.fields).map(([k, v]) => (
                  <div key={k} className="p-2 rounded bg-gray-50 border border-gray-200/80">
                    <span className="font-mono text-[10px] text-gray-500 block">{k}</span>
                    <span className="font-mono text-xs font-bold text-gray-900 truncate block">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              {onOpenSimulatorForTCode && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onOpenSimulatorForTCode(scenario.recommendedTCode || 'MIGO')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#ba0c2f] bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Abrir Simulador {scenario.recommendedTCode}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Executive Decision Options (A, B, C, D) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Selecione a ação ou diagnóstico correto de QA:</span>
          <span className="text-[11px] text-gray-400">Atalhos: [A] [B] [C] [D]</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {scenario.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isEliminated = gameState.eliminatedOptions.includes(index);
            const isSelected = selectedOptionIndex === index;

            let optionStyle = 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800';

            if (isEliminated) {
              optionStyle = 'bg-gray-100 border-gray-200 text-gray-400 opacity-40 line-through cursor-not-allowed';
            } else if (hasAnswered) {
              if (option.correct) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500';
              } else if (isSelected) {
                optionStyle = 'bg-red-50 border-red-500 text-red-950 ring-1 ring-red-500';
              } else {
                optionStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'bg-red-50 border-[#ba0c2f] text-gray-950 ring-2 ring-[#ba0c2f]/20';
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={hasAnswered || isEliminated}
                onClick={() => onSelectOption(index)}
                className={`w-full p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${optionStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#ba0c2f] text-white'
                      : option.correct && hasAnswered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {letter}
                </span>

                <div className="flex-1 text-sm font-medium leading-snug">
                  {option.text.replace(/^[A-D]\)\s*/i, '')}
                </div>

                {hasAnswered && (
                  <div className="shrink-0 mt-0.5">
                    {option.correct ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback / Audit Result Box */}
      {hasAnswered && chosenOption && (
        <div
          className={`p-4 sm:p-5 rounded-xl border animate-fadeIn ${
            chosenOption.correct
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-red-50/80 border-red-300 text-red-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {chosenOption.correct ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-sm">
                {chosenOption.correct
                  ? 'Homologação Aprovada! Cenário Validado com Sucesso.'
                  : 'Falha de Homologação Detectada (Risco de DUMP/Inconsistência).'}
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                {chosenOption.note}
              </p>
              {chosenOption.technicalDetail && (
                <div className="mt-2 pt-2 border-t border-black/10 text-xs font-mono">
                  <strong>Detalhamento Técnico:</strong> {chosenOption.technicalDetail}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-2.5 bg-[#ba0c2f] hover:bg-[#9c0a27] text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition transform active:scale-95"
            >
              <span>{isLastScenario ? 'Concluir Homologação' : 'Próximo Cenário'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Power-ups Toolbar styled for Masterboi Executive Mode */}
      <div className="bg-[#f8f9fa] border border-gray-200/90 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ba0c2f]" />
          Recursos de Homologação Executiva:
        </span>

        <div className="flex items-center gap-2">
          {/* 50/50 */}
          <button
            type="button"
            disabled={hasAnswered || gameState.powerUps.fiftyFifty <= 0 || gameState.eliminatedOptions.length > 0}
            onClick={onUseFiftyFifty}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 shadow-sm flex items-center gap-1.5 transition"
            title="Eliminar 2 opções incorretas"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>50/50 ({gameState.powerUps.fiftyFifty})</span>
          </button>

          {/* Dump Shield */}
          <button
            type="button"
            disabled={hasAnswered || gameState.powerUps.dumpShield}
            onClick={onActivateShield}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm flex items-center gap-1.5 transition ${
              gameState.powerUps.dumpShield
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40'
            }`}
            title="Proteger integridade do sistema contra perda de HP"
          >
            <Shield className="w-3.5 h-3.5 text-sky-500" />
            <span>{gameState.powerUps.dumpShield ? 'Escudo Ativo' : 'Escudo DUMP'}</span>
          </button>

          {/* Senior Tech Lead Hint */}
          <button
            type="button"
            disabled={hasAnswered || gameState.powerUps.seniorHint <= 0 || Boolean(gameState.activeSeniorHint)}
            onClick={onUseSeniorHint}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 shadow-sm flex items-center gap-1.5 transition"
            title="Parecer técnico com recomendação"
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
            <span>Dica Tech Lead ({gameState.powerUps.seniorHint})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
