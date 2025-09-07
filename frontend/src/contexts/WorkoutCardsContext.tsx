'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WorkoutCard, WorkoutCardsState, WorkoutCardsAction } from '@/types/workout';

// Initial state
const initialState: WorkoutCardsState = {
  workoutCards: [],
  loading: false,
  error: null,
};

// Reducer
function workoutCardsReducer(state: WorkoutCardsState, action: WorkoutCardsAction): WorkoutCardsState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_WORKOUT_CARDS':
      return {
        ...state,
        workoutCards: action.payload,
        loading: false,
        error: null,
      };

    case 'ADD_WORKOUT_CARD':
      return {
        ...state,
        workoutCards: [...state.workoutCards, action.payload],
        error: null,
      };

    case 'REMOVE_WORKOUT_CARD':
      return {
        ...state,
        workoutCards: state.workoutCards.filter(card => card.id !== action.payload),
        error: null,
      };

    case 'UPDATE_WORKOUT_CARD':
      return {
        ...state,
        workoutCards: state.workoutCards.map(card =>
          card.id === action.payload.id ? action.payload : card
        ),
        error: null,
      };

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        workoutCards: state.workoutCards.map(card =>
          card.id === action.payload
            ? { ...card, isFavorite: !card.isFavorite }
            : card
        ),
        error: null,
      };

    case 'UPDATE_LAST_WORKOUT':
      return {
        ...state,
        workoutCards: state.workoutCards.map(card =>
          card.id === action.payload.cardId
            ? { ...card, lastWorkoutDate: action.payload.date }
            : card
        ),
        error: null,
      };

    case 'INCREMENT_COMPLETION_COUNT':
      return {
        ...state,
        workoutCards: state.workoutCards.map(card =>
          card.id === action.payload
            ? { ...card, completionCount: card.completionCount + 1 }
            : card
        ),
        error: null,
      };

    default:
      return state;
  }
}

// Context
const WorkoutCardsContext = createContext<{
  state: WorkoutCardsState;
  dispatch: React.Dispatch<WorkoutCardsAction>;
} | null>(null);

// Provider
interface WorkoutCardsProviderProps {
  children: ReactNode;
}

export function WorkoutCardsProvider({ children }: WorkoutCardsProviderProps) {
  const [state, dispatch] = useReducer(workoutCardsReducer, initialState);

  // Load workout cards from localStorage on mount
  useEffect(() => {
    const loadWorkoutCards = () => {
      try {
        const savedCards = localStorage.getItem('xtracker_workout_cards');
        if (savedCards) {
          const cards = JSON.parse(savedCards);
          dispatch({ type: 'SET_WORKOUT_CARDS', payload: cards });
        }
      } catch (error) {
        console.error('Failed to load workout cards:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load workout cards' });
      }
    };

    loadWorkoutCards();
  }, []);

  // Save workout cards to localStorage when state changes
  useEffect(() => {
    try {
      if (state.workoutCards.length > 0) {
        localStorage.setItem('xtracker_workout_cards', JSON.stringify(state.workoutCards));
      }
    } catch (error) {
      console.error('Failed to save workout cards:', error);
    }
  }, [state.workoutCards]);

  return (
    <WorkoutCardsContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutCardsContext.Provider>
  );
}

// Hook
export function useWorkoutCards() {
  const context = useContext(WorkoutCardsContext);
  if (!context) {
    throw new Error('useWorkoutCards must be used within a WorkoutCardsProvider');
  }
  return context;
}

// Helper hooks
export function useWorkoutCardsActions() {
  const { dispatch } = useWorkoutCards();

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setWorkoutCards = (cards: WorkoutCard[]) => {
    dispatch({ type: 'SET_WORKOUT_CARDS', payload: cards });
  };

  const addWorkoutCard = (card: WorkoutCard) => {
    dispatch({ type: 'ADD_WORKOUT_CARD', payload: card });
  };

  const removeWorkoutCard = (cardId: string) => {
    dispatch({ type: 'REMOVE_WORKOUT_CARD', payload: cardId });
  };

  const updateWorkoutCard = (card: WorkoutCard) => {
    dispatch({ type: 'UPDATE_WORKOUT_CARD', payload: card });
  };

  const toggleFavorite = (cardId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: cardId });
  };

  const updateLastWorkout = (cardId: string, date: string) => {
    dispatch({ type: 'UPDATE_LAST_WORKOUT', payload: { cardId, date } });
  };

  const incrementCompletionCount = (cardId: string) => {
    dispatch({ type: 'INCREMENT_COMPLETION_COUNT', payload: cardId });
  };

  return {
    setLoading,
    setError,
    setWorkoutCards,
    addWorkoutCard,
    removeWorkoutCard,
    updateWorkoutCard,
    toggleFavorite,
    updateLastWorkout,
    incrementCompletionCount,
  };
}
