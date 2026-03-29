import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';
import { addLeaderboardEntry, clearGameState } from '../utils/storage';
import { Leaderboard } from './Leaderboard';

export function VictoryScreen() {
  const { state, dispatch } = useGame();
  const { formatted } = useTimer(state.startTime, state.endTime);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!savedRef.current && state.endTime && state.startTime) {
      savedRef.current = true;
      addLeaderboardEntry({
        teamName: state.teamName,
        score: state.score,
        totalTime: state.endTime - state.startTime,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [state.endTime, state.startTime, state.teamName, state.score]);

  const handleRestart = () => {
    clearGameState();
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="parchment h-full flex flex-col items-center justify-center px-6 py-8 overflow-y-auto screen-transition">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="text-5xl">&#127942;</div>
          <h1 className="text-gold-bright text-2xl font-bold">
            Il Tesoro e Vostro!
          </h1>
          <p className="text-sand/70 text-sm">
            Avete completato la caccia al tesoro di Ferruccio
          </p>
        </div>

        <div className="parchment-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sand/60 text-sm">Squadra</span>
            <span className="text-gold-bright font-bold">{state.teamName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sand/60 text-sm">Punteggio</span>
            <span className="text-gold-bright font-mono text-lg font-bold">
              {state.score}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sand/60 text-sm">Tempo totale</span>
            <span className="text-gold font-mono">{formatted}</span>
          </div>
        </div>

        {/* Final story */}
        <div className="parchment-card p-4 story-enter">
          <blockquote className="text-sand/80 text-sm italic leading-relaxed">
            "Il vero tesoro non erano le monete d'oro. Era la strada che avete percorso per trovarle.
            Ferruccio lo sapeva: ogni passo tra queste strade racconta una storia di mare, coraggio e astuzia.
            Ora questa storia e anche vostra."
          </blockquote>
        </div>

        <div className="parchment-card p-4">
          <Leaderboard />
        </div>

        <button
          onClick={handleRestart}
          className="w-full bg-sea-medium border border-gold/30 text-gold font-semibold rounded-lg py-3 text-sm active:bg-sea-dark transition-colors"
        >
          Gioca di nuovo
        </button>
      </div>
    </div>
  );
}
