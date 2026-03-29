import { useState, useEffect, useCallback } from 'react';

export function useTimer(startTime: number | null, endTime: number | null) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime || endTime) return;

    const update = () => setElapsed(Date.now() - startTime);
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  useEffect(() => {
    if (startTime && endTime) {
      setElapsed(endTime - startTime);
    }
  }, [startTime, endTime]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    elapsed,
    formatted: formatTime(elapsed),
    formatTime
  };
}
