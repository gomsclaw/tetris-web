import { useMemo } from 'react';
import { BOARD_COLS, BOARD_ROWS } from '../game/constants';
import { CELL_COLORS, type TetrominoType, TETROMINO_COLOR } from '../game/tetrominos';
import type { Board } from '../game/board';
import type { Pos } from '../game/tetrominos';

interface Props {
  board: Board;
  currentCells: Pos[];
  ghostCells: Pos[];
  currentType: TetrominoType;
}

export function GameBoard({ board, currentCells, ghostCells, currentType }: Props) {
  const colorCode = TETROMINO_COLOR[currentType];
  const ghostColor = CELL_COLORS[colorCode];

  const cellSet = useMemo(() => {
    const s = new Set<string>();
    currentCells.forEach((p) => s.add(`${p.row},${p.col}`));
    return s;
  }, [currentCells]);

  const ghostSet = useMemo(() => {
    const s = new Set<string>();
    ghostCells.forEach((p) => s.add(`${p.row},${p.col}`));
    return s;
  }, [ghostCells]);

  return (
    <div
      className="relative border-2 border-gray-500 bg-gray-950"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
        width: '100%',
        aspectRatio: `${BOARD_COLS} / ${BOARD_ROWS}`,
        boxShadow: '0 0 0 1px rgba(6,182,212,0.12), 0 0 40px rgba(6,182,212,0.07), 0 24px 64px rgba(0,0,0,0.7)',
      }}
      role="grid"
      aria-label="테트리스 게임 보드"
    >
      {Array.from({ length: BOARD_ROWS }, (_, row) =>
        Array.from({ length: BOARD_COLS }, (_, col) => {
          const key = `${row},${col}`;
          const boardVal = board[row]?.[col] ?? 0;
          const isCurrent = cellSet.has(key);
          const isGhost = !isCurrent && ghostSet.has(key);

          let bg = 'transparent';
          let opacity = 1;
          let borderColor = 'rgba(255,255,255,0.04)';

          if (isCurrent) {
            bg = CELL_COLORS[colorCode];
            borderColor = 'rgba(255,255,255,0.3)';
          } else if (isGhost) {
            borderColor = ghostColor;
            opacity = 0.5;
          } else if (boardVal !== 0) {
            bg = CELL_COLORS[boardVal];
            borderColor = 'rgba(255,255,255,0.2)';
          }

          return (
            <div
              key={key}
              role="gridcell"
              style={{
                backgroundColor: bg,
                opacity,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor,
                boxSizing: 'border-box',
              }}
            />
          );
        })
      )}
    </div>
  );
}
