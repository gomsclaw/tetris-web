import { describe, it, expect } from 'vitest';
import { tryRotate } from '../rotation';
import { createEmptyBoard } from '../board';
import type { Rotation } from '../tetrominos';

describe('tryRotate', () => {
  const board = createEmptyBoard();

  it('T 피스 CW 회전 성공', () => {
    const result = tryRotate(board, 'T', 0, { col: 3, row: 10 }, true);
    expect(result.success).toBe(true);
    expect(result.newRotation).toBe(1);
  });

  it('T 피스 CCW 회전 성공', () => {
    const result = tryRotate(board, 'T', 0, { col: 3, row: 10 }, false);
    expect(result.success).toBe(true);
    expect(result.newRotation).toBe(3);
  });

  it('O 피스 회전 → 항상 성공, 회전값 동일', () => {
    const result = tryRotate(board, 'O', 0, { col: 4, row: 10 }, true);
    expect(result.success).toBe(true);
    expect(result.newRotation).toBe(0);
  });

  it('I 피스 회전 성공', () => {
    const result = tryRotate(board, 'I', 0, { col: 3, row: 10 }, true);
    expect(result.success).toBe(true);
    expect(result.newRotation).toBe(1);
  });

  it('벽에 막혀도 SRS 킥으로 회전 성공', () => {
    // T 피스를 왼쪽 벽 근처에 배치
    const result = tryRotate(board, 'T', 0, { col: 0, row: 10 }, false);
    expect(result.success).toBe(true);
  });

  it('회전 불가 시 success false', () => {
    // 꽉 찬 보드에서 회전 시도
    const fullBoard = createEmptyBoard();
    for (let r = 0; r < 20; r++) {
      for (let c = 0; c < 10; c++) fullBoard[r][c] = 1;
    }
    const result = tryRotate(fullBoard, 'T', 0, { col: 3, row: 5 }, true);
    expect(result.success).toBe(false);
    expect(result.newRotation).toBe(0); // 원래 회전 유지
  });

  it('4방향 CW 회전 사이클', () => {
    let rot: Rotation = 0;
    for (let i = 0; i < 4; i++) {
      const result = tryRotate(board, 'T', rot, { col: 3, row: 10 }, true);
      expect(result.success).toBe(true);
      rot = result.newRotation;
    }
    expect(rot).toBe(0); // 4번 CW → 원점
  });
});
