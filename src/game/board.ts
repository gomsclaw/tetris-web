import { BOARD_COLS, BOARD_ROWS } from './constants';
import { type Pos } from './tetrominos';

export type Board = number[][];

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isInBounds(pos: Pos): boolean {
  return pos.col >= 0 && pos.col < BOARD_COLS && pos.row < BOARD_ROWS;
}

export function isCellOccupied(board: Board, pos: Pos): boolean {
  if (pos.row < 0) return false; // 상단 버퍼 영역은 빈 칸 취급
  return board[pos.row][pos.col] !== 0;
}

export function hasCollision(board: Board, cells: Pos[]): boolean {
  return cells.some((pos) => !isInBounds(pos) || isCellOccupied(board, pos));
}

export function placeCells(board: Board, cells: Pos[], colorCode: number): Board {
  const next = cloneBoard(board);
  for (const { col, row } of cells) {
    if (row >= 0 && row < BOARD_ROWS) {
      next[row][col] = colorCode;
    }
  }
  return next;
}

export interface ClearResult {
  board: Board;
  linesCleared: number;
}

export function clearLines(board: Board): ClearResult {
  const remaining = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_ROWS - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array(BOARD_COLS).fill(0)
  );
  return {
    board: [...emptyRows, ...remaining],
    linesCleared,
  };
}

export function isTopReached(cells: Pos[]): boolean {
  return cells.some((pos) => pos.row < 0);
}
