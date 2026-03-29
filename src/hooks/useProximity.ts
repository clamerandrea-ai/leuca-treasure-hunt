import { useMemo } from 'react';
import { haversineDistance, calculateBearing, formatDistance } from '../utils/distance';

interface UseProximityReturn {
  distance: number;
  isNear: boolean;
  bearing: number;
  distanceText: string;
}

export function useProximity(
  userLat: number | null,
  userLng: number | null,
  targetLat: number,
  targetLng: number,
  proximityRadius: number
): UseProximityReturn {
  return useMemo(() => {
    if (userLat === null || userLng === null) {
      return {
        distance: Infinity,
        isNear: false,
        bearing: 0,
        distanceText: 'In attesa del GPS...'
      };
    }

    const distance = haversineDistance(userLat, userLng, targetLat, targetLng);
    const bearing = calculateBearing(userLat, userLng, targetLat, targetLng);
    const isNear = distance < proximityRadius;
    const distanceText = formatDistance(distance);

    return { distance, isNear, bearing, distanceText };
  }, [userLat, userLng, targetLat, targetLng, proximityRadius]);
}
