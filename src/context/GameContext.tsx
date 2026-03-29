import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';
import { saveGameState, loadGameState } from '../utils/storage';
import { stages } from '../data/stages';

const initialState: GameState = {
  screen: 'start',
  teamName: '',
  currentStage: 1,
  completedStages: [],
  score: 0,
  startTime: null,
  endTime: null,
  stageArrivalTime: null,
  isNearStage: false,
  showPuzzle: false,
  showStory: false,
  devMode: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        screen: 'playing',
        teamName: action.teamName,
        startTime: Date.now(),
        devMode: state.devMode,
      };

    case 'SET_NEAR_STAGE':
      if (action.isNear && !state.isNearStage) {
        return {
          ...state,
          isNearStage: true,
          stageArrivalTime: Date.now(),
        };
      }
      if (!action.isNear && state.isNearStage && !state.showPuzzle) {
        return { ...state, isNearStage: false, stageArrivalTime: null };
      }
      return state;

    case 'UNLOCK_PUZZLE':
      return { ...state, showPuzzle: true };

    case 'SOLVE_PUZZLE': {
      let bonus = 0;
      if (state.stageArrivalTime && (Date.now() - state.stageArrivalTime) < 300000) {
        bonus = 50;
      }
      return {
        ...state,
        score: state.score + action.points + bonus,
        showPuzzle: false,
        showStory: true,
      };
    }

    case 'SHOW_STORY':
      return { ...state, showStory: true };

    case 'NEXT_STAGE': {
      const nextId = state.currentStage + 1;
      const newCompleted = [...state.completedStages, state.currentStage];
      if (nextId > stages.length) {
        return {
          ...state,
          screen: 'victory',
          completedStages: newCompleted,
          endTime: Date.now(),
          showStory: false,
          isNearStage: false,
          stageArrivalTime: null,
        };
      }
      return {
        ...state,
        currentStage: nextId,
        completedStages: newCompleted,
        showStory: false,
        showPuzzle: false,
        isNearStage: false,
        stageArrivalTime: null,
      };
    }

    case 'FINISH_GAME':
      return {
        ...state,
        screen: 'victory',
        endTime: Date.now(),
      };

    case 'TOGGLE_DEV_MODE':
      return { ...state, devMode: !state.devMode };

    case 'DEV_SKIP_TO_STAGE': {
      const completed = Array.from({ length: action.stageId - 1 }, (_, i) => i + 1);
      return {
        ...state,
        currentStage: action.stageId,
        completedStages: completed,
        showPuzzle: false,
        showStory: false,
        isNearStage: false,
        stageArrivalTime: null,
      };
    }

    case 'ENTER_MASTER':
      return { ...state, screen: 'master' };

    case 'RESET_GAME':
      return { ...initialState, devMode: state.devMode };

    case 'RESTORE_STATE':
      return { ...state, ...action.state };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Restore saved state on mount
  useEffect(() => {
    const saved = loadGameState();
    if (saved && saved.screen === 'playing' && saved.startTime) {
      dispatch({ type: 'RESTORE_STATE', state: saved });
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (state.screen === 'playing') {
      saveGameState(state);
    }
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
