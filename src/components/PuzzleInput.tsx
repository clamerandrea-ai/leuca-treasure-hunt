import { useState } from 'react';
import type { Stage } from '../types/game';
import { useGame } from '../context/GameContext';
import { GAME_MASTER_PHONE } from '../data/stages';

interface PuzzleInputProps {
  stage: Stage;
}

export function PuzzleInput({ stage }: PuzzleInputProps) {
  const { dispatch } = useGame();
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const puzzle = stage.puzzle;

  const checkAnswer = (value: string) => {
    const normalized = value.trim().toLowerCase();
    const isCorrect = stage.acceptedAnswers.some(
      a => a.toLowerCase() === normalized
    );

    if (isCorrect) {
      if (navigator.vibrate) navigator.vibrate(200);
      dispatch({ type: 'SOLVE_PUZZLE', points: stage.points });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      if (newAttempts >= 3) {
        setShowHint(true);
      }
    }
  };

  const handleQuizSelect = (index: number) => {
    if (puzzle.type !== 'quiz') return;
    const isCorrect = index === puzzle.correctIndex;
    if (isCorrect) {
      if (navigator.vibrate) navigator.vibrate(200);
      dispatch({ type: 'SOLVE_PUZZLE', points: stage.points });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      if (newAttempts >= 3) setShowHint(true);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `🏴‍☠️ CACCIA AL TESORO DI LEUCA\n\n📍 Tappa ${stage.id}: ${stage.name}\n\n🎬 Ecco la nostra prova!`
    );
    window.open(`https://wa.me/${GAME_MASTER_PHONE}?text=${message}`, '_blank');
    setCodeSent(true);
  };

  if (puzzle.type === 'challenge') {
    return (
      <div className="space-y-4">
        {/* Challenge icon */}
        <div className="text-center">
          <span className="text-4xl">🎬</span>
          <p className="text-gold-bright font-bold text-sm mt-1">PROVA SPECIALE</p>
        </div>

        {/* Challenge description */}
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-3">
          <p className="text-sand text-base leading-relaxed font-medium">
            {puzzle.challengeDescription}
          </p>
        </div>

        {/* Instructions */}
        <p className="text-sand/70 text-sm leading-relaxed">
          {puzzle.question}
        </p>

        {/* WhatsApp button */}
        <button
          onClick={openWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-lg py-3 text-sm active:bg-[#1da851] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Invia foto/video su WhatsApp
        </button>

        {/* Code input - shown after WhatsApp opened or always visible */}
        <div className={`space-y-2 ${codeSent ? '' : 'opacity-60'}`}>
          <p className="text-sand/60 text-xs text-center">
            {codeSent
              ? 'Hai ricevuto il codice dal Game Master? Inseriscilo qui:'
              : 'Dopo aver inviato la prova, riceverai un codice segreto'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer(answer)}
              placeholder="CODICE SEGRETO"
              className="flex-1 bg-sea-medium/80 border border-gold/20 rounded-lg px-3 py-2.5 text-gold-bright placeholder-sand/30 text-sm text-center font-mono tracking-widest outline-none focus:border-gold/50 transition-colors uppercase"
            />
            <button
              onClick={() => checkAnswer(answer)}
              className="bg-gold/80 text-sea-dark font-semibold rounded-lg px-4 py-2.5 text-sm active:bg-gold transition-colors"
            >
              Sblocca
            </button>
          </div>
        </div>

        {showError && (
          <p className="text-brick-light text-sm text-center animate-pulse">
            Codice errato! Controlla il messaggio del Game Master.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sand text-base leading-relaxed">{puzzle.question}</p>

      {puzzle.type === 'quiz' && 'options' in puzzle ? (
        <div className="grid grid-cols-2 gap-2">
          {puzzle.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleQuizSelect(i)}
              className="bg-sea-medium/80 border border-gold/20 rounded-lg px-3 py-3 text-sand text-sm active:bg-gold/20 transition-colors duration-200"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer(answer)}
            placeholder="Scrivi la risposta..."
            className="flex-1 bg-sea-medium/80 border border-gold/20 rounded-lg px-3 py-2.5 text-sand placeholder-sand/30 text-sm outline-none focus:border-gold/50 transition-colors"
          />
          <button
            onClick={() => checkAnswer(answer)}
            className="bg-gold/80 text-sea-dark font-semibold rounded-lg px-4 py-2.5 text-sm active:bg-gold transition-colors"
          >
            Verifica
          </button>
        </div>
      )}

      {showError && (
        <p className="text-brick-light text-sm animate-pulse">
          Riprova, Ferruccio non la farebbe cosi facile
        </p>
      )}

      {showHint && (
        <p className="text-gold/60 text-xs italic">
          Suggerimento: la risposta e legata al luogo in cui ti trovi. Guardati intorno!
        </p>
      )}
    </div>
  );
}
