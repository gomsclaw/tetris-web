interface Props {
  bestScore: number;
  onStart: () => void;
}

export function EntryScreen({ bestScore, onStart }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d0d1f 0%, #020204 100%)' }}
    >
      <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-cyan-400 text-center leading-tight">
        설치 없이 바로, 클래식 테트리스
      </h1>
      <p className="text-gray-400 mb-8 text-base text-center max-w-sm leading-relaxed">
        브라우저만 있으면 됩니다. URL 하나로 즉시 플레이 — 로그인도, 다운로드도 없이.
      </p>

      {bestScore > 0 && (
        <div className="mb-6 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wider">최고 점수</div>
          <div className="text-3xl font-bold text-yellow-400">{bestScore.toLocaleString()}</div>
        </div>
      )}

      <button
        onClick={onStart}
        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 py-4 rounded-lg text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300"
        autoFocus
      >
        ▶ 지금 플레이
      </button>

      <div className="mt-10 text-sm text-gray-500 space-y-1 text-center">
        <div className="font-semibold text-gray-400 mb-2">키보드 조작</div>
        <div>← → — 이동</div>
        <div>↓ — 소프트 드롭</div>
        <div>Space — 하드 드롭</div>
        <div>↑ — CW 회전 &nbsp; Z — CCW 회전</div>
        <div>C — 홀드 &nbsp; P — 일시정지</div>
      </div>
    </div>
  );
}
