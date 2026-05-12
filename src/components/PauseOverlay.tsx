interface Props {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      role="dialog"
      aria-modal="true"
      aria-label="일시정지"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-10 flex flex-col items-center gap-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-white">일시정지</h2>
        <button
          onClick={onResume}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300"
          autoFocus
        >
          Resume
        </button>
        <p className="text-gray-500 text-sm">P 키를 눌러 재개</p>
      </div>
    </div>
  );
}
