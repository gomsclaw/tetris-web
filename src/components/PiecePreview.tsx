import { TETROMINOES, CELL_COLORS, TETROMINO_COLOR, type TetrominoType } from '../game/tetrominos';

interface Props {
  type: TetrominoType | null;
  size?: number; // 셀 크기(px)
}

export function PiecePreview({ type, size = 20 }: Props) {
  if (!type) {
    return (
      <div
        style={{ width: size * 4, height: size * 4 }}
        className="bg-gray-900 border border-gray-700 flex items-center justify-center"
      >
        <span className="text-gray-600 text-xs">없음</span>
      </div>
    );
  }

  const cells = TETROMINOES[type][0];
  const colorCode = TETROMINO_COLOR[type];
  const color = CELL_COLORS[colorCode];

  // 4×4 그리드에 셀 위치 표시
  const grid = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => {
      return cells.some((cell) => cell.row === r && cell.col === c);
    })
  );

  return (
    <div
      style={{ width: size * 4, height: size * 4 }}
      className="bg-gray-900 border border-gray-700 flex items-center justify-center"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(4, ${size}px)`,
          gridTemplateRows: `repeat(4, ${size}px)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((filled, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: size,
                height: size,
                backgroundColor: filled ? color : 'transparent',
                border: filled ? '1px solid rgba(255,255,255,0.2)' : 'none',
                boxSizing: 'border-box',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
