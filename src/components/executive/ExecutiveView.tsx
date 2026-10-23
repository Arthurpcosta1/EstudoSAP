import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Filter,
  ChevronDown,
  Layers,
  BarChart3,
  TrendingUp,
  Gamepad2,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Scenario, GameState, MASTERBOI_SCENARIOS } from '../../game/rules.ts';
import { ExecutiveHeader } from './ExecutiveHeader.tsx';
import { ExecutiveKpiCards } from './ExecutiveKpiCards.tsx';
import { ExecutiveCompositionAndDepts } from './ExecutiveCompositionAndDepts.tsx';
import { ExecutiveScenarioExecutionCard } from './ExecutiveScenarioExecutionCard.tsx';

interface ExecutiveViewProps {
  gameState: GameState;
  currentScenario: Scenario;
  selectedOptionIndex: number | null;
  isLastScenario: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTheme: () => void;
  onResetGame: () => void;
  onSelectOption: (index: number) => void;
  onNextQuestion: () => void;
  onOpenTerminal: (initialCode?: string) => void;
  onOpenGlossary: () => void;
  onUseFiftyFifty: () => void;
  onUseSeniorHint: () => void;
  onActivateShield: () => void;
}

export const ExecutiveView: React.FC<ExecutiveViewProps> = ({
  gameState,
  currentScenario,
  selectedOptionIndex,
  isLastScenario,
  isMuted,
  onToggleMute,
  onToggleTheme,
  onResetGame,
  onSelectOption,
  onNextQuestion,
  onOpenTerminal,
  onOpenGlossary,
  onUseFiftyFifty,
  onUseSeniorHint,
  onActivateShield
}) => {
  const [activeTab, setActiveTab] = useState<'executiva' | 'gerencial'>('executiva');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExportNotice(`Relatório ${format} gerado com sucesso!`);
    setTimeout(() => setExportNotice(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col font-sans select-none selection:bg-[#ba0c2f] selection:text-white">
      {/* 1. Masterboi Corporate Top Header */}
      <ExecutiveHeader
        onOpenTerminal={onOpenTerminal}
        onOpenGlossary={onOpenGlossary}
        onReset={onResetGame}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Export Feedback notification if triggered */}
        {exportNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {exportNotice}
            </span>
          </div>
        )}

        {/* 2. Top Title & Actions Bar matching Screenshot 1 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              <span>PMO · HOMOLOGAÇÃO SAP S/4HANA</span>
              <span>•</span>
              <span className="text-[#ba0c2f] font-bold">MODO EXECUTIVO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Portfólio de Projetos & QA SAP
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {MASTERBOI_SCENARIOS.length} cenários críticos · 5 módulos SAP (MM, SD, FI, QM, BASIS) · Unidades Frigoríficas Masterboi
            </p>
          </div>

          {/* Right Action buttons matching Screenshot 1 */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleExport('PDF')}
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Exportar PDF</span>
            </button>

            <button
              type="button"
              onClick={() => handleExport('Excel')}
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-gray-500" />
              <span>Exportar Excel</span>
            </button>

            {/* Red button: Novo projeto / Ativar Modo Gamer */}
            <button
              type="button"
              data-testid="banner-toggle-gamer-btn"
              onClick={onToggleTheme}
              className="px-4 py-2 bg-[#ba0c2f] hover:bg-[#9c0a27] text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2"
              title="Alternar para a visualização Modo Gamer 16-Bit"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>🎮 MODO GAMER</span>
            </button>
          </div>
        </div>

        {/* 3. View Switcher Tabs & Filters matching Screenshot 1 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          {/* Segmented view switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('executiva')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'executiva'
                  ? 'bg-white text-[#ba0c2f] border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#ba0c2f]" />
              <span>📈 Visão Executiva</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gerencial')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'gerencial'
                  ? 'bg-white text-[#ba0c2f] border border-red-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
              <span>📊 Visão Gerencial</span>
            </button>
          </div>

          {/* Filter dropdowns matching Screenshot 1 */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 shadow-xs cursor-pointer hover:border-gray-300">
              <span className="text-gray-400">Status:</span>
              <span className="font-semibold text-gray-800">Todos os status</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 shadow-xs cursor-pointer hover:border-gray-300">
              <span className="text-gray-400">Área:</span>
              <span className="font-semibold text-gray-800">Frigoríficos Masterboi</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2 shadow-xs cursor-pointer hover:border-gray-300">
              <span className="text-gray-400">Módulo:</span>
              <span className="font-semibold text-gray-800">SAP MM, SD, FI, QM</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 4. The 6 KPI Metric Cards matching Screenshot 1 */}
        <ExecutiveKpiCards
          gameState={gameState}
          totalScenarios={MASTERBOI_SCENARIOS.length}
        />

        {/* 5. Composition Bar & Departmental Cards matching Screenshot 1 and 2 */}
        <ExecutiveCompositionAndDepts
          currentScenario={currentScenario}
          currentStep={gameState.currentStep}
          totalSteps={MASTERBOI_SCENARIOS.length}
        />

        {/* 6. Active Interactive QA Test Scenario Card */}
        {!gameState.isFinished && gameState.hp > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  HOMOLOGAÇÃO ATIVA · CASO DE TESTE {gameState.currentStep + 1} DE {MASTERBOI_SCENARIOS.length}
                </span>
                <span className="bg-red-50 text-[#ba0c2f] text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  S/4HANA QAS-100
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                Mandante 300 / Produção Segura
              </span>
            </div>

            <ExecutiveScenarioExecutionCard
              scenario={currentScenario}
              gameState={gameState}
              selectedOptionIndex={selectedOptionIndex}
              onSelectOption={onSelectOption}
              onNext={onNextQuestion}
              isLastScenario={isLastScenario}
              onOpenSimulatorForTCode={onOpenTerminal}
              onUseFiftyFifty={onUseFiftyFifty}
              onUseSeniorHint={onUseSeniorHint}
              onActivateShield={onActivateShield}
            />
          </div>
        )}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">Masterboi S/A</span>
            <span>— Departamento de TI & Qualidade de Software (QA)</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Ambiente: SAP QAS-100</span>
            <span>Versão: S/4HANA 2026</span>
            <span>Auditoria: SIF / Ministério da Agricultura</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
