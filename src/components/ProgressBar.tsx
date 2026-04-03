import { useGame } from '../context/GameContext';
import { getRouteOrder } from '../data/stages';

export function ProgressBar() {
  const { state } = useGame();
  const routeOrder = getRouteOrder(state.route);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-sea-dark/90 backdrop-blur-sm border-t border-gold/20 px-4 py-2">
      <div className="flex items-center gap-1 max-w-md mx-auto">
        {routeOrder.map((stageId, idx) => {
          const step = idx + 1;
          const isCompleted = state.completedStages.includes(stageId);
          const isCurrent = step === state.currentStep;
          return (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gold'
                  : isCurrent
                  ? 'bg-gold/50 animate-pulse'
                  : 'bg-sea-medium'
              }`}
            />
          );
        })}
      </div>
      <p className="text-center text-[10px] text-sand/50 mt-1">
        Tappa {state.currentStep} di {routeOrder.length}
      </p>
    </div>
  );
}
