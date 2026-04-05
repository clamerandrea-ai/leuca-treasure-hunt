export interface PuzzleQuiz {
  type: 'quiz';
  question: string;
  options: string[];
  correctIndex: number;
}

export interface PuzzleText {
  type: 'text' | 'anagram' | 'math';
  question: string;
}

export interface PuzzleChallenge {
  type: 'challenge';
  question: string;
  challengeDescription: string;
}

export type Puzzle = PuzzleQuiz | PuzzleText | PuzzleChallenge;

export interface Stage {
  id: number;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  proximityRadius: number;
  hint: string;
  puzzle: Puzzle;
  acceptedAnswers: string[];
  storyFragment: string;
  points: number;
}

export type GameScreen = 'start' | 'playing' | 'victory' | 'master';

export type GameRoute = 'A' | 'B';

export interface GameState {
  screen: GameScreen;
  teamName: string;
  route: GameRoute;
  currentStep: number;        // step within the route (1-based)
  completedStages: number[];  // stage IDs completed
  score: number;
  startTime: number | null;
  endTime: number | null;
  stageArrivalTime: number | null;
  isNearStage: boolean;
  showPuzzle: boolean;
  showStory: boolean;
  devMode: boolean;
}

export type GameAction =
  | { type: 'START_GAME'; teamName: string; route: GameRoute }
  | { type: 'SET_NEAR_STAGE'; isNear: boolean }
  | { type: 'UNLOCK_PUZZLE' }
  | { type: 'SOLVE_PUZZLE'; points: number }
  | { type: 'SHOW_STORY' }
  | { type: 'NEXT_STAGE' }
  | { type: 'FINISH_GAME' }
  | { type: 'TOGGLE_DEV_MODE' }
  | { type: 'DEV_SKIP_TO_STEP'; step: number }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: Partial<GameState> }
  | { type: 'ENTER_MASTER' };

export interface TeamLocation {
  teamName: string;
  deviceId?: string;
  lat: number;
  lng: number;
  currentStage: number;
  currentStep: number;
  route: GameRoute;
  timestamp: number;
}

export interface LeaderboardEntry {
  teamName: string;
  score: number;
  totalTime: number;
  date: string;
}
