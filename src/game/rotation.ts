import { type TetrominoType, type Rotation, type Pos, getCells } from './tetrominos';
import { hasCollision } from './board';
import type { Board } from './board';

// SRS Wall Kick 데이터: [fromRotation][kickIndex] = [dcol, drow]
// J, L, S, T, Z 피스 공통
const JLSTZ_KICKS: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '1->0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '1->2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2->1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '2->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '3->2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3->0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '0->3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
};

// I 피스 전용 킥 테이블
const I_KICKS: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};

function getKickTable(type: TetrominoType): Record<string, [number, number][]> {
  return type === 'I' ? I_KICKS : JLSTZ_KICKS;
}

function nextRotation(current: Rotation, cw: boolean): Rotation {
  if (cw) return ((current + 1) % 4) as Rotation;
  return ((current + 3) % 4) as Rotation;
}

export interface RotateResult {
  success: boolean;
  newRotation: Rotation;
  newOrigin: Pos;
}

export function tryRotate(
  board: Board,
  type: TetrominoType,
  rotation: Rotation,
  origin: Pos,
  clockwise = true
): RotateResult {
  if (type === 'O') {
    return { success: true, newRotation: rotation, newOrigin: origin };
  }

  const next = nextRotation(rotation, clockwise);
  const key = `${rotation}->${next}`;
  const kicks = getKickTable(type)[key] ?? [[0, 0]];

  for (const [dcol, drow] of kicks) {
    const testOrigin: Pos = { col: origin.col + dcol, row: origin.row + drow };
    const cells = getCells(type, next, testOrigin);
    if (!hasCollision(board, cells)) {
      return { success: true, newRotation: next, newOrigin: testOrigin };
    }
  }

  return { success: false, newRotation: rotation, newOrigin: origin };
}
