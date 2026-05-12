import { useTetrisStore } from './game/store';
import { EntryScreen } from './components/EntryScreen';
import { GameScreen } from './components/GameScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOverOverlay } from './components/GameOverOverlay';

function App() {
  const { screen, game, bestScore, startGame, resumeGame, restartGame } = useTetrisStore();

  return (
    <>
      {screen === 'entry' && (
        <EntryScreen bestScore={bestScore} onStart={startGame} />
      )}

      {(screen === 'playing' || screen === 'paused' || screen === 'gameover') && (
        <GameScreen />
      )}

      {screen === 'paused' && (
        <PauseOverlay onResume={resumeGame} />
      )}

      {screen === 'gameover' && (
        <GameOverOverlay
          score={game.score}
          bestScore={bestScore}
          lines={game.lines}
          level={game.level}
          onPlayAgain={restartGame}
        />
      )}
    </>
  );
}

export default App;
