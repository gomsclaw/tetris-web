export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Rotation = 0 | 1 | 2 | 3; // 0=스폰, 1=CW, 2=180, 3=CCW

export interface Pos {
  col: number;
  row: number;
}

// 각 테트로미노의 4개 회전 상태별 셀 오프셋 (col, row)
// SRS 기준, row 아래로 증가
type PieceMatrix = [Pos, Pos, Pos, Pos];
type RotationTable = [PieceMatrix, PieceMatrix, PieceMatrix, PieceMatrix];

export const TETROMINOES: Record<TetrominoType, RotationTable> = {
  I: [
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 }],
    [{ col: 2, row: 0 }, { col: 2, row: 1 }, { col: 2, row: 2 }, { col: 2, row: 3 }],
    [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }, { col: 3, row: 2 }],
    [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 1, row: 2 }, { col: 1, row: 3 }],
  ],
  O: [
    [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }],
    [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }],
    [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }],
    [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }],
  ],
  T: [
    [{ col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }],
    [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 1, row: 2 }],
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 1, row: 2 }],
    [{ col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 2 }],
  ],
  S: [
    [{ col: 1, row: 0 }, { col: 2, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }],
    [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 2, row: 2 }],
    [{ col: 1, row: 1 }, { col: 2, row: 1 }, { col: 0, row: 2 }, { col: 1, row: 2 }],
    [{ col: 0, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 2 }],
  ],
  Z: [
    [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 1 }],
    [{ col: 2, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 1, row: 2 }],
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 2 }, { col: 2, row: 2 }],
    [{ col: 1, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 0, row: 2 }],
  ],
  J: [
    [{ col: 0, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }],
    [{ col: 1, row: 0 }, { col: 2, row: 0 }, { col: 1, row: 1 }, { col: 1, row: 2 }],
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 2, row: 2 }],
    [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 0, row: 2 }, { col: 1, row: 2 }],
  ],
  L: [
    [{ col: 2, row: 0 }, { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }],
    [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 1, row: 2 }, { col: 2, row: 2 }],
    [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 0, row: 2 }],
    [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 1, row: 1 }, { col: 1, row: 2 }],
  ],
};

// 테트로미노 색상 코드 (보드 셀 값)
export const TETROMINO_COLOR: Record<TetrominoType, number> = {
  I: 1,
  O: 2,
  T: 3,
  S: 4,
  Z: 5,
  J: 6,
  L: 7,
};

// CSS 색상 (Tailwind 기준)
export const CELL_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#00f0f0', // I - cyan
  2: '#f0f000', // O - yellow
  3: '#a000f0', // T - purple
  4: '#00f000', // S - green
  5: '#f00000', // Z - red
  6: '#0000f0', // J - blue
  7: '#f0a000', // L - orange
};

export const ALL_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// 7-bag 랜덤 생성
export function createBag(): TetrominoType[] {
  const bag = [...ALL_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function getCells(type: TetrominoType, rotation: Rotation, origin: Pos): Pos[] {
  return TETROMINOES[type][rotation].map((offset) => ({
    col: origin.col + offset.col,
    row: origin.row + offset.row,
  }));
}

// 스폰 위치: 보드 상단 중앙
export function spawnOrigin(type: TetrominoType): Pos {
  // I, O는 4×4 바운딩박스 → col 3에서 시작
  // 나머지는 3×3 → col 3에서 시작
  const col = type === 'O' ? 4 : 3;
  const row = type === 'I' ? -1 : -1;
  return { col, row };
}
