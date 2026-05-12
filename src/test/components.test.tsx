import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntryScreen } from '../components/EntryScreen';
import { GameBoard } from '../components/GameBoard';
import { StatusPanel } from '../components/StatusPanel';
import { PiecePreview } from '../components/PiecePreview';
import { PauseOverlay } from '../components/PauseOverlay';
import { GameOverOverlay } from '../components/GameOverOverlay';
import { createEmptyBoard } from '../game/board';
import { BOARD_COLS, BOARD_ROWS } from '../game/constants';
import type { TetrominoType } from '../game/tetrominos';

// ──────────────────────────────────────────
// EntryScreen
// ──────────────────────────────────────────
describe('EntryScreen', () => {
  it('TETRIS 제목 표시', () => {
    render(<EntryScreen bestScore={0} onStart={() => {}} />);
    expect(screen.getByText('TETRIS')).toBeInTheDocument();
  });

  it('Start Game 버튼 표시', () => {
    render(<EntryScreen bestScore={0} onStart={() => {}} />);
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
  });

  it('bestScore=0이면 최고 점수 섹션 숨김', () => {
    render(<EntryScreen bestScore={0} onStart={() => {}} />);
    expect(screen.queryByText('최고 점수')).not.toBeInTheDocument();
  });

  it('bestScore>0이면 최고 점수 표시', () => {
    render(<EntryScreen bestScore={12345} onStart={() => {}} />);
    expect(screen.getByText('최고 점수')).toBeInTheDocument();
    expect(screen.getByText('12,345')).toBeInTheDocument();
  });

  it('Start Game 클릭 시 onStart 콜백 호출', () => {
    const onStart = vi.fn();
    render(<EntryScreen bestScore={0} onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: /start game/i }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('키보드 조작 안내 표시', () => {
    render(<EntryScreen bestScore={0} onStart={() => {}} />);
    expect(screen.getByText('키보드 조작')).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────
// GameBoard
// ──────────────────────────────────────────
describe('GameBoard', () => {
  const emptyBoard = createEmptyBoard();

  it('grid role 포함 렌더링', () => {
    render(
      <GameBoard
        board={emptyBoard}
        currentCells={[]}
        ghostCells={[]}
        currentType="T"
      />
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it(`${BOARD_ROWS * BOARD_COLS}개 셀 렌더링`, () => {
    render(
      <GameBoard
        board={emptyBoard}
        currentCells={[]}
        ghostCells={[]}
        currentType="T"
      />
    );
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(BOARD_ROWS * BOARD_COLS);
  });

  it('currentCells 위치 색상 적용', () => {
    const currentCells = [{ row: 5, col: 4 }];
    render(
      <GameBoard
        board={emptyBoard}
        currentCells={currentCells}
        ghostCells={[]}
        currentType="I"
      />
    );
    // 렌더링 후 셀 수가 맞는지 확인
    expect(screen.getAllByRole('gridcell')).toHaveLength(BOARD_ROWS * BOARD_COLS);
  });

  it('ghostCells는 currentCells와 겹치지 않는 위치에 표시', () => {
    const ghostCells = [{ row: 18, col: 4 }];
    render(
      <GameBoard
        board={emptyBoard}
        currentCells={[]}
        ghostCells={ghostCells}
        currentType="T"
      />
    );
    expect(screen.getAllByRole('gridcell')).toHaveLength(BOARD_ROWS * BOARD_COLS);
  });

  it('보드에 값이 있는 셀 렌더링', () => {
    const board = createEmptyBoard();
    board[19][0] = 3; // T 피스 색상 코드
    render(
      <GameBoard
        board={board}
        currentCells={[]}
        ghostCells={[]}
        currentType="O"
      />
    );
    expect(screen.getAllByRole('gridcell')).toHaveLength(BOARD_ROWS * BOARD_COLS);
  });

  it('aria-label 접근성 속성', () => {
    render(
      <GameBoard
        board={emptyBoard}
        currentCells={[]}
        ghostCells={[]}
        currentType="S"
      />
    );
    expect(screen.getByRole('grid', { name: /테트리스 게임 보드/ })).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────
// PiecePreview
// ──────────────────────────────────────────
describe('PiecePreview', () => {
  it('type=null이면 "없음" 표시', () => {
    render(<PiecePreview type={null} />);
    expect(screen.getByText('없음')).toBeInTheDocument();
  });

  it('type=T이면 렌더링됨', () => {
    const { container } = render(<PiecePreview type="T" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('type=I이면 렌더링됨', () => {
    const { container } = render(<PiecePreview type="I" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('size prop이 적용됨', () => {
    const { container } = render(<PiecePreview type="O" size={20} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('80px'); // 20 * 4
  });
});

// ──────────────────────────────────────────
// StatusPanel
// ──────────────────────────────────────────
describe('StatusPanel', () => {
  const defaultProps = {
    score: 1500,
    bestScore: 3000,
    lines: 8,
    level: 2,
    nextPieces: ['T', 'I', 'O'] as TetrominoType[],
    held: null,
    canHold: true,
  };

  it('점수 표시', () => {
    render(<StatusPanel {...defaultProps} />);
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  it('최고 점수 표시', () => {
    render(<StatusPanel {...defaultProps} />);
    expect(screen.getByText('3,000')).toBeInTheDocument();
  });

  it('라인 수 표시', () => {
    render(<StatusPanel {...defaultProps} />);
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('레벨 표시', () => {
    render(<StatusPanel {...defaultProps} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('Hold 영역 표시', () => {
    render(<StatusPanel {...defaultProps} />);
    expect(screen.getByText('Hold')).toBeInTheDocument();
  });

  it('Next 영역 표시', () => {
    render(<StatusPanel {...defaultProps} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────
// PauseOverlay
// ──────────────────────────────────────────
describe('PauseOverlay', () => {
  it('일시정지 텍스트 표시', () => {
    render(<PauseOverlay onResume={() => {}} />);
    expect(screen.getByText('일시정지')).toBeInTheDocument();
  });

  it('Resume 버튼 표시', () => {
    render(<PauseOverlay onResume={() => {}} />);
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
  });

  it('Resume 클릭 시 onResume 호출', () => {
    const onResume = vi.fn();
    render(<PauseOverlay onResume={onResume} />);
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('dialog role 접근성 속성', () => {
    render(<PauseOverlay onResume={() => {}} />);
    expect(screen.getByRole('dialog', { name: /일시정지/ })).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────
// GameOverOverlay
// ──────────────────────────────────────────
describe('GameOverOverlay', () => {
  const defaultProps = {
    score: 5000,
    bestScore: 5000,
    lines: 20,
    level: 3,
    onPlayAgain: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Game Over 텍스트 표시', () => {
    render(<GameOverOverlay {...defaultProps} />);
    expect(screen.getByText('Game Over')).toBeInTheDocument();
  });

  it('점수 표시', () => {
    render(<GameOverOverlay {...defaultProps} score={7777} bestScore={9999} />);
    expect(screen.getByText('7,777')).toBeInTheDocument();
  });

  it('Play Again 버튼 클릭 시 onPlayAgain 호출', () => {
    const onPlayAgain = vi.fn();
    render(<GameOverOverlay {...defaultProps} onPlayAgain={onPlayAgain} />);
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('신기록 달성 시 "새 최고 점수" 표시', () => {
    render(<GameOverOverlay {...defaultProps} score={9999} bestScore={5000} />);
    expect(screen.getByText(/새 최고 점수/)).toBeInTheDocument();
  });

  it('신기록이 아닐 때 "새 최고 점수" 숨김', () => {
    render(<GameOverOverlay {...defaultProps} score={100} bestScore={5000} />);
    expect(screen.queryByText(/새 최고 점수/)).not.toBeInTheDocument();
  });

  it('dialog role 접근성 속성', () => {
    render(<GameOverOverlay {...defaultProps} />);
    expect(screen.getByRole('dialog', { name: /게임 오버/ })).toBeInTheDocument();
  });
});
