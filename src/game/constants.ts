export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const HIDDEN_ROWS = 2; // 스폰 버퍼

// 레벨별 낙하 간격 (ms)
export const LEVEL_SPEEDS: Record<number, number> = {
  1: 1000,
  2: 793,
  3: 618,
  4: 473,
  5: 355,
  6: 262,
  7: 190,
  8: 135,
  9: 94,
  10: 83,
  11: 73,
  12: 64,
  13: 55,
  14: 47,
  15: 38,
};

export const getSpeed = (level: number): number => {
  const capped = Math.min(level, 15);
  return LEVEL_SPEEDS[capped] ?? 38;
};

// 레벨 업 기준: 레벨 * 10 라인
export const LINES_PER_LEVEL = 10;

// 점수표 (라인 수 -> 기본 점수, 레벨 곱산)
export const LINE_SCORE: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};
