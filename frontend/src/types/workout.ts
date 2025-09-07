// Workout Card interface for the main Workouts page
export interface WorkoutCard {
  id: string;
  templateId: string;
  templateName: string;
  description: string;
  estimatedDurationMinutes: number;
  exerciseCount: number;
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  lastWorkoutDate?: string;
  completionCount: number;
  isFavorite: boolean;
}

// Workout Session interface for logging workouts
export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  startTime: string;
  endTime?: string;
  isCompleted: boolean;
  rounds: WorkoutRound[];
  sessionNotes: string;
  lastSessionNotes: string;
  hasStructuralChanges: boolean;
}

export interface WorkoutRound {
  id: string;
  name: string;
  order: number;
  exercises: WorkoutSessionExercise[];
}

export interface WorkoutSessionExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseType: 'Reps/Weight' | 'Time' | 'Reps-only' | 'Hybrid';
  order: number;
  isHidden: boolean;
  sets: ExerciseSet[];
  notes: string;
  lastSessionData?: ExerciseSet[];
}

export interface ExerciseSet {
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number; // seconds
  isCompleted: boolean;
}

// Workout Context State
export interface WorkoutCardsState {
  workoutCards: WorkoutCard[];
  loading: boolean;
  error: string | null;
}

// Workout Context Actions
export type WorkoutCardsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORKOUT_CARDS'; payload: WorkoutCard[] }
  | { type: 'ADD_WORKOUT_CARD'; payload: WorkoutCard }
  | { type: 'REMOVE_WORKOUT_CARD'; payload: string }
  | { type: 'UPDATE_WORKOUT_CARD'; payload: WorkoutCard }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'UPDATE_LAST_WORKOUT'; payload: { cardId: string; date: string } }
  | { type: 'INCREMENT_COMPLETION_COUNT'; payload: string };
