import { useEffect, useRef } from 'react';
import { broadcastLocation, isFirebaseConfigured } from '../firebase';
import type { GameRoute } from '../types/game';

export function useLocationBroadcast(
  teamName: string,
  lat: number | null,
  lng: number | null,
  currentStage: number,
  currentStep: number,
  route: GameRoute,
  enabled: boolean
) {
  const lastSent = useRef(0);

  useEffect(() => {
    if (!enabled || !lat || !lng || !teamName || !isFirebaseConfigured()) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastSent.current >= 10000) {
        broadcastLocation(teamName, lat, lng, currentStage, currentStep, route);
        lastSent.current = now;
      }
    }, 10000);

    // Send immediately on first call
    broadcastLocation(teamName, lat, lng, currentStage, currentStep, route);
    lastSent.current = Date.now();

    return () => clearInterval(interval);
  }, [enabled, teamName, lat, lng, currentStage, currentStep, route]);
}
