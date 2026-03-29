import { GameProvider, useGame } from './context/GameContext';
import { StartScreen } from './components/StartScreen';
import { PlayingScreen } from './components/PlayingScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { MasterPanel } from './components/MasterPanel';

function GameRouter() {
  const { state } = useGame();

  switch (state.screen) {
    case 'start':
      return <StartScreen />;
    case 'playing':
      return <PlayingScreen />;
    case 'victory':
      return <VictoryScreen />;
    case 'master':
      return <MasterPanel />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
