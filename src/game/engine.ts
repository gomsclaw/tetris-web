import {
  type TetrominoType,
  type Rotation,
  type Pos,
  getCells,
  spawnOrigin,
  createBag,
  TETROMINO_COLOR,
} from './tetrominos';
import {
  type Board,
  createEmptyBoard,
  hasCollision,
  placeCells,
  clearLines,
} from './board';
import { tryRotate } from './rotation';
import { getSpeed, LINES_PER_LEVEL, LINE_SCORE } from './constants';

export interface Piece {
  type: TetrominoType;
  rotation: Rotation;
  origin: Pos;
}

export interface GameState {
  board: Board;
  current: Piece;
  next: TetrominoType[];  // 미리보기 (최소 1개)
  held: TetrominoType | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
  bag: TetrominoType[];
}

function drawFromBag(bag: TetrominoType[]): { type: TetrominoType; bag: TetrominoType[] } {
  if (bag.length === 0) bag = createBag();
  const [type, ...rest] = bag;
  return { type, bag: rest };
}

function makePiece(type: TetrominoType): Piece {
  return { type, rotation: 0, origin: spawnOrigin(type) };
}

export function initGameState(): GameState {
  let bag = createBag();
  const { type: currentType, bag: bag1 } = drawFromBag(bag);
  bag = bag1;

  // 미리보기 3개 확보
  const nextTypes: TetrominoType[] = [];
  for (let i = 0; i < 3; i++) {
    const { type, bag: nextBag } = drawFromBag(bag);
    nextTypes.push(type);
    bag = nextBag;
  }

  return {
    board: createEmptyBoard(),
    current: makePiece(currentType),
    next: nextTypes,
    held: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    paused: false,
    bag,
  };
}

function spawnNext(state: GameState, resetCanHold = true): GameState {
  const [nextType, ...remainingNext] = state.next;
  let bag = state.bag;

  // 미리보기를 3개로 유지
  const refills: TetrominoType[] = [];
  while (remainingNext.length + refills.length < 3) {
    const { type, bag: nextBag } = drawFromBag(bag);
    refills.push(type);
    bag = nextBag;
  }

  const newPiece = makePiece(nextType);
  const cells = getCells(newPiece.type, newPiece.rotation, newPiece.origin);
  const gameOver = hasCollision(state.board, cells);

  return {
    ...state,
    current: newPiece,
    next: [...remainingNext, ...refills],
    bag,
    canHold: resetCanHold ? true : state.canHold,
    gameOver,
  };
}

function lockPiece(state: GameState): GameState {
  const { current, board } = state;
  const cells = getCells(current.type, current.rotation, current.origin);
  const colorCode = TETROMINO_COLOR[current.type];
  const newBoard = placeCells(board, cells, colorCode);
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);

  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
  const scoreGain = linesCleared > 0
    ? (LINE_SCORE[linesCleared] ?? 0) * state.level
    : 0;

  const afterLock: GameState = {
    ...state,
    board: clearedBoard,
    score: state.score + scoreGain,
    lines: newLines,
    level: newLevel,
  };

  return spawnNext(afterLock);
}

export function moveLeft(state: GameState): GameState {
  if (state.gameOver || state.paused) return state;
  const { current, board } = state;
  const newOrigin: Pos = { col: current.origin.col - 1, row: current.origin.row };
  const cells = getCells(current.type, current.rotation, newOrigin);
  if (hasCollision(board, cells)) return state;
  return { ...state, current: { ...current, origin: newOrigin } };
}

export function moveRight(state: GameState): GameState {
  if (state.gameOver || state.paused) return state;
  const { current, board } = state;
  const newOrigin: Pos = { col: current.origin.col + 1, row: current.origin.row };
  const cells = getCells(current.type, current.rotation, newOrigin);
  if (hasCollision(board, cells)) return state;
  return { ...state, current: { ...current, origin: newOrigin } };
}

export function moveDown(state: GameState): GameState {
  if (state.gameOver || state.paused) return state;
  const { current, board } = state;
  const newOrigin: Pos = { col: current.origin.col, row: current.origin.row + 1 };
  const cells = getCells(current.type, current.rotation, newOrigin);
  if (hasCollision(board, cells)) {
    // 바닥에 닿았으면 잠금
    return lockPiece(state);
  }
  return { ...state, current: { ...current, origin: newOrigin } };
}

export function hardDrop(state: GameState): GameState {
  if (state.gameOver || state.paused) return state;
  let s = state;
  let dropped = 0;
  while (true) {
    const { current, board } = s;
    const newOrigin: Pos = { col: current.origin.col, row: current.origin.row + 1 };
    const cells = getCells(current.type, current.rotation, newOrigin);
    if (hasCollision(board, cells)) break;
    s = { ...s, current: { ...current, origin: newOrigin } };
    dropped++;
  }
  // 하드 드롭 보너스: 칸당 2점
  s = { ...s, score: s.score + dropped * 2 };
  return lockPiece(s);
}

export function rotate(state: GameState, clockwise = true): GameState {
  if (state.gameOver || state.paused) return state;
  const { current, board } = state;
  const result = tryRotate(board, current.type, current.rotation, current.origin, clockwise);
  if (!result.success) return state;
  return {
    ...state,
    current: {
      ...current,
      rotation: result.newRotation,
      origin: result.newOrigin,
    },
  };
}

export function holdPiece(state: GameState): GameState {
  if (state.gameOver || state.paused || !state.canHold) return state;

  const currentType = state.current.type;

  if (state.held === null) {
    // 처음 홀드: 다음 피스로 교체, canHold는 false 유지
    return spawnNext({ ...state, held: currentType, canHold: false }, false);
  }

  // 홀드 교체
  const swappedPiece = makePiece(state.held);
  const cells = getCells(swappedPiece.type, swappedPiece.rotation, swappedPiece.origin);
  if (hasCollision(state.board, cells)) return state;

  return {
    ...state,
    current: swappedPiece,
    held: currentType,
    canHold: false,
  };
}

export function tick(state: GameState): GameState {
  if (state.gameOver || state.paused) return state;
  return moveDown(state);
}

export function getGhostOrigin(state: GameState): Pos {
  const { current, board } = state;
  let row = current.origin.row;
  while (true) {
    const nextOrigin: Pos = { col: current.origin.col, row: row + 1 };
    const cells = getCells(current.type, current.rotation, nextOrigin);
    if (hasCollision(board, cells)) break;
    row++;
  }
  return { col: current.origin.col, row };
}

export function getCurrentCells(state: GameState): Pos[] {
  const { current } = state;
  return getCells(current.type, current.rotation, current.origin);
}

export function getGhostCells(state: GameState): Pos[] {
  const ghostOrigin = getGhostOrigin(state);
  const { current } = state;
  return getCells(current.type, current.rotation, ghostOrigin);
}

export { getSpeed };
