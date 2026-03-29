import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';

export function Timer() {
  const { state } = useGame();
  const { formatted } = useTimer(state.startTime, state.endTime);

  if (!state.startTime) return null;

  return (
    <div className="fixed top-3 right-3 z-50 bg-sea-dark/80 backdrop-blur-sm border border-gold/30 rounded-lg px-3 py-1.5 font-mono text-gold-bright text-sm">
      {formatted}
    </div>
  );
}
