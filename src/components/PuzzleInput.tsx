import { useState } from 'react';
import type { Stage } from '../types/game';
import { useGame } from '../context/GameContext';

interface PuzzleInputProps {
  stage: Stage;
}

export function PuzzleInput({ stage }: PuzzleInputProps) {
  const { dispatch } = useGame();
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
