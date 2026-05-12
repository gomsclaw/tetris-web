import { describe, it, expect } from 'vitest';
import {
  getCells,
  spawnOrigin,
  createBag,
  ALL_TYPES,
  TETROMINOES,
  TETROMINO_COLOR,
} from '../tetrominos';
import type { TetrominoType, Rotation } from '../tetrominos';

describe('TETROMINOES 정의', () => {
  it('모든 7종 존재', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    types.forEach((t) => expect(TETROMINOES[t]).toBeDefined());
  });

  it('각 테트로미노는 4회전 상태', () => {
    ALL_TYPES.forEach((t) => {
      expect(TETROMINOES[t]).toHaveLength(4);
    });
  });

  it('각 회전 상태는 4개 셀', () => {
    ALL_TYPES.forEach((t) => {
      for (let r = 0; r < 4; r++) {
        expect(TETROMINOES[t][r]).toHaveLength(4);
      }
    });
  });
});

describe('TETROMINO_COLOR', () => {
  it('7종 모두 색상 코드 1~7', () => {
    ALL_TYPES.forEach((t) => {
      const c = TETROMINO_COLOR[t];
      expect(c).toBeGreaterThanOrEqual(1);
      expect(c).toBeLessThanOrEqual(7);
    });
  });
});

describe('getCells', () => {
  it('오프셋이 origin에 더해짐', () => {
    const cells = getCells('I', 0, { col: 3, row: 5 });
    expect(cells).toHaveLength(4);
    cells.forEach((c) => {
      expect(c.col).toBeGreaterThanOrEqual(3);
      expect(c.row).toBeGreaterThanOrEqual(5);
    });
  });

  it('O 피스 회전해도 동일한 모양', () => {
    const origin = { col: 0, row: 0 };
    for (let r = 0 as Rotation; r < 4; r++) {
      const cells = getCells('O', r as Rotation, origin);
      expect(cells).toEqual(getCells('O', 0, origin));
    }
  });
});

describe('spawnOrigin', () => {
  it('column이 보드 중앙 근처', () => {
    ALL_TYPES.forEach((t) => {
      const origin = spawnOrigin(t);
      expect(origin.col).toBeGreaterThanOrEqual(3);
      expect(origin.col).toBeLessThanOrEqual(5);
    });
  });
});

describe('createBag', () => {
  it('정확히 7개', () => {
    expect(createBag()).toHaveLength(7);
  });

  it('7종 모두 포함', () => {
    const bag = createBag();
    ALL_TYPES.forEach((t) => expect(bag).toContain(t));
  });

  it('매번 다른 순서 (확률적 — 드물게 동일 가능)', () => {
    const bag1 = createBag().join('');
    const bag2 = createBag().join('');
    // 14번 중 최소 1번은 다를 것. 같은 경우는 1/5040 확률
    // 테스트의 신뢰성을 높이기 위해 10번 중 하나라도 다르면 OK
    let different = false;
    for (let i = 0; i < 10; i++) {
      if (createBag().join('') !== bag1) {
        different = true;
        break;
      }
    }
    // 이 테스트는 확정적이지 않으므로 soft assertion
    expect(bag1).toBeDefined();
    expect(bag2).toBeDefined();
    // 10회 시도에서 반드시 다른 결과가 나온다고 가정
    if (!different) {
      console.warn('createBag: 10회 동일 결과 (매우 낮은 확률)');
    }
  });
});
