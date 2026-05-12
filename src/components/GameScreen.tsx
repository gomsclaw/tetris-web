import { useEffect, useRef } from 'react';
import { useTetrisStore } from '../game/store';
import { GameBoard } from './GameBoard';
import { StatusPanel } from './StatusPanel';

export function GameScreen() {
  const {
    game,
    bestScore,
    screen,
    doMoveLeft,
    doMoveRight,
    doMoveDown,
    doHardDrop,
    doRotateCW,
    doRotateCCW,
    doHold,
    pauseGame,
    resumeGame,
    doTick,
    ghostCells,
    currentCells,
    dropSpeed,
  } = useTetrisStore();

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // 게임 루프
  useEffect(() => {
    if (screen !== 'playing') {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const loop = (now: number) => {
      const speed = dropSpeed();
      if (now - lastTickRef.current >= speed) {
        lastTickRef.current = now;
        doTick();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  // 탭 비활성화 시 자동 일시정지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && screen === 'playing') {
        pauseGame();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [screen, pauseGame]);

  // 키보드 컨트롤
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screen === 'gameover') return;

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          doMoveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          doMoveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          doMoveDown();
          break;
        case 'Space':
          e.preventDefault();
          doHardDrop();
          break;
        case 'ArrowUp':
          e.preventDefault();
          doRotateCW();
          break;
        case 'KeyZ':
          e.preventDefault();
          doRotateCCW();
          break;
        case 'KeyC':
          e.preventDefault();
          doHold();
          break;
        case 'KeyP':
          e.preventDefault();
          if (screen === 'playing') pauseGame();
          else if (screen === 'paused') resumeGame();
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, doMoveLeft, doMoveRight, doMoveDown, doHardDrop, doRotateCW, doRotateCCW, doHold, pauseGame, resumeGame]);

  const ghosts = ghostCells();
  const currents = currentCells();

  return (
    <div
      className="flex items-center justify-center min-h-screen px-3 py-3"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d0d1f 0%, #020204 100%)' }}
    >
      <div className="flex gap-3 items-start">
        <div className="relative flex-shrink-0" style={{ width: 'min(50vw, 300px)' }}>
          <GameBoard
            board={game.board}
            currentCells={currents}
            ghostCells={ghosts}
            currentType={game.current.type}
          />
        </div>
        <StatusPanel
          score={game.score}
          bestScore={bestScore}
          lines={game.lines}
          level={game.level}
          nextPieces={game.next}
          held={game.held}
          canHold={game.canHold}
        />
      </div>
    </div>
  );
}
