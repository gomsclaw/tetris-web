import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  cloneBoard,
  isInBounds,
  isCellOccupied,
  hasCollision,
  placeCells,
  clearLines,
  isTopReached,
} from '../board';
import { BOARD_COLS, BOARD_ROWS } from '../constants';

describe('createEmptyBoard', () => {
  it('10×20 배열 생성', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(BOARD_ROWS);
    expect(board[0]).toHaveLength(BOARD_COLS);
    expect(board.every((row) => row.every((c) => c === 0))).toBe(true);
  });
});

describe('cloneBoard', () => {
  it('독립 복사본 반환', () => {
    const board = createEmptyBoard();
    const clone = cloneBoard(board);
    clone[0][0] = 99;
    expect(board[0][0]).toBe(0);
  });
});

describe('isInBounds', () => {
  it('유효한 위치 true', () => {
    expect(isInBounds({ col: 0, row: 0 })).toBe(true);
    expect(isInBounds({ col: 9, row: 19 })).toBe(true);
  });
  it('왼쪽 벽 밖 false', () => expect(isInBounds({ col: -1, row: 0 })).toBe(false));
  it('오른쪽 벽 밖 false', () => expect(isInBounds({ col: 10, row: 0 })).toBe(false));
  it('바닥 밖 false', () => expect(isInBounds({ col: 0, row: 20 })).toBe(false));
});

describe('isCellOccupied', () => {
  it('빈 보드에서 false', () => {
    const board = createEmptyBoard();
    expect(isCellOccupied(board, { col: 0, row: 0 })).toBe(false);
  });
  it('채워진 셀 true', () => {
    const board = createEmptyBoard();
    board[5][3] = 1;
    expect(isCellOccupied(board, { col: 3, row: 5 })).toBe(true);
  });
  it('row < 0 은 false (스폰 버퍼)', () => {
    const board = createEmptyBoard();
    expect(isCellOccupied(board, { col: 0, row: -1 })).toBe(false);
  });
});

describe('hasCollision', () => {
  it('빈 보드, 유효 위치 → false', () => {
    const board = createEmptyBoard();
    expect(hasCollision(board, [{ col: 0, row: 0 }])).toBe(false);
  });
  it('오른쪽 벽 충돌', () => {
    const board = createEmptyBoard();
    expect(hasCollision(board, [{ col: 10, row: 0 }])).toBe(true);
  });
  it('블록 충돌', () => {
    const board = createEmptyBoard();
    board[0][0] = 1;
    expect(hasCollision(board, [{ col: 0, row: 0 }])).toBe(true);
  });
  it('복수 셀 일부 충돌', () => {
    const board = createEmptyBoard();
    expect(
      hasCollision(board, [{ col: 0, row: 0 }, { col: -1, row: 0 }])
    ).toBe(true);
  });
});

describe('placeCells', () => {
  it('셀에 색상 코드 기록', () => {
    const board = createEmptyBoard();
    const result = placeCells(board, [{ col: 2, row: 3 }], 5);
    expect(result[3][2]).toBe(5);
    expect(board[3][2]).toBe(0); // 원본 불변
  });
  it('row < 0 셀 무시', () => {
    const board = createEmptyBoard();
    const result = placeCells(board, [{ col: 2, row: -1 }], 1);
    expect(result[0].every((c) => c === 0)).toBe(true);
  });
});

describe('clearLines', () => {
  it('빈 보드 → 0 라인 클리어', () => {
    const board = createEmptyBoard();
    const { linesCleared } = clearLines(board);
    expect(linesCleared).toBe(0);
  });
  it('가득 찬 행 1개 → 1 클리어', () => {
    const board = createEmptyBoard();
    board[19] = Array(BOARD_COLS).fill(1);
    const { board: next, linesCleared } = clearLines(board);
    expect(linesCleared).toBe(1);
    expect(next[19].every((c) => c === 0)).toBe(true);
  });
  it('4줄 동시 클리어', () => {
    const board = createEmptyBoard();
    for (let r = 16; r < 20; r++) board[r] = Array(BOARD_COLS).fill(1);
    const { linesCleared, board: next } = clearLines(board);
    expect(linesCleared).toBe(4);
    expect(next.every((row) => row.every((c) => c === 0))).toBe(true);
  });
  it('부분 클리어 후 위 블록이 내려옴', () => {
    const board = createEmptyBoard();
    board[19] = Array(BOARD_COLS).fill(1);
    board[18][0] = 2; // 구멍 있는 행 (클리어 안됨)
    const { board: next } = clearLines(board);
    expect(next[19][0]).toBe(2);
  });
});

describe('isTopReached', () => {
  it('row >= 0 → false', () => {
    expect(isTopReached([{ col: 0, row: 0 }])).toBe(false);
  });
  it('row < 0 → true', () => {
    expect(isTopReached([{ col: 0, row: -1 }])).toBe(true);
  });
});
