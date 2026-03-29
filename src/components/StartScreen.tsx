import { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Leaderboard } from './Leaderboard';
import { clearGameState } from '../utils/storage';

export function StartScreen() {
  const { dispatch } = useGame();
  const [teamName, setTeamName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MASTER_CODE = 'FERRUCCIO71';

  const handleStart = () => {
    const name = teamName.trim();
    if (!name) return;
    if (name.toUpperCase() === MASTER_CODE) {
      dispatch({ type: 'ENTER_MASTER' });
      return;
    }
    clearGameState();
    dispatch({ type: 'START_GAME', teamName: name });
  };

  const handleTitleTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1000);

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      dispatch({ type: 'TOGGLE_DEV_MODE' });
    }
  };

  return (
    <div className="parchment h-full flex flex-col items-center justify-center px-6 py-8 screen-transition">
      <div className="max-w-sm w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2" onClick={handleTitleTap}>
          <div className="text-5xl mb-2">&#9875;</div>
          <h1 className="text-gold-bright text-2xl font-bold tracking-wide">
            Caccia al Tesoro
          </h1>
          <h2 className="text-gold text-lg">di Leuca</h2>
        </div>

        {/* Story premise */}
        <div className="parchment-card p-4 text-sm leading-relaxed space-y-3">
          <p className="text-sand/80">
            <strong className="text-gold-bright">Anno 1971. Santa Maria di Leuca.</strong>
          </p>
          <p className="text-sand/70">
            Ferruccio "il Greco" Cataldo, il piu astuto contrabbandiere del Capo di Leuca,
            fiuto l'arrivo della Guardia di Finanza prima di chiunque altro. In una sola notte,
            nascose il suo ultimo carico — stecche di sigarette, monete d'oro ottomane e una
            mappa dei passaggi segreti nelle grotte — in 9 punti diversi lungo il paese.
          </p>
          <p className="text-sand/70">
            Poi spari. Nessuno lo rivide mai.
          </p>
          <p className="text-sand/70">
            55 anni dopo, un muratore trova un taccuino sigillato in una fessura del molo.
            Dentro: 9 indizi cifrati. E la mappa di Ferruccio.
          </p>
          <p className="text-gold-bright font-semibold">
            Siete voi i primi a leggerla.
          </p>
        </div>

        {/* Team name input */}
        <div className="space-y-3">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Nome della squadra..."
            maxLength={30}
            className="w-full bg-sea-medium/80 border border-gold/30 rounded-lg px-4 py-3 text-sand placeholder-sand/30 text-center outline-none focus:border-gold/60 transition-colors"
          />
          <button
            onClick={handleStart}
            disabled={!teamName.trim()}
            className="w-full bg-gold text-sea-dark font-bold rounded-lg py-3 text-base disabled:opacity-30 disabled:cursor-not-allowed active:bg-gold-bright transition-colors duration-200"
          >
            Inizia la caccia
          </button>
        </div>

        {/* Leaderboard toggle */}
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="w-full text-gold/60 text-sm underline"
        >
          {showLeaderboard ? 'Nascondi classifica' : 'Vedi classifica'}
        </button>

        {showLeaderboard && (
          <div className="parchment-card p-4">
            <Leaderboard />
          </div>
        )}
      </div>
    </div>
  );
}
