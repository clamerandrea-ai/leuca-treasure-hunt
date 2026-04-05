import type { GameState, LeaderboardEntry } from '../types/game';

const GAME_STATE_KEY = 'leuca-hunt-state';
const LEADERBOARD_KEY = 'leuca-hunt-leaderboard';
const DEVICE_ID_KEY = 'leuca-hunt-device-id';

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'unknown';
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadGameState(): Partial<GameState> | null {
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // corrupted data
  }
  return null;
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch {
    // ignore
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      const entries: LeaderboardEntry[] = JSON.parse(data);
      return entries
        .sort((a, b) => b.score - a.score || a.totalTime - b.totalTime)
        .slice(0, 20);
    }
  } catch {
    // corrupted data
  }
  return [];
}

export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  try {
    const entries = getLeaderboard();
    entries.push(entry);
    const sorted = entries
      .sort((a, b) => b.score - a.score || a.totalTime - b.totalTime)
      .slice(0, 20);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sorted));
  } catch {
    // ignore
  }
}
