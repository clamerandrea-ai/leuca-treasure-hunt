import type { Stage } from '../types/game';
import { useGame } from '../context/GameContext';
import { getRouteOrder } from '../data/stages';

interface StoryRevealProps {
  stage: Stage;
}

export function StoryReveal({ stage }: StoryRevealProps) {
  const { state, dispatch } = useGame();
  const isLastStage = state.currentStep >= getRouteOrder(state.route).length;

  return (
    <div className="story-enter space-y-4">
      <div className="flex items-center gap-2 text-gold-bright">
        <span className="text-lg">&#128220;</span>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          Frammento del Diario
        </h3>
      </div>

      <blockquote className="text-sand/90 text-sm leading-relaxed italic border-l-2 border-gold/40 pl-3">
        {stage.storyFragment}
      </blockquote>

      <div className="text-center text-gold text-sm font-semibold">
        +{stage.points} punti
      </div>

      <button
        onClick={() => {
          if (isLastStage) {
            dispatch({ type: 'NEXT_STAGE' });
          } else {
            dispatch({ type: 'NEXT_STAGE' });
          }
        }}
        className="w-full bg-gold/80 text-sea-dark font-bold rounded-lg py-3 text-sm active:bg-gold transition-colors duration-200"
      >
        {isLastStage ? 'Scopri il tesoro!' : 'Prossima tappa →'}
      </button>
    </div>
  );
}
