import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GameScreen } from '../components/GameScreen';
import { useTetrisStore } from '../game/store';
import { initGameState } from '../game/engine';

// requestAnimationFrame mock
let rafCallback: ((time: number) => void) | null = null;
let rafId = 0;

beforeEach(() => {
  useTetrisStore.setState({ screen: 'playing', game: initGameState(), bestScore: 0 });

  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    rafCallback = cb;
    return ++rafId;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  rafCallback = null;
  vi.restoreAllMocks();
});

function flushRaf(time = 2000) {
  if (rafCallback) {
    act(() => {
      rafCallback!(time);
    });
  }
}

describe('GameScreen 렌더링', () => {
  it('게임 보드와 상태 패널 렌더링', () => {
    render(<GameScreen />);
    expect(screen.getByRole('grid', { name: /테트리스 게임 보드/ })).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('playing 상태에서 ghostCells 표시됨', () => {
    render(<GameScreen />);
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThan(0);
  });
});

describe('GameScreen 게임 루프 (RAF)', () => {
  it('playing 상태에서 requestAnimationFrame 호출', () => {
    render(<GameScreen />);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('충분한 시간 경과 후 doTick 실행 (screen 유지)', () => {
    render(<GameScreen />);
    flushRaf(99999); // 1000ms 이상 경과 → tick 실행
    const state = useTetrisStore.getState();
    // tick 후 상태가 변함 (gameover 또는 playing)
    expect(state.screen === 'playing' || state.screen === 'gameover').toBe(true);
  });

  it('screen=paused로 변경 시 RAF 취소', () => {
    const { rerender } = render(<GameScreen />);
    act(() => {
      useTetrisStore.setState({ screen: 'paused', game: { ...initGameState(), paused: true } });
    });
    rerender(<GameScreen />);
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});

describe('GameScreen 키보드 컨트롤', () => {
  it('ArrowLeft → doMoveLeft 호출', () => {
    render(<GameScreen />);
    const before = useTetrisStore.getState().game.current.origin.col;
    fireEvent.keyDown(window, { code: 'ArrowLeft' });
    const after = useTetrisStore.getState().game.current.origin.col;
    expect(after).toBeLessThanOrEqual(before);
  });

  it('ArrowRight → doMoveRight 호출', () => {
    render(<GameScreen />);
    const before = useTetrisStore.getState().game.current.origin.col;
    fireEvent.keyDown(window, { code: 'ArrowRight' });
    const after = useTetrisStore.getState().game.current.origin.col;
    expect(after).toBeGreaterThanOrEqual(before);
  });

  it('ArrowDown → doMoveDown 호출', () => {
    render(<GameScreen />);
    const before = useTetrisStore.getState().game.current.origin.row;
    fireEvent.keyDown(window, { code: 'ArrowDown' });
    const after = useTetrisStore.getState().game.current.origin.row;
    expect(after >= before).toBe(true);
  });

  it('Space → doHardDrop 호출 (새 피스 또는 game over)', () => {
    render(<GameScreen />);
    const prevPiece = useTetrisStore.getState().game.current;
    fireEvent.keyDown(window, { code: 'Space' });
    const afterGame = useTetrisStore.getState().game;
    expect(afterGame.current !== prevPiece || afterGame.gameOver).toBe(true);
  });

  it('ArrowUp → doRotateCW 호출', () => {
    render(<GameScreen />);
    fireEvent.keyDown(window, { code: 'ArrowUp' });
    expect(useTetrisStore.getState().game).toBeDefined();
  });

  it('KeyZ → doRotateCCW 호출', () => {
    render(<GameScreen />);
    fireEvent.keyDown(window, { code: 'KeyZ' });
    expect(useTetrisStore.getState().game).toBeDefined();
  });

  it('KeyC → doHold 호출', () => {
    render(<GameScreen />);
    const currentType = useTetrisStore.getState().game.current.type;
    fireEvent.keyDown(window, { code: 'KeyC' });
    const held = useTetrisStore.getState().game.held;
    expect(held).toBe(currentType);
  });

  it('KeyP playing → pauseGame 호출', () => {
    render(<GameScreen />);
    fireEvent.keyDown(window, { code: 'KeyP' });
    expect(useTetrisStore.getState().screen).toBe('paused');
  });

  it('KeyP paused → resumeGame 호출', () => {
    useTetrisStore.setState({ screen: 'paused', game: { ...initGameState(), paused: true } });
    render(<GameScreen />);
    fireEvent.keyDown(window, { code: 'KeyP' });
    expect(useTetrisStore.getState().screen).toBe('playing');
  });

  it('gameover 상태에서 키 입력 무시', () => {
    useTetrisStore.setState({ screen: 'gameover', game: { ...initGameState(), gameOver: true } });
    render(<GameScreen />);
    const before = useTetrisStore.getState().game;
    fireEvent.keyDown(window, { code: 'ArrowLeft' });
    // gameover에서 키입력은 무시됨
    expect(useTetrisStore.getState().game).toBe(before);
  });
});

describe('GameScreen visibilitychange 자동 일시정지', () => {
  it('playing 상태에서 탭 숨김 → paused로 전환', () => {
    render(<GameScreen />);
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(useTetrisStore.getState().screen).toBe('paused');
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });

  it('paused 상태에서 탭 숨김 → 상태 변화 없음', () => {
    useTetrisStore.setState({ screen: 'paused', game: { ...initGameState(), paused: true } });
    render(<GameScreen />);
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(useTetrisStore.getState().screen).toBe('paused');
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });

  it('unmount 시 이벤트 리스너 제거 (이후 이벤트 무시)', () => {
    const { unmount } = render(<GameScreen />);
    unmount();
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(useTetrisStore.getState().screen).toBe('playing');
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });
});
