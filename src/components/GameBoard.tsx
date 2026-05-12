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
      className="relative border-2 border-gray-600 bg-gray-950"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
        width: '100%',
        aspectRatio: `${BOARD_COLS} / ${BOARD_ROWS}`,
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
          let border = 'transparent';

          if (isCurrent) {
            bg = CELL_COLORS[colorCode];
            border = 'rgba(255,255,255,0.3)';
          } else if (isGhost) {
            bg = 'transparent';
            border = ghostColor;
            opacity = 0.5;
          } else if (boardVal !== 0) {
            bg = CELL_COLORS[boardVal];
            border = 'rgba(255,255,255,0.2)';
          }

          return (
            <div
              key={key}
              role="gridcell"
              style={{
                backgroundColor: bg,
                opacity,
                borderWidth: boardVal !== 0 || isCurrent ? '1px' : '0',
                borderStyle: 'solid',
                borderColor: border,
                boxSizing: 'border-box',
              }}
            />
          );
        })
      )}
    </div>
  );
}
