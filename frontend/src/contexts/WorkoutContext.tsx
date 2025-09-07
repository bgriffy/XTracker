'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Workout, WorkoutTemplate, WorkoutTemplateDetail } from '@/lib/api/workoutService';

// Types
interface WorkoutState {
  // Current workout being logged
  currentWorkout: {
    template: WorkoutTemplateDetail | null;
    startTime: Date | null;
    currentExerciseIndex: number;
    loggedSets: Record<number, LoggedSet[]>;
    notes: string;
  };
  
  // Workout history
  workoutHistory: Workout[];
  
  // UI state
  ui: {
    loading: boolean;
    error: string | null;
    activeTab: 'library' | 'history' | 'logging';
  };
  
  // Cache
  cache: {
    templates: WorkoutTemplate[];
    lastFetch: Date | null;
  };
}

interface LoggedSet {
  setId: string;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
  timestamp: Date;
}

// Action types
type WorkoutAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TAB'; payload: 'library' | 'history' | 'logging' }
  | { type: 'SET_TEMPLATES'; payload: WorkoutTemplate[] }
  | { type: 'SET_WORKOUT_HISTORY'; payload: Workout[] }
  | { type: 'START_WORKOUT'; payload: { template: WorkoutTemplateDetail; startTime: Date } }
  | { type: 'SET_CURRENT_EXERCISE'; payload: number }
  | { type: 'ADD_SET'; payload: { exerciseId: number; set: LoggedSet } }
  | { type: 'UPDATE_SET'; payload: { exerciseId: number; setId: string; field: keyof LoggedSet; value: any } }
  | { type: 'REMOVE_SET'; payload: { exerciseId: number; setId: string } }
  | { type: 'SET_WORKOUT_NOTES'; payload: string }
  | { type: 'COMPLETE_WORKOUT'; payload: Workout }
  | { type: 'CLEAR_CURRENT_WORKOUT' }
  | { type: 'CACHE_TEMPLATES'; payload: { templates: WorkoutTemplate[]; timestamp: Date } };

// Initial state
const initialState: WorkoutState = {
  currentWorkout: {
    template: null,
    startTime: null,
    currentExerciseIndex: 0,
    loggedSets: {},
    notes: ''
  },
  workoutHistory: [],
  ui: {
    loading: false,
    error: null,
    activeTab: 'library'
  },
  cache: {
    templates: [],
    lastFetch: null
  }
};

// Reducer
function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };

    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload }
      };

    case 'SET_TEMPLATES':
      return {
        ...state,
        cache: { ...state.cache, templates: action.payload }
      };

    case 'SET_WORKOUT_HISTORY':
      return {
        ...state,
        workoutHistory: action.payload
      };

    case 'START_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          template: action.payload.template,
          startTime: action.payload.startTime,
          currentExerciseIndex: 0,
          loggedSets: {},
          notes: ''
        },
        ui: { ...state.ui, activeTab: 'logging' }
      };

    case 'SET_CURRENT_EXERCISE':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          currentExerciseIndex: action.payload
        }
      };

    case 'ADD_SET':
      const { exerciseId, set } = action.payload;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          loggedSets: {
            ...state.currentWorkout.loggedSets,
            [exerciseId]: [
              ...(state.currentWorkout.loggedSets[exerciseId] || []),
              set
            ]
          }
        }
      };

    case 'UPDATE_SET':
      const { exerciseId: updateExerciseId, setId, field, value } = action.payload;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          loggedSets: {
            ...state.currentWorkout.loggedSets,
            [updateExerciseId]: (state.currentWorkout.loggedSets[updateExerciseId] || []).map(set =>
              set.setId === setId ? { ...set, [field]: value } : set
            )
          }
        }
      };

    case 'REMOVE_SET':
      const { exerciseId: removeExerciseId, setId: removeSetId } = action.payload;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          loggedSets: {
            ...state.currentWorkout.loggedSets,
            [removeExerciseId]: (state.currentWorkout.loggedSets[removeExerciseId] || []).filter(
              set => set.setId !== removeSetId
            )
          }
        }
      };

    case 'SET_WORKOUT_NOTES':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          notes: action.payload
        }
      };

    case 'COMPLETE_WORKOUT':
      return {
        ...state,
        workoutHistory: [action.payload, ...state.workoutHistory],
        currentWorkout: {
          template: null,
          startTime: null,
          currentExerciseIndex: 0,
          loggedSets: {},
          notes: ''
        },
        ui: { ...state.ui, activeTab: 'history' }
      };

    case 'CLEAR_CURRENT_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          template: null,
          startTime: null,
          currentExerciseIndex: 0,
          loggedSets: {},
          notes: ''
        }
      };

    case 'CACHE_TEMPLATES':
      return {
        ...state,
        cache: {
          templates: action.payload.templates,
          lastFetch: action.payload.timestamp
        }
      };

    default:
      return state;
  }
}

// Context
const WorkoutContext = createContext<{
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
} | null>(null);

// Provider
interface WorkoutProviderProps {
  children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        // Load cached templates
        const cachedTemplates = localStorage.getItem('xtracker_templates');
        if (cachedTemplates) {
          const { templates, timestamp } = JSON.parse(cachedTemplates);
          const cacheAge = Date.now() - new Date(timestamp).getTime();
          
          // Use cache if it's less than 1 hour old
          if (cacheAge < 60 * 60 * 1000) {
            dispatch({ type: 'CACHE_TEMPLATES', payload: { templates, timestamp: new Date(timestamp) } });
          }
        }

        // Load workout history
        const cachedHistory = localStorage.getItem('xtracker_workout_history');
        if (cachedHistory) {
          const history = JSON.parse(cachedHistory);
          dispatch({ type: 'SET_WORKOUT_HISTORY', payload: history });
        }
      } catch (error) {
        console.error('Failed to load cached data:', error);
      }
    };

    loadCachedData();
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      // Save templates cache
      if (state.cache.templates.length > 0 && state.cache.lastFetch) {
        localStorage.setItem('xtracker_templates', JSON.stringify({
          templates: state.cache.templates,
          timestamp: state.cache.lastFetch
        }));
      }

      // Save workout history
      if (state.workoutHistory.length > 0) {
        localStorage.setItem('xtracker_workout_history', JSON.stringify(state.workoutHistory));
      }
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, [state.cache.templates, state.cache.lastFetch, state.workoutHistory]);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Hook
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

// Helper hooks
export function useCurrentWorkout() {
  const { state, dispatch } = useWorkout();
  
  const startWorkout = (template: WorkoutTemplateDetail) => {
    dispatch({ type: 'START_WORKOUT', payload: { template, startTime: new Date() } });
  };

  const setCurrentExercise = (index: number) => {
    dispatch({ type: 'SET_CURRENT_EXERCISE', payload: index });
  };

  const addSet = (exerciseId: number, set: Omit<LoggedSet, 'setId' | 'timestamp'>) => {
    const newSet: LoggedSet = {
      ...set,
      setId: `set_${Date.now()}_${Math.random()}`,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_SET', payload: { exerciseId, set: newSet } });
  };

  const updateSet = (exerciseId: number, setId: string, field: keyof LoggedSet, value: any) => {
    dispatch({ type: 'UPDATE_SET', payload: { exerciseId, setId, field, value } });
  };

  const removeSet = (exerciseId: number, setId: string) => {
    dispatch({ type: 'REMOVE_SET', payload: { exerciseId, setId } });
  };

  const setNotes = (notes: string) => {
    dispatch({ type: 'SET_WORKOUT_NOTES', payload: notes });
  };

  const completeWorkout = (workout: Workout) => {
    dispatch({ type: 'COMPLETE_WORKOUT', payload: workout });
  };

  const clearCurrentWorkout = () => {
    dispatch({ type: 'CLEAR_CURRENT_WORKOUT' });
  };

  return {
    currentWorkout: state.currentWorkout,
    startWorkout,
    setCurrentExercise,
    addSet,
    updateSet,
    removeSet,
    setNotes,
    completeWorkout,
    clearCurrentWorkout
  };
}

export function useWorkoutHistory() {
  const { state, dispatch } = useWorkout();
  
  const setWorkoutHistory = (history: Workout[]) => {
    dispatch({ type: 'SET_WORKOUT_HISTORY', payload: history });
  };

  return {
    workoutHistory: state.workoutHistory,
    setWorkoutHistory
  };
}

export function useWorkoutUI() {
  const { state, dispatch } = useWorkout();
  
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setActiveTab = (tab: 'library' | 'history' | 'logging') => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  return {
    ui: state.ui,
    setLoading,
    setError,
    setActiveTab
  };
}

export function useWorkoutCache() {
  const { state, dispatch } = useWorkout();
  
  const setTemplates = (templates: WorkoutTemplate[]) => {
    dispatch({ type: 'SET_TEMPLATES', payload: templates });
    dispatch({ type: 'CACHE_TEMPLATES', payload: { templates, timestamp: new Date() } });
  };

  const isCacheValid = () => {
    if (!state.cache.lastFetch) return false;
    const cacheAge = Date.now() - state.cache.lastFetch.getTime();
    return cacheAge < 60 * 60 * 1000; // 1 hour
  };

  return {
    templates: state.cache.templates,
    lastFetch: state.cache.lastFetch,
    setTemplates,
    isCacheValid
  };
}
