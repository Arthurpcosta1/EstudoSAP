import React, { useState } from 'react';
import { Volume2, VolumeX, Terminal, BookOpen, RotateCcw, Cpu, Gamepad2 } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface HeaderStatusBarProps {
  onOpenTerminal: (initialCode?: string) => void;
  onOpenGlossary: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTheme: () => void;
}

export const HeaderStatusBar: React.FC<HeaderStatusBarProps> = ({
  onOpenTerminal,
  onOpenGlossary,
  onReset,
  isMuted,
  onToggleMute,
  onToggleTheme
}) => {
  const [commandInput, setCommandInput] = useState('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playKeyClick();
    const clean = commandInput.trim().toUpperCase();
    if (!clean) return;
    const tcode = clean.startsWith('/N') ? clean.replace('/N', '').trim() : clean;
    onOpenTerminal(tcode);
    setCommandInput('');
  };

  return (
    <header className="border-b border-slate-700/80 bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2.5 sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Brand, System and Quick Actions Top Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-rose-600 text-white font-extrabold text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded tracking-wider shadow-sm">
              MASTERBOI
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
              <span className="font-semibold">SAP QAS-100</span>
              <span className="text-slate-500 hidden sm:inline">/ Mandante 300</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
              MODO EXECUTIVO / CORP
            </span>
          </div>

          {/* Mobile action bar */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              data-testid="mobile-toggle-modo-gamer-btn"
              onClick={onToggleTheme}
              className="px-2 py-1 rounded text-[11px] font-bold bg-gradient-to-r from-rose-600 to-amber-600 text-white border border-rose-400 shadow flex items-center gap-1"
              title="Mudar para Modo Gamer"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>GAMER</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenTerminal()}
              className="p-1.5 rounded text-xs bg-slate-800 text-cyan-400 border border-slate-700"
              title="Terminal T-Codes"
              aria-label="Abrir Terminal T-Codes"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenGlossary}
              className="p-1.5 rounded text-xs bg-slate-800 text-amber-400 border border-slate-700"
              title="Guia SAP"
              aria-label="Abrir Guia SAP"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700"
              title={isMuted ? 'Ativar Som' : 'Silenciar'}
              aria-label={isMuted ? 'Ativar Som' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700"
              title="Reiniciar"
              aria-label="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command bar / Quick T-Code runner */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 flex-1 sm:w-64">
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs select-none">
                /n
              </span>
              <input
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                placeholder="T-Code (ex: MIGO, SE16N)..."
                aria-label="Linha de comando SAP T-Code"
                className="w-full pl-8 pr-2 py-1 text-xs font-mono bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              title="Executar Transação SAP"
              className="px-2.5 py-1 text-xs bg-cyan-700 hover:bg-cyan-600 text-white font-mono rounded transition shrink-0 shadow"
            >
              OK
            </button>
          </form>

          {/* Desktop action buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              data-testid="toggle-modo-gamer-btn"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white border border-rose-400 shadow transition animate-pulse"
              title="Alternar para o Modo Gamer 16-Bit Pixel Art"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>🎮 MODO GAMER</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenTerminal()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Abrir Simulador de Transações SAP"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulador</span>
            </button>

            <button
              type="button"
              onClick={onOpenGlossary}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Dicionário de Tabelas & T-Codes SAP"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Guia SAP</span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Sons'}
              aria-label={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Sons'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Reiniciar Simulado"
              aria-label="Reiniciar Simulado"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
