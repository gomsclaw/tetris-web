import type { ReactNode } from 'react';
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

function StatLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs text-gray-500 uppercase tracking-widest">{children}</div>
  );
}

export function StatusPanel({ score, bestScore, lines, level, nextPieces, held, canHold }: Props) {
  return (
    <div className="flex flex-col gap-2 w-[132px]">
      {/* Score — primary stat */}
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-2 text-center">
        <StatLabel>Score</StatLabel>
        <div className="text-2xl font-black text-cyan-300 mt-0.5 leading-tight">{score.toLocaleString()}</div>
      </div>

      {/* Best — secondary */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-center">
        <StatLabel>Best</StatLabel>
        <div className="text-base font-bold text-yellow-400 mt-0.5">{bestScore.toLocaleString()}</div>
      </div>

      {/* Lines + Level — compact row */}
      <div className="flex gap-2">
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-center">
          <StatLabel>Lines</StatLabel>
          <div className="text-sm font-bold text-white mt-0.5">{lines}</div>
        </div>
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-center">
          <StatLabel>Lv</StatLabel>
          <div className="text-sm font-bold text-white mt-0.5">{level}</div>
        </div>
      </div>

      {/* Next pieces */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-2">
        <StatLabel>Next</StatLabel>
        <div className="flex flex-col gap-1 items-center mt-1.5">
          {nextPieces.slice(0, 3).map((type, i) => (
            <PiecePreview key={i} type={type} size={14} />
          ))}
        </div>
      </div>

      {/* Hold */}
      <div className={`bg-gray-900 border rounded-lg p-2 ${canHold ? 'border-gray-700' : 'border-gray-800 opacity-40'}`}>
        <StatLabel>Hold</StatLabel>
        <div className="flex justify-center mt-1.5">
          <PiecePreview type={held} size={14} />
        </div>
      </div>

      {/* Key hints */}
      <div className="text-[10px] text-gray-600 leading-relaxed pt-0.5">
        <div>← → 이동 &nbsp; ↓ 소프트</div>
        <div>Space 하드드롭</div>
        <div>↑/Z 회전 &nbsp; C 홀드</div>
        <div>P 일시정지</div>
      </div>
    </div>
  );
}
