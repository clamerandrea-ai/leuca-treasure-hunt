import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { subscribeToLocations, isFirebaseConfigured } from '../firebase';
import { getRouteOrder } from '../data/stages';

interface RivalGroup {
  teamName: string;
  bestStep: number;
}

export function RivalTracker() {
  const { state } = useGame();
  const [rivalGroups, setRivalGroups] = useState<RivalGroup[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const prevRivalsRef = useRef<RivalGroup[]>([]);
  const firebaseOk = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseOk || state.screen !== 'playing') return;
    const unsub = subscribeToLocations((teams) => {
      // Filter out our own team, then group by team name
      const others = teams.filter(t => t.teamName !== state.teamName);
      const grouped = new Map<string, number>();
      for (const player of others) {
        const step = player.currentStep || player.currentStage || 1;
        const current = grouped.get(player.teamName) || 0;
        if (step > current) grouped.set(player.teamName, step);
      }
      const groups: RivalGroup[] = Array.from(grouped, ([teamName, bestStep]) => ({ teamName, bestStep }));
      setRivalGroups(groups);
    });
    return unsub;
  }, [firebaseOk, state.screen, state.teamName]);

  // Detect overtakes
  useEffect(() => {
    if (rivalGroups.length === 0) return;

    for (const rival of rivalGroups) {
      const prev = prevRivalsRef.current.find(r => r.teamName === rival.teamName);
      const prevStep = prev ? prev.bestStep : rival.bestStep;

      if (prevStep <= state.currentStep && rival.bestStep > state.currentStep) {
        setToast(`${rival.teamName} vi ha superato!`);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
      if (prevStep >= state.currentStep && rival.bestStep < state.currentStep && state.currentStep > 1) {
        setToast(`Siete in testa!`);
      }
    }

    prevRivalsRef.current = rivalGroups;
  }, [rivalGroups, state.currentStep]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!firebaseOk || rivalGroups.length === 0) return null;

  const routeLength = getRouteOrder(state.route).length;

  return (
    <>
      {/* Rival banner */}
      <div className="fixed top-10 left-0 right-0 z-40 px-3">
        <div className="bg-sea-dark/90 backdrop-blur-sm border border-gold/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
          {rivalGroups.map((rival) => {
            const isAhead = rival.bestStep > state.currentStep;
            const isSame = rival.bestStep === state.currentStep;

            return (
              <div key={rival.teamName} className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isAhead ? 'bg-red-400' : isSame ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
                <span className="text-sand/70 text-[11px] truncate">{rival.teamName}</span>
                <span className={`text-[11px] font-mono font-bold flex-shrink-0 ${
                  isAhead ? 'text-red-400' : isSame ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {rival.bestStep}/{routeLength}
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
