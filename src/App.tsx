/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PixelHud } from './components/pixel/PixelHud.tsx';
import { PixelArena } from './components/pixel/PixelArena.tsx';
import { PixelDialogAndBattleMenu } from './components/pixel/PixelDialogAndBattleMenu.tsx';
import { PixelStageMapModal } from './components/pixel/PixelStageMapModal.tsx';
import { PixelStageClearModal } from './components/pixel/PixelStageClearModal.tsx';
import { PixelGameOverModal } from './components/pixel/PixelGameOverModal.tsx';
import { ExecutiveView } from './components/executive/ExecutiveView.tsx';
import { ConfettiCanvas } from './components/ConfettiCanvas.tsx';
import { TCodeSimulatorModal } from './components/TCodeSimulatorModal.tsx';
import { GlossaryModal } from './components/GlossaryModal.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import {
  MASTERBOI_SCENARIOS,
  GameState,
  getInitialGameState,
  applyAnswer,
  getCareerRank,
  ALL_BADGES,
  useFiftyFifty,
  useSeniorHint,
  activateDumpShield
} from './game/rules.ts';
import { sound } from './utils/audio.ts';
import { Gamepad2, Briefcase, Zap, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [themeMode, setThemeMode] = useState<'gamer' | 'enterprise'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('masterboi_sap_theme_mode');
      if (saved === 'enterprise' || saved === 'gamer') return saved;
    }
    return 'gamer';
  });

  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Modals
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [showStageClear, setShowStageClear] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // FX Juice States
  const [screenShake, setScreenShake] = useState(false);
  const [flashColor, setFlashColor] = useState<'none' | 'green' | 'red'>('none');
  const [floatingText, setFloatingText] = useState<{ text: string; color: string; id: number }[]>([]);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // URL ?autostart=1 support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState(getInitialGameState());
      setSelectedOptionIndex(null);
    }
    const themeParam = params.get('theme');
    if (themeParam === 'enterprise' || themeParam === 'gamer') {
      setThemeMode(themeParam);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTheme = () => {
    sound.playMenuCursor();
    const nextTheme = themeMode === 'gamer' ? 'enterprise' : 'gamer';
    setThemeMode(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('masterboi_sap_theme_mode', nextTheme);
    }
    triggerToast(
      nextTheme === 'gamer'
        ? '🎮 Modo Gamer 16-Bit Ativado!'
        : '💼 Modo Executivo Ativado!'
    );
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleResetGame = useCallback(() => {
    sound.playMenuCursor();
    setGameState(getInitialGameState());
    setSelectedOptionIndex(null);
    setShowStageClear(false);
    setScreenShake(false);
    setFlashColor('none');
  }, []);

  const currentScenario = MASTERBOI_SCENARIOS[gameState.currentStep] || MASTERBOI_SCENARIOS[0];
  const isLastScenario = gameState.currentStep === MASTERBOI_SCENARIOS.length - 1;

  // Add floating combat text
  const addFloatingText = (text: string, color: string) => {
    const id = Date.now();
    setFloatingText(prev => [...prev, { text, color, id }]);
    setTimeout(() => {
      setFloatingText(prev => prev.filter(item => item.id !== id));
    }, 2000);
  };

  // Power-Ups
  const handleUseFiftyFifty = () => {
    if (gameState.powerUps.fiftyFifty <= 0 || gameState.eliminatedOptions.length > 0 || selectedOptionIndex !== null) {
      return;
    }
    sound.playItemUse();
    const nextState = useFiftyFifty(gameState, currentScenario);
    setGameState(nextState);
    addFloatingText('50/50 ATIVADO! -2 OPÇÕES', 'text-[#ffd23f]');
    triggerToast('⚡ 50/50: 2 opções incorretas eliminadas!');
  };

  const handleUseSeniorHint = () => {
    if (gameState.powerUps.seniorHint <= 0 || gameState.activeSeniorHint || selectedOptionIndex !== null) {
      return;
    }
    sound.playItemUse();
    const nextState = useSeniorHint(gameState, currentScenario);
    setGameState(nextState);
    addFloatingText('DICA DESBLOQUEADA!', 'text-[#a855f7]');
    triggerToast('💡 Dica do Tech Lead Masterboi liberada!');
  };

  const handleActivateShield = () => {
    if (gameState.powerUps.dumpShield || selectedOptionIndex !== null) {
      return;
    }
    sound.playShield();
    const nextState = activateDumpShield(gameState);
    setGameState(nextState);
    addFloatingText('ESCUDO ATIVADO!', 'text-[#3de0ff]');
    triggerToast('🛡️ Escudo de DUMP ativado!');
  };

  // Select Option / Answer
  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null || gameState.eliminatedOptions.includes(index)) return;

    setSelectedOptionIndex(index);

    const previousRank = getCareerRank(gameState.xp);
    const { nextState, isCorrect, newBadgeUnlocked } = applyAnswer(
      gameState,
      currentScenario,
      index
    );

    const newRank = getCareerRank(nextState.xp);

    if (isCorrect) {
      sound.playSuccess();
      setFlashColor('green');
      setTimeout(() => setFlashColor('none'), 250);
      addFloatingText(`+${currentScenario.xpReward} XP!`, 'text-[#5cff7a]');

      if (newRank.level > previousRank.level) {
        setTimeout(() => {
          sound.playStageClear();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          triggerToast(`🎉 Promoção de Nível! Você agora é ${newRank.title}!`);
        }, 300);
      }
    } else {
      if (nextState.shieldUsedInCurrentQuestion) {
        sound.playShield();
        addFloatingText('ESCUDO PROTEGEU O SISTEMA!', 'text-[#3de0ff]');
        triggerToast('🛡️ O Escudo protegeu seu sistema contra a perda de HP!');
      } else {
        sound.playError();
        sound.playHeartBreak();
        setScreenShake(true);
        setFlashColor('red');
        setTimeout(() => setScreenShake(false), 400);
        setTimeout(() => setFlashColor('none'), 300);
        addFloatingText('-25 HP! BUG VAZOU', 'text-[#ff3b5c]');
      }
    }

    if (newBadgeUnlocked) {
      const badgeObj = ALL_BADGES.find(b => b.id === newBadgeUnlocked);
      if (badgeObj) {
        setTimeout(() => {
          sound.playBadgeUnlocked();
          triggerToast(`🏅 Conquista desbloqueada: "${badgeObj.name}"!`);
        }, 500);
      }
    }

    setGameState(nextState);
  };

  // Next Question / Next Stage
  const handleNextQuestion = () => {
    if (isLastScenario) {
      let finalState = { ...gameState, isFinished: true };
      if (finalState.hp === 100 && !finalState.earnedBadges.includes('perfect-run')) {
        finalState = {
          ...finalState,
          earnedBadges: [...finalState.earnedBadges, 'perfect-run']
        };
      }
      setGameState(finalState);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } else {
      if (themeMode === 'gamer') {
        setShowStageClear(true);
      } else {
        handleAdvanceToNextStage();
        triggerToast('📋 Avançado para o próximo caso de teste homologado!');
      }
    }
  };

  const handleAdvanceToNextStage = () => {
    setShowStageClear(false);
    setGameState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      eliminatedOptions: [],
      activeSeniorHint: null,
      shieldUsedInCurrentQuestion: false
    }));
    setSelectedOptionIndex(null);
  };

  const isGameOver = gameState.hp <= 0;
  const isAnswerCorrect = selectedOptionIndex !== null ? currentScenario.options[selectedOptionIndex]?.correct : null;

  return (
    <div
      className={
        themeMode === 'gamer'
          ? `min-h-screen max-h-screen overflow-y-auto sm:overflow-hidden bg-[#1a1033] text-white flex flex-col font-pixel select-none relative ${
              screenShake ? 'animate-shake' : ''
            }`
          : 'min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative selection:bg-cyan-500 selection:text-black'
      }
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-14 sm:top-16 right-4 z-50 px-3 py-2 text-xs font-bold border-2 shadow-2xl flex items-center gap-2 animate-bounce ${
            themeMode === 'gamer'
              ? 'bg-[#24174d] text-[#ffd23f] border-[#ffd23f] font-pixel text-[9px]'
              : 'bg-slate-900 text-amber-200 border-amber-500 font-mono rounded-lg'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confetti celebration canvas */}
      <ConfettiCanvas active={showConfetti} duration={3500} />

      {/* =========================================
          THEME 1: MODO GAMER (16-Bit SNES Pixel Art)
         ========================================= */}
      {themeMode === 'gamer' && (
        <>
          {/* Subtle CRT scanline overlay */}
          <div className="pointer-events-none fixed inset-0 crt-overlay z-50 opacity-40" />

          {/* Screen Flash FX */}
          {flashColor === 'red' && (
            <div className="pointer-events-none fixed inset-0 bg-[#ff3b5c]/30 z-40 animate-flash-red" />
          )}
          {flashColor === 'green' && (
            <div className="pointer-events-none fixed inset-0 bg-[#5cff7a]/25 z-40 animate-flash-green" />
          )}

          {/* 16-Bit Top Pixel HUD with [MODO EXECUTIVO] toggle */}
          <PixelHud
            gameState={gameState}
            currentModule={currentScenario.module}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            onToggleTheme={handleToggleTheme}
          />

          {/* Main 16-Bit Arena and RPG Dialogue + Battle Menu */}
          <main className="flex-1 max-w-6xl w-full mx-auto p-2 sm:p-3 flex flex-col justify-between gap-2 overflow-y-auto sm:overflow-hidden">
            <PixelArena
              scenario={currentScenario}
              gameState={gameState}
              hasAnswered={selectedOptionIndex !== null}
              isCorrect={isAnswerCorrect}
              floatingText={floatingText}
            />

            <PixelDialogAndBattleMenu
              scenario={currentScenario}
              gameState={gameState}
              selectedOptionIndex={selectedOptionIndex}
              onSelectOption={handleSelectOption}
              onNext={handleNextQuestion}
              isLastScenario={isLastScenario}
              onUseFiftyFifty={handleUseFiftyFifty}
              onUseSeniorHint={handleUseSeniorHint}
              onActivateShield={handleActivateShield}
            />
          </main>
        </>
      )}

      {/* =========================================
          THEME 2: MODO EXECUTIVO (Masterboi Corporate Portal Style)
         ========================================= */}
      {themeMode === 'enterprise' && (
        <ExecutiveView
          gameState={gameState}
          currentScenario={currentScenario}
          selectedOptionIndex={selectedOptionIndex}
          isLastScenario={isLastScenario}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onToggleTheme={handleToggleTheme}
          onResetGame={handleResetGame}
          onSelectOption={handleSelectOption}
          onNextQuestion={handleNextQuestion}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onUseFiftyFifty={handleUseFiftyFifty}
          onUseSeniorHint={handleUseSeniorHint}
          onActivateShield={handleActivateShield}
        />
      )}

      {/* Shared Modals */}
      <PixelStageMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentStep={gameState.currentStep}
        earnedBadges={gameState.earnedBadges}
      />

      {showStageClear && (
        <PixelStageClearModal
          scenario={currentScenario}
          gameState={gameState}
          onNextStage={handleAdvanceToNextStage}
          isLastStage={isLastScenario}
        />
      )}

      {isGameOver && (
        <PixelGameOverModal
          gameState={gameState}
          onRetry={handleResetGame}
        />
      )}

      {gameState.isFinished && !isGameOver && (
        <VictoryModal
          state={gameState}
          totalQuestions={MASTERBOI_SCENARIOS.length}
          onRestart={handleResetGame}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />
      )}

      <TCodeSimulatorModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        initialCode={currentScenario.recommendedTCode || 'MIGO'}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
