import type { Stage } from '../types/game';
import { useGame } from '../context/GameContext';
import { PuzzleInput } from './PuzzleInput';
import { StoryReveal } from './StoryReveal';

interface StageCardProps {
  stage: Stage;
  isNear: boolean;
}

export function StageCard({ stage, isNear }: StageCardProps) {
  const { state, dispatch } = useGame();

  return (
    <div className="parchment-card p-4 mx-4 max-h-[60vh] overflow-y-auto screen-transition">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gold-bright font-bold text-lg">
          Tappa {stage.id}: {stage.name}
        </h2>
        <span className="text-sand/40 text-xs">
          {stage.id}/{9}
        </span>
      </div>

      {!state.showPuzzle && !state.showStory && (
        <div className="space-y-3">
          <p className="text-sand/80 text-sm italic leading-relaxed">
            "{stage.hint}"
          </p>

          {isNear ? (
            <button
              onClick={() => dispatch({ type: 'UNLOCK_PUZZLE' })}
              className="w-full bg-gold/80 text-sea-dark font-bold rounded-lg py-3 text-sm animate-pulse active:bg-gold transition-colors"
            >
              Sei arrivato! Risolvi l'enigma
            </button>
          ) : (
            <p className="text-sand/40 text-xs text-center">
              Avvicinati al luogo per sbloccare l'enigma...
            </p>
          )}

          {state.devMode && !isNear && (
            <button
              onClick={() => dispatch({ type: 'UNLOCK_PUZZLE' })}
              className="w-full bg-brick/50 border border-brick-light/30 text-sand rounded-lg py-2 text-xs"
            >
              [DEV] Simula posizione
            </button>
          )}
        </div>
      )}

      {state.showPuzzle && !state.showStory && (
        <PuzzleInput stage={stage} />
      )}

      {state.showStory && (
        <StoryReveal stage={stage} />
      )}

      {state.devMode && state.showPuzzle && !state.showStory && (
        <button
          onClick={() => dispatch({ type: 'SOLVE_PUZZLE', points: stage.points })}
          className="mt-3 w-full bg-brick/50 border border-brick-light/30 text-sand rounded-lg py-2 text-xs"
        >
          [DEV] Auto-rispondi
        </button>
      )}
    </div>
  );
}
