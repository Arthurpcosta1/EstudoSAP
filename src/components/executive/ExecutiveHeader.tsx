import React, { useState } from 'react';
import {
  Search,
  Volume2,
  VolumeX,
  RotateCcw,
  Terminal,
  BookOpen,
  Gamepad2,
  Bell,
  Check
} from 'lucide-react';
import { MasterboiLogo } from './MasterboiLogo.tsx';

interface ExecutiveHeaderProps {
  onOpenTerminal: (initialCode?: string) => void;
  onOpenGlossary: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTheme: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  onOpenTerminal,
  onOpenGlossary,
  onReset,
  isMuted,
  onToggleMute,
  onToggleTheme,
  activeNavTab = 'portfolio',
  onSelectNavTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchFeedback, setShowSearchFeedback] = useState(false);

  const navItems = [
    { id: 'portfolio', label: 'Portfólio' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'status', label: 'Status Semanal' },
    { id: 'interacoes', label: 'Interações' },
    { id: 'solucoes', label: 'Soluções' },
    { id: 'comite', label: 'Comitê Digital' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim().toUpperCase();
    if (['MIGO', 'MIRO', 'VA01', 'SE16N', 'QA32', 'ME21N', 'VF01'].includes(clean)) {
      onOpenTerminal(clean);
    } else {
      setShowSearchFeedback(true);
      setTimeout(() => setShowSearchFeedback(false), 2000);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Masterboi Brand + Navigation links */}
        <div className="flex items-center gap-6 lg:gap-8 overflow-x-auto no-scrollbar py-2">
          <MasterboiLogo />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectNavTab?.(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
                    isActive
                      ? 'text-[#ba0c2f] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#ba0c2f] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Utilities, Avatar & MODO GAMER switch */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Box matching screenshot */}
          <form onSubmit={handleSearch} className="relative hidden sm:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar projeto, T-Code..."
              className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-800 placeholder-gray-400 text-xs rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#ba0c2f] focus:bg-white transition-all shadow-inner"
            />
          </form>

          {/* Quick Terminal Trigger */}
          <button
            type="button"
            onClick={() => onOpenTerminal()}
            className="p-1.5 text-gray-600 hover:text-[#ba0c2f] hover:bg-gray-50 rounded-lg text-xs font-medium border border-gray-200 hidden sm:flex items-center gap-1"
            title="Simulador de T-Codes SAP (MIGO, SE16N...)"
          >
            <Terminal className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px]">T-Codes</span>
          </button>

          {/* Guia SAP */}
          <button
            type="button"
            onClick={onOpenGlossary}
            className="p-1.5 text-gray-600 hover:text-[#ba0c2f] hover:bg-gray-50 rounded-lg text-xs font-medium border border-gray-200 hidden sm:flex items-center gap-1"
            title="Dicionário de Tabelas & Transações SAP"
          >
            <BookOpen className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px]">Guia SAP</span>
          </button>

          {/* Mute Audio Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#ba0c2f]" />
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Reiniciar Simulação de Homologação"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

          {/* The requested MODO GAMER switch button */}
          <button
            type="button"
            data-testid="toggle-modo-gamer-btn"
            onClick={onToggleTheme}
            className="px-3.5 py-1.5 bg-[#ba0c2f] hover:bg-[#9c0a27] text-white rounded-lg text-xs font-bold tracking-tight shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
            title="Alternar para o Modo Gamer (16-Bit Pixel Art)"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🎮 MODO GAMER</span>
          </button>

          {/* User Avatar Circle (matching AA / QA in red circle from screenshot) */}
          <div
            className="w-8 h-8 rounded-full bg-[#ba0c2f] text-white text-xs font-bold flex items-center justify-center select-none shadow-sm cursor-pointer"
            title="Usuário Homologador QA Masterboi"
          >
            QA
          </div>
        </div>
      </div>
    </header>
  );
};
