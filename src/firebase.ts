import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, remove, onValue, serverTimestamp } from 'firebase/database';
import type { TeamLocation } from './types/game';

const firebaseConfig = {
  apiKey: "AIzaSyAWk_8GWLQ-vsnv0LQ1Ndxk573GJ0GLsCM",
  authDomain: "leuca-treasure-hunt.firebaseapp.com",
  databaseURL: "https://leuca-treasure-hunt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leuca-treasure-hunt",
  storageBucket: "leuca-treasure-hunt.firebasestorage.app",
  messagingSenderId: "229879991993",
  appId: "1:229879991993:web:b854aa7a6f742c6bb05568"
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

export function broadcastLocation(teamName: string, lat: number, lng: number, currentStage: number, currentStep: number = 1, route: string = 'A') {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    const teamRef = ref(db, `locations/${encodeTeamName(teamName)}`);
    set(teamRef, {
      teamName,
      lat,
      lng,
      currentStage,
      currentStep,
      route,
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

export function removeTeam(teamName: string) {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    const teamRef = ref(db, `locations/${encodeTeamName(teamName)}`);
    remove(teamRef);
  } catch (e) {
    console.warn('[Firebase] remove error:', e);
  }
}

// --- Skip stage commands (Game Master → Player) ---

export function sendSkipCommand(teamName: string) {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    const cmdRef = ref(db, `commands/${encodeTeamName(teamName)}`);
    set(cmdRef, { action: 'skip', timestamp: serverTimestamp() });
  } catch (e) {
    console.warn('[Firebase] sendSkip error:', e);
  }
}

export function subscribeToCommands(teamName: string, callback: (action: string) => void): () => void {
  if (!isFirebaseConfigured()) return () => {};
  try {
    const db = getDb();
    const cmdRef = ref(db, `commands/${encodeTeamName(teamName)}`);
    const unsubscribe = onValue(cmdRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.action) {
        callback(data.action);
        // Consume the command immediately
        remove(cmdRef);
      }
    });
    return unsubscribe;
  } catch (e) {
    console.warn('[Firebase] subscribeCommands error:', e);
    return () => {};
  }
}

function encodeTeamName(name: string): string {
  return name.replace(/[.#$[\]]/g, '_');
}
