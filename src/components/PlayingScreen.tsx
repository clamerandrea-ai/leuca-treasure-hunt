import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useProximity } from '../hooks/useProximity';
import { useLocationBroadcast } from '../hooks/useLocationBroadcast';
import { subscribeToCommands, isFirebaseConfigured } from '../firebase';
import { getStageForStep, getRouteOrder } from '../data/stages';
import { clearGameState } from '../utils/storage';
import { MapView } from './MapView';
import { Compass } from './Compass';
import { StageCard } from './StageCard';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';
import { RivalTracker } from './RivalTracker';

export function PlayingScreen() {
  const { state, dispatch } = useGame();
  const { position, error: gpsError } = useGeolocation(state.screen === 'playing');

  const currentStage = getStageForStep(state.currentStep, state.route);
  const routeOrder = getRouteOrder(state.route);

  // Broadcast position to Firebase for master tracking
  useLocationBroadcast(
    state.teamName,
    position?.lat ?? null,
    position?.lng ?? null,
    currentStage?.id ?? 1,
    state.currentStep,
    state.route,
    state.screen === 'playing'
  );

  const { isNear, bearing, distanceText } = useProximity(
    position?.lat ?? null,
    position?.lng ?? null,
    currentStage?.lat ?? 0,
    currentStage?.lng ?? 0,
    currentStage?.proximityRadius ?? 50
  );

  // Update near status
  useEffect(() => {
    dispatch({ type: 'SET_NEAR_STAGE', isNear });
  }, [isNear, dispatch]);

  // Vibrate on arrival
  useEffect(() => {
    if (state.isNearStage && !state.showPuzzle && !state.showStory) {
      if (navigator.vibrate) navigator.vibrate(200);
    }
  }, [state.isNearStage, state.showPuzzle, state.showStory]);

  // Listen for Game Master skip command
  useEffect(() => {
    if (!isFirebaseConfigured() || !state.teamName) return;
    const unsub = subscribeToCommands(state.teamName, (action) => {
      if (action === 'skip') {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
        dispatch({ type: 'SOLVE_PUZZLE', points: 0 });
        dispatch({ type: 'NEXT_STAGE' });
      }
    });
    return unsub;
  }, [state.teamName, dispatch]);

  if (!currentStage) return null;

  return (
    <div className="parchment h-full flex flex-col overflow-hidden">
      <Timer />
      <RivalTracker />

      {/* GPS error */}
      {gpsError && (
        <div className="mx-4 mt-14 mb-2 bg-brick/20 border border-brick/40 rounded-lg px-3 py-2 text-sand/80 text-xs text-center">
          {gpsError}
        </div>
      )}

      {/* Map */}
      <div className="pt-14 pb-2 flex justify-center">
        <MapView userPosition={position} />
      </div>

      {/* Compass + distance (only when not showing puzzle/story) */}
      {!state.showPuzzle && !state.showStory && (
        <div className="flex justify-center py-2">
          <Compass bearing={bearing} distanceText={distanceText} />
        </div>
      )}

      {/* Stage card */}
      <div className="flex-1 overflow-y-auto pb-16">
        <StageCard
          stage={currentStage}
          stepNumber={state.currentStep}
          totalSteps={routeOrder.length}
          isNear={state.isNearStage || state.devMode}
        />
      </div>

      {/* Dev mode panel */}
      {state.devMode && (
        <div className="fixed top-12 left-3 z-50 bg-brick/80 backdrop-blur-sm rounded-lg p-2 space-y-1">
          <p className="text-sand text-[10px] font-bold">[DEV] Percorso {state.route}</p>
          <div className="flex flex-wrap gap-1">
            {routeOrder.map((stageId, idx) => {
              const step = idx + 1;
              return (
                <button
                  key={step}
                  onClick={() => dispatch({ type: 'DEV_SKIP_TO_STEP', step })}
                  className={`w-6 h-6 rounded text-[10px] font-bold ${
                    step === state.currentStep
                      ? 'bg-gold text-sea-dark'
                      : state.completedStages.includes(stageId)
                      ? 'bg-green-600 text-white'
                      : 'bg-sea-medium text-sand/50'
                  }`}
                  title={`Step ${step} → Stage ${stageId}`}
                >
                  {step}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ProgressBar />

      {/* Reset button */}
      <button
        onClick={() => {
          if (confirm('Sei sicuro? Perderai tutti i progressi!')) {
            clearGameState();
            dispatch({ type: 'RESET_GAME' });
          }
        }}
        className="fixed bottom-2 right-2 z-50 bg-brick/60 text-sand/60 text-[10px] rounded px-2 py-1"
      >
        Reset
      </button>
    </div>
  );
}
