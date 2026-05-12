interface Props {
  score: number;
  bestScore: number;
  lines: number;
  level: number;
  onPlayAgain: () => void;
}

export function GameOverOverlay({ score, bestScore, lines, level, onPlayAgain }: Props) {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(2,2,4,0.85)' }}
      role="dialog"
      aria-modal="true"
      aria-label="게임 오버"
    >
      <div className="bg-gray-900 border border-gray-600 rounded-xl p-10 flex flex-col items-center gap-5 shadow-2xl min-w-60">
        <h2 className="text-4xl font-extrabold text-red-400">Game Over</h2>

        {isNewBest && (
          <div className="text-yellow-400 font-bold text-sm animate-pulse">
            🏆 새 최고 점수!
          </div>
        )}

        <div className="w-full space-y-2 text-center">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">점수</div>
            <div className="text-3xl font-bold text-white">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">최고 점수</div>
            <div className="text-xl font-bold text-yellow-400">{bestScore.toLocaleString()}</div>
          </div>
          <div className="flex gap-6 justify-center text-sm text-gray-400">
            <div>라인 <span className="text-white font-semibold">{lines}</span></div>
            <div>레벨 <span className="text-white font-semibold">{level}</span></div>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300 mt-2"
          autoFocus
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
