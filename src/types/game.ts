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

export interface GameState {
  screen: GameScreen;
  teamName: string;
  currentStage: number;
  completedStages: number[];
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
  | { type: 'START_GAME'; teamName: string }
  | { type: 'SET_NEAR_STAGE'; isNear: boolean }
  | { type: 'UNLOCK_PUZZLE' }
  | { type: 'SOLVE_PUZZLE'; points: number }
  | { type: 'SHOW_STORY' }
  | { type: 'NEXT_STAGE' }
  | { type: 'FINISH_GAME' }
  | { type: 'TOGGLE_DEV_MODE' }
  | { type: 'DEV_SKIP_TO_STAGE'; stageId: number }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: Partial<GameState> }
  | { type: 'ENTER_MASTER' };

export interface TeamLocation {
  teamName: string;
  lat: number;
  lng: number;
  currentStage: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  teamName: string;
  score: number;
  totalTime: number;
  date: string;
}
