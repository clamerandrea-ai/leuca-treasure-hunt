import { useState, useEffect, useCallback } from 'react';

interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  position: GeoPosition | null;
  error: string | null;
  isWatching: boolean;
}

export function useGeolocation(enabled: boolean): UseGeolocationReturn {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    const newPos = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy
    };
    setPosition(newPos);
    setError(null);
    if (import.meta.env.DEV) {
      console.log(`[GPS] ${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)} (±${Math.round(newPos.accuracy)}m)`);
    }
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError('GPS negato. Attiva la geolocalizzazione nelle impostazioni.');
        break;
      case err.POSITION_UNAVAILABLE:
        setError('Posizione non disponibile. Assicurati di essere all\'aperto.');
        break;
      case err.TIMEOUT:
        setError('Timeout GPS. Riprovo...');
        break;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) {
      if (!navigator.geolocation) {
        setError('Geolocalizzazione non supportata dal browser.');
      }
      return;
    }

    setIsWatching(true);
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsWatching(false);
    };
  }, [enabled, handleSuccess, handleError]);

  return { position, error, isWatching };
}
