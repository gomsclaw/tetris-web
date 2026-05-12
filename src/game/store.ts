import { create } from 'zustand';
import {
  type GameState,
  initGameState,
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotate,
  holdPiece,
  tick,
  getGhostCells,
  getCurrentCells,
  getSpeed,
} from './engine';
import type { Pos } from './tetrominos';

export type Screen = 'entry' | 'playing' | 'paused' | 'gameover';

interface TetrisStore {
  screen: Screen;
  game: GameState;
  bestScore: number;

  // 화면 전환
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;

  // 게임 액션
  doMoveLeft: () => void;
  doMoveRight: () => void;
  doMoveDown: () => void;
  doHardDrop: () => void;
  doRotateCW: () => void;
  doRotateCCW: () => void;
  doHold: () => void;

  // 게임 루프 (RAF에서 호출)
  doTick: () => void;

  // 파생 계산값
  ghostCells: () => Pos[];
  currentCells: () => Pos[];
  dropSpeed: () => number;
}

function loadBestScore(): number {
  try {
    return parseInt(localStorage.getItem('tetris-best-score') ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem('tetris-best-score', String(score));
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

export const useTetrisStore = create<TetrisStore>((set, get) => ({
  screen: 'entry',
  game: initGameState(),
  bestScore: loadBestScore(),

  startGame: () => {
    set({ screen: 'playing', game: initGameState() });
  },

  pauseGame: () => {
    const { screen, game } = get();
    if (screen !== 'playing') return;
    set({ screen: 'paused', game: { ...game, paused: true } });
  },

  resumeGame: () => {
    const { screen, game } = get();
    if (screen !== 'paused') return;
    set({ screen: 'playing', game: { ...game, paused: false } });
  },

  restartGame: () => {
    set({ screen: 'playing', game: initGameState() });
  },

  doMoveLeft: () => set((s) => ({ game: moveLeft(s.game) })),
  doMoveRight: () => set((s) => ({ game: moveRight(s.game) })),
  doMoveDown: () => set((s) => ({ game: moveDown(s.game) })),

  doHardDrop: () =>
    set((s) => {
      const next = hardDrop(s.game);
      return { game: next };
    }),

  doRotateCW: () => set((s) => ({ game: rotate(s.game, true) })),
  doRotateCCW: () => set((s) => ({ game: rotate(s.game, false) })),
  doHold: () => set((s) => ({ game: holdPiece(s.game) })),

  doTick: () =>
    set((s) => {
      const next = tick(s.game);
      if (next.gameOver) {
        const best = Math.max(s.bestScore, next.score);
        saveBestScore(best);
        return { game: next, screen: 'gameover' as Screen, bestScore: best };
      }
      return { game: next };
    }),

  ghostCells: () => {
    const { screen, game } = get();
    if (screen !== 'playing') return [];
    return getGhostCells(game);
  },

  currentCells: () => {
    const { game } = get();
    return getCurrentCells(game);
  },

  dropSpeed: () => {
    const { game } = get();
    return getSpeed(game.level);
  },
}));
