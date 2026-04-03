import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { subscribeToLocations, isFirebaseConfigured } from '../firebase';
import { getRouteOrder } from '../data/stages';
import type { TeamLocation } from '../types/game';

export function RivalTracker() {
  const { state } = useGame();
  const [rivals, setRivals] = useState<TeamLocation[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const prevRivalsRef = useRef<TeamLocation[]>([]);
  const firebaseOk = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseOk || state.screen !== 'playing') return;
    const unsub = subscribeToLocations((teams) => {
      // Filter out our own team
      const others = teams.filter(t => t.teamName !== state.teamName);
      setRivals(others);
    });
    return unsub;
  }, [firebaseOk, state.screen, state.teamName]);

  // Detect overtakes
  useEffect(() => {
    if (rivals.length === 0) return;

    for (const rival of rivals) {
      const rivalStep = rival.currentStep || rival.currentStage || 1;
      const prev = prevRivalsRef.current.find(r => r.teamName === rival.teamName);
      const prevStep = prev ? (prev.currentStep || prev.currentStage || 1) : rivalStep;

      // Rival just passed us
      if (prevStep <= state.currentStep && rivalStep > state.currentStep) {
        setToast(`${rival.teamName} vi ha superato!`);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
      // We just passed rival
      if (prevStep >= state.currentStep && rivalStep < state.currentStep && state.currentStep > 1) {
        setToast(`Siete in testa!`);
      }
    }

    prevRivalsRef.current = rivals;
  }, [rivals, state.currentStep, state.route, state.teamName]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Don't render anything if no rivals are online
  if (!firebaseOk || rivals.length === 0) return null;

  const routeLength = getRouteOrder(state.route).length;

  return (
    <>
      {/* Rival banner */}
      <div className="fixed top-10 left-0 right-0 z-40 px-3">
        <div className="bg-sea-dark/90 backdrop-blur-sm border border-gold/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
          {rivals.map((rival) => {
            const rivalStep = rival.currentStep || rival.currentStage || 1;
            const isAhead = rivalStep > state.currentStep;
            const isSame = rivalStep === state.currentStep;

            return (
              <div key={rival.teamName} className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isAhead ? 'bg-red-400' : isSame ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
                <span className="text-sand/70 text-[11px] truncate">{rival.teamName}</span>
                <span className={`text-[11px] font-mono font-bold flex-shrink-0 ${
                  isAhead ? 'text-red-400' : isSame ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {rivalStep}/{routeLength}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overtake toast */}
      {toast && (
        <div className="fixed top-24 left-4 right-4 z-50 flex justify-center animate-bounce">
          <div className={`px-4 py-2 rounded-lg font-bold text-sm shadow-lg ${
            toast.includes('superato')
              ? 'bg-red-500/90 text-white'
              : 'bg-green-500/90 text-white'
          }`}>
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
