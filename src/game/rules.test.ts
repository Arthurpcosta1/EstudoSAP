import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAREER_RANKS,
  MASTERBOI_SCENARIOS,
  SAP_TCODES,
  getCareerRank,
  getNextRankProgress,
  getInitialGameState,
  applyAnswer,
  useFiftyFifty,
  activateDumpShield
} from './rules.ts';

test('Initial state starts at 100% HP, 0 XP and Trainee level', () => {
  const initial = getInitialGameState();
  assert.equal(initial.hp, 100);
  assert.equal(initial.xp, 0);
  assert.equal(initial.streak, 0);
  assert.equal(initial.currentStep, 0);

  const rank = getCareerRank(initial.xp);
  assert.equal(rank.title, 'Estagiário de Testes SAP');
  assert.equal(rank.level, 1);
});

test('Career progression scales accurately across XP thresholds', () => {
  assert.equal(getCareerRank(99).title, 'Estagiário de Testes SAP');
  assert.equal(getCareerRank(100).title, 'Assistente QA I');
  assert.equal(getCareerRank(250).title, 'Assistente QA II');
  assert.equal(getCareerRank(450).title, 'Analista QA Júnior SAP');
  assert.equal(getCareerRank(700).title, 'Analista QA Pleno Masterboi');
  assert.equal(getCareerRank(1000).title, 'Analista QA Sênior E2E');
  assert.equal(getCareerRank(1300).title, 'QA Lead Auditor & Arquiteto SAP');
  assert.equal(getCareerRank(2000).title, 'QA Lead Auditor & Arquiteto SAP');
});

test('Rank progress percentage calculates bounded percentage to next level', () => {
  const progressMid = getNextRankProgress(50);
  assert.equal(progressMid.currentRank.level, 1);
  assert.equal(progressMid.nextRank?.level, 2);
  assert.equal(progressMid.progressPercent, 50);

  const maxRankProgress = getNextRankProgress(1500);
  assert.equal(maxRankProgress.nextRank, null);
  assert.equal(maxRankProgress.progressPercent, 100);
});

test('Applying correct answer awards scenario XP, updates streak, and awards first-blood badge', () => {
  const state = getInitialGameState();
  const sc1 = MASTERBOI_SCENARIOS[0]; // MIGO correct option index is 1
  const result = applyAnswer(state, sc1, 1);

  assert.equal(result.isCorrect, true);
  assert.equal(result.nextState.xp, sc1.xpReward);
  assert.equal(result.nextState.hp, 100);
  assert.equal(result.nextState.streak, 1);
  assert.equal(result.nextState.earnedBadges.includes('first-blood'), true);
});

test('Applying incorrect answer deducts 25 HP and resets streak', () => {
  const state = {
    ...getInitialGameState(),
    xp: 200,
    streak: 3
  };
  const sc1 = MASTERBOI_SCENARIOS[0];
  const result = applyAnswer(state, sc1, 0); // option 0 is incorrect

  assert.equal(result.isCorrect, false);
  assert.equal(result.nextState.hp, 75);
  assert.equal(result.nextState.streak, 0);
  assert.equal(result.nextState.xp, 200); // no XP gain
});

test('HP never drops below 0%', () => {
  let state = {
    ...getInitialGameState(),
    hp: 15
  };
  const sc1 = MASTERBOI_SCENARIOS[0];
  const result = applyAnswer(state, sc1, 0);
  assert.equal(result.nextState.hp, 0);
});

test('All scenarios have valid options and at least one correct answer', () => {
  assert.ok(MASTERBOI_SCENARIOS.length >= 6);
  for (const sc of MASTERBOI_SCENARIOS) {
    assert.ok(sc.options.length >= 4, `Scenario ${sc.id} has at least 4 options`);
    const correctCount = sc.options.filter(o => o.correct).length;
    assert.equal(correctCount, 1, `Scenario ${sc.id} should have exactly one correct option`);
  }
});

test('T-Codes dictionary covers all core Masterboi modules', () => {
  assert.ok(SAP_TCODES['MIGO']);
  assert.ok(SAP_TCODES['MIRO']);
  assert.ok(SAP_TCODES['VA01']);
  assert.ok(SAP_TCODES['VL01N']);
  assert.ok(SAP_TCODES['VF01']);
  assert.ok(SAP_TCODES['SE16N']);
  assert.ok(SAP_TCODES['QA32']);
});

test('50/50 power-up removes 2 incorrect options and decrements counter', () => {
  const state = getInitialGameState();
  const sc = MASTERBOI_SCENARIOS[0];
  const updated = useFiftyFifty(state, sc);

  assert.equal(updated.powerUps.fiftyFifty, 0);
  assert.equal(updated.eliminatedOptions.length, 2);
  // Ensure correct option (index 1) is NOT eliminated
  assert.equal(updated.eliminatedOptions.includes(1), false);
});

test('Dump Shield absorbs damage when wrong answer is picked', () => {
  let state = getInitialGameState();
  state = activateDumpShield(state);
  assert.equal(state.powerUps.dumpShield, true);

  const sc = MASTERBOI_SCENARIOS[0];
  const result = applyAnswer(state, sc, 0); // wrong answer

  assert.equal(result.isCorrect, false);
  assert.equal(result.nextState.hp, 100); // NO HP lost!
  assert.equal(result.nextState.powerUps.dumpShield, false); // Shield was consumed
  assert.equal(result.nextState.shieldUsedInCurrentQuestion, true);
});
