import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, serverTimestamp } from 'firebase/database';
import type { TeamLocation } from './types/game';

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "leuca-treasure-hunt.firebaseapp.com",
  databaseURL: "https://leuca-treasure-hunt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leuca-treasure-hunt",
  storageBucket: "leuca-treasure-hunt.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

let db: ReturnType<typeof getDatabase> | null = null;

function getDb() {
  if (!db) {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  }
  return db;
}

export function isFirebaseConfigured(): boolean {
  return !firebaseConfig.apiKey.includes('XXXX');
}

export function broadcastLocation(teamName: string, lat: number, lng: number, currentStage: number) {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    const teamRef = ref(db, `locations/${encodeTeamName(teamName)}`);
    set(teamRef, {
      teamName,
      lat,
      lng,
      currentStage,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.warn('[Firebase] broadcast error:', e);
  }
}

export function subscribeToLocations(callback: (teams: TeamLocation[]) => void): () => void {
  if (!isFirebaseConfigured()) return () => {};
  try {
    const db = getDb();
    const locationsRef = ref(db, 'locations');
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const teams: TeamLocation[] = Object.values(data);
      // Filter out stale locations (older than 10 minutes)
      const now = Date.now();
      const active = teams.filter(t => t.timestamp && (now - t.timestamp) < 600000);
      callback(active);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[Firebase] subscribe error:', e);
    return () => {};
  }
}

function encodeTeamName(name: string): string {
  return name.replace(/[.#$[\]]/g, '_');
}
