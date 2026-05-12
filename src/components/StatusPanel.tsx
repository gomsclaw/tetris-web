import { PiecePreview } from './PiecePreview';
import type { TetrominoType } from '../game/tetrominos';

interface Props {
  score: number;
  bestScore: number;
  lines: number;
  level: number;
  nextPieces: TetrominoType[];
  held: TetrominoType | null;
  canHold: boolean;
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-2 text-center">
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold text-white mt-1">{value}</div>
    </div>
  );
}

export function StatusPanel({ score, bestScore, lines, level, nextPieces, held, canHold }: Props) {
  return (
    <div className="flex flex-col gap-3 w-32">
      <StatBlock label="Score" value={score.toLocaleString()} />
      <StatBlock label="Best" value={bestScore.toLocaleString()} />
      <StatBlock label="Lines" value={lines} />
      <StatBlock label="Level" value={level} />

      <div className="bg-gray-900 border border-gray-700 rounded p-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">Next</div>
        <div className="flex flex-col gap-1 items-center">
          {nextPieces.slice(0, 3).map((type, i) => (
            <PiecePreview key={i} type={type} size={14} />
          ))}
        </div>
      </div>

      <div className={`bg-gray-900 border rounded p-2 ${canHold ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">Hold</div>
        <div className="flex justify-center">
          <PiecePreview type={held} size={14} />
        </div>
      </div>

      <div className="text-xs text-gray-600 leading-relaxed">
        <div>← → 이동</div>
        <div>↓ 소프트드롭</div>
        <div>Space 하드드롭</div>
        <div>↑ CW 회전</div>
        <div>Z CCW 회전</div>
        <div>C 홀드</div>
        <div>P 일시정지</div>
      </div>
    </div>
  );
}
