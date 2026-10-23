import React, { useState, useEffect, useRef } from 'react';
import { PixelTechLeadPortrait } from './PixelSprites.tsx';
import { Scenario, GameState } from '../../game/rules.ts';
import { sound } from '../../utils/audio.ts';

interface PixelDialogAndBattleMenuProps {
  scenario: Scenario;
  gameState: GameState;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  isLastScenario: boolean;
  onUseFiftyFifty: () => void;
  onUseSeniorHint: () => void;
  onActivateShield: () => void;
}

export const PixelDialogAndBattleMenu: React.FC<PixelDialogAndBattleMenuProps> = ({
  scenario,
  gameState,
  selectedOptionIndex,
  onSelectOption,
  onNext,
  isLastScenario,
  onUseFiftyFifty,
  onUseSeniorHint,
  onActivateShield
}) => {
  const [cursorIndex, setCursorIndex] = useState(0);
  const [activeMenuTab, setActiveMenuTab] = useState<'answers' | 'items'>('answers');

  // Typewriter effect state
  // Clean raw HTML tags for typewriter animation
  const cleanScenarioText = scenario.desc
    .replace(/<br\s*[\/]?>/gi, ' ')
    .replace(/<[^>]+>/g, '');

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textIndexRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    textIndexRef.current = 0;

    const interval = setInterval(() => {
      textIndexRef.current += 1;
      if (textIndexRef.current <= cleanScenarioText.length) {
        setDisplayedText(cleanScenarioText.slice(0, textIndexRef.current));
        // 8-bit blip sound for each letter
        sound.playTypewriterBlip();
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [scenario.id]);

  // Fast-forward typewriter on click or Enter
  const handleFastForward = () => {
    if (isTyping) {
      setDisplayedText(cleanScenarioText);
      setIsTyping(false);
      sound.playMenuCursor();
    }
  };

  // Keyboard navigation for menu (Arrow Up / Down, Enter, Number keys 1-4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (isTyping && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleFastForward();
        return;
      }

      if (selectedOptionIndex !== null) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
        return;
      }

      if (activeMenuTab === 'answers') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          sound.playMenuCursor();
          setCursorIndex(prev => (prev > 0 ? prev - 1 : scenario.options.length - 1));
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          sound.playMenuCursor();
          setCursorIndex(prev => (prev < scenario.options.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!gameState.eliminatedOptions.includes(cursorIndex)) {
            onSelectOption(cursorIndex);
          }
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (scenario.options[idx] && !gameState.eliminatedOptions.includes(idx)) {
            setCursorIndex(idx);
            onSelectOption(idx);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, selectedOptionIndex, activeMenuTab, cursorIndex, gameState.eliminatedOptions, scenario.options]);

  const hasAnswered = selectedOptionIndex !== null;
  const chosenOption = hasAnswered ? scenario.options[selectedOptionIndex] : null;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-3 select-none">
      {/* Left: Classic RPG Dialog Box */}
      <div
        onClick={handleFastForward}
        className="flex-1 pixel-rpg-dialog p-3 sm:p-4 text-white relative cursor-pointer flex flex-col justify-between min-h-[180px] sm:min-h-[200px]"
      >
        {/* Header tag */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2 font-pixel text-[8px] sm:text-[9px]">
          <span className="text-[#ffd23f]">
            [ORDEM DE SERVIÇO: {scenario.module.split('-')[0].trim()}]
          </span>
          <span className="text-[#3de0ff]">QAS-300 / BALANÇA 01</span>
        </div>

        {/* Dialog Content: Tech Lead Portrait + Typewriter Narrative */}
        <div className="flex items-start gap-3 flex-1">
          <PixelTechLeadPortrait />

          <div className="flex-1 flex flex-col justify-between">
            <span className="font-pixel text-[9px] text-[#ffd23f] block mb-1">
              TECH LEAD MASTERBOI:
            </span>

            {/* Typewriter text or explanation */}
            {!hasAnswered ? (
              <div className="font-retro text-lg sm:text-2xl leading-tight text-[#e2e8f0]">
                {displayedText}
                {isTyping && <span className="animate-pixel-blink">_</span>}
              </div>
            ) : (
              <div className="font-retro text-base sm:text-xl leading-tight">
                {chosenOption?.correct ? (
                  <div className="text-[#5cff7a]">
                    <div className="font-pixel text-[10px] text-[#5cff7a] mb-1">
                      ★ SUCESSO NO CASO DE TESTE! (PASS) ★
                    </div>
                    <div>{chosenOption.note}</div>
                    {chosenOption.technicalDetail && (
                      <div className="font-pixel text-[8px] text-[#3de0ff] mt-2 bg-black/60 p-1.5 border border-black">
                        LOG SAP: {chosenOption.technicalDetail}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[#ff3b5c]">
                    <div className="font-pixel text-[10px] text-[#ff3b5c] mb-1">
                      💥 FALHA DE HOMOLOGAÇÃO! (-25 HP) 💥
                    </div>
                    <div>{chosenOption?.note}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info: Blinking arrow ▼ or Advance button */}
        <div className="flex items-center justify-between pt-2 border-t border-black/60 font-pixel text-[8px] sm:text-[9px]">
          <span className="text-slate-400 hidden sm:inline">
            {!hasAnswered ? '[CLIQUE PARA ACELERAR TEXTO]' : '[ENTER PARA CONTINUAR]'}
          </span>

          {!hasAnswered ? (
            <div className="flex items-center gap-1 text-[#ffd23f]">
              <span>LEITURA</span>
              <span className="animate-pixel-blink text-xs">▼</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="pixel-btn bg-[#5cff7a] text-black px-3 py-1 font-pixel text-[9px] font-bold"
            >
              {isLastScenario ? 'FINALIZAR ▶' : 'PRÓXIMA FASE ▶'}
            </button>
          )}
        </div>
      </div>

      {/* Right: 16-Bit Battle Command Menu */}
      <div className="w-full lg:w-[420px] bg-[#3b2a6e] border-4 border-black p-3 shadow-[4px_4px_0_#000] flex flex-col justify-between">
        {/* Menu Tabs: [RESPOSTAS] / [ITENS] */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2 font-pixel text-[8px] sm:text-[9px]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playMenuCursor();
                setActiveMenuTab('answers');
              }}
              className={`pixel-btn px-2 py-1 ${
                activeMenuTab === 'answers' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#24174d] text-white'
              }`}
            >
              AÇÃO / RESPOSTAS
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playMenuCursor();
                setActiveMenuTab('items');
              }}
              className={`pixel-btn px-2 py-1 ${
                activeMenuTab === 'items' ? 'bg-[#ffd23f] text-black font-bold' : 'bg-[#24174d] text-white'
              }`}
            >
              ITENS ({gameState.powerUps.fiftyFifty + gameState.powerUps.seniorHint})
            </button>
          </div>

          <span className="text-[#3de0ff] hidden sm:inline">SETAS: ↑↓</span>
        </div>

        {/* Tab 1: Answers List */}
        {activeMenuTab === 'answers' && (
          <div className="space-y-1.5 flex-1">
            {scenario.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCursorOnThis = cursorIndex === idx;
              const isEliminated = gameState.eliminatedOptions.includes(idx);

              let optionClasses = 'bg-[#24174d] text-slate-200 border-2 border-black';

              if (isEliminated) {
                optionClasses = 'bg-black/60 text-slate-600 line-through opacity-40 border-2 border-black';
              } else if (hasAnswered) {
                if (option.correct) {
                  optionClasses = 'bg-[#14532d] text-[#5cff7a] border-2 border-[#5cff7a]';
                } else if (isSelected && !option.correct) {
                  optionClasses = 'bg-[#7f1d1d] text-[#ff3b5c] border-2 border-[#ff3b5c]';
                }
              } else if (isCursorOnThis) {
                optionClasses = 'bg-[#ffd23f] text-black border-2 border-black font-bold';
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={hasAnswered || isEliminated}
                  onMouseEnter={() => {
                    if (!hasAnswered && !isEliminated) {
                      sound.playMenuCursor();
                      setCursorIndex(idx);
                    }
                  }}
                  onClick={() => onSelectOption(idx)}
                  className={`w-full text-left p-2 font-retro text-base sm:text-lg leading-tight transition-none flex items-start gap-1.5 cursor-pointer ${optionClasses}`}
                >
                  <span className="font-pixel text-[10px] w-4 shrink-0 pt-0.5">
                    {isCursorOnThis && !hasAnswered ? '▶' : `${['A', 'B', 'C', 'D'][idx]}`}
                  </span>
                  <span className="flex-1">
                    {option.text.replace(/^[A-D]\)\s*/, '')}
                    {isEliminated && ' [ELIMINADO]'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Items / Power-Ups Menu */}
        {activeMenuTab === 'items' && (
          <div className="space-y-2 flex-1 font-pixel text-[8px] sm:text-[9px]">
            <div className="text-[#ffd23f] mb-1">SLOTS DE INVENTÁRIO QA:</div>

            {/* Item 1: 50/50 */}
            <button
              type="button"
              disabled={hasAnswered || gameState.powerUps.fiftyFifty <= 0 || gameState.eliminatedOptions.length > 0}
              onClick={onUseFiftyFifty}
              className={`w-full pixel-btn p-2 flex items-center justify-between text-left ${
                !hasAnswered && gameState.powerUps.fiftyFifty > 0 && gameState.eliminatedOptions.length === 0
                  ? 'bg-[#ffd23f] text-black'
                  : 'bg-[#24174d] text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>⚡ 50/50 (ELIMINAR 2)</span>
              <span>QTD: {gameState.powerUps.fiftyFifty}</span>
            </button>

            {/* Item 2: Dump Shield */}
            <button
              type="button"
              disabled={hasAnswered || gameState.powerUps.dumpShield}
              onClick={onActivateShield}
              className={`w-full pixel-btn p-2 flex items-center justify-between text-left ${
                gameState.powerUps.dumpShield
                  ? 'bg-[#3de0ff] text-black font-bold'
                  : !hasAnswered
                  ? 'bg-[#24174d] text-[#3de0ff]'
                  : 'bg-[#24174d] text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>🛡️ ESCUDO DE DUMP</span>
              <span>{gameState.powerUps.dumpShield ? 'ATIVADO' : 'USAR'}</span>
            </button>

            {/* Item 3: Senior Hint */}
            <button
              type="button"
              disabled={hasAnswered || gameState.powerUps.seniorHint <= 0 || Boolean(gameState.activeSeniorHint)}
              onClick={onUseSeniorHint}
              className={`w-full pixel-btn p-2 flex items-center justify-between text-left ${
                !hasAnswered && gameState.powerUps.seniorHint > 0 && !gameState.activeSeniorHint
                  ? 'bg-[#a855f7] text-white'
                  : 'bg-[#24174d] text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>💡 DICA TECH LEAD</span>
              <span>QTD: {gameState.powerUps.seniorHint}</span>
            </button>

            {gameState.activeSeniorHint && (
              <div className="bg-black border-2 border-[#a855f7] p-2 text-[#a855f7] text-[8px] leading-tight mt-2">
                DICA ATIVA: {gameState.activeSeniorHint}
              </div>
            )}
          </div>
        )}

        {/* Footer controls hint */}
        <div className="border-t border-black/60 pt-1.5 mt-2 flex items-center justify-between font-pixel text-[7px] sm:text-[8px] text-slate-400">
          <span>[TECLADO: 1-4 OU SETAS + ENTER]</span>
          <span className="text-[#ffd23f]">MASTERBOI QAS</span>
        </div>
      </div>
    </div>
  );
};
