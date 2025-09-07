import apiClient from './client';

// Types for workout data
export interface Exercise {
  id: number;
  name: string;
  description?: string;
  category: string;
  createdAt: string;
}

export interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  exerciseCategory: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  notes?: string;
}

export interface Workout {
  id: number;
  date: string;
  type: string;
  durationMinutes: number;
  notes?: string;
  reps?: number;
  weight?: number;
  createdAt: string;
  updatedAt: string;
  exerciseCount: number; // Changed from exercises array to exerciseCount
}

export interface CreateWorkoutRequest {
  date: string;
  type: string;
  durationMinutes: number;
  notes?: string;
  reps?: number;
  weight?: number;
  exercises?: CreateWorkoutExerciseRequest[];
}

export interface CreateWorkoutExerciseRequest {
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface UpdateWorkoutRequest {
  date?: string;
  type?: string;
  durationMinutes?: number;
  notes?: string;
  reps?: number;
  weight?: number;
  exercises?: CreateWorkoutExerciseRequest[];
}

// Workout API service
export const workoutService = {
  // Get all workouts
  getWorkouts: async (): Promise<Workout[]> => {
    const response = await apiClient.get('/workouts');
    return response.data.workouts;
  },

  // Get workout by ID
  getWorkoutById: async (id: number): Promise<Workout> => {
    const response = await apiClient.get(`/workouts/${id}`);
    return response.data;
  },

  // Create new workout
  createWorkout: async (workout: CreateWorkoutRequest): Promise<Workout> => {
    const response = await apiClient.post('/workouts', workout);
    return response.data;
  },

  // Update workout
  updateWorkout: async (id: number, workout: UpdateWorkoutRequest): Promise<Workout> => {
    const response = await apiClient.put(`/workouts/${id}`, workout);
    return response.data;
  },

  // Delete workout
  deleteWorkout: async (id: number): Promise<void> => {
    await apiClient.delete(`/workouts/${id}`);
  },
};

// Exercise API service
export const exerciseService = {
  // Get all exercises
  getExercises: async (): Promise<Exercise[]> => {
    const response = await apiClient.get('/exercises');
    return response.data;
  },

  // Get exercise by ID
  getExerciseById: async (id: number): Promise<Exercise> => {
    const response = await apiClient.get(`/exercises/${id}`);
    return response.data;
  },
};

// Workout Template types
export interface WorkoutTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDurationMinutes: number;
  equipment: string;
  instructions: string;
  isP90XWorkout: boolean;
  exerciseCount: number;
  sectionCount: number;
}

export interface WorkoutTemplateSection {
  id: number;
  name: string;
  description: string;
  type: string;
  order: number;
  instructions: string;
  restPeriodSeconds: number;
  exercises: WorkoutTemplateExercise[];
}

export interface WorkoutTemplateExercise {
  id: number;
  order: number;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restPeriodSeconds?: number;
  notes?: string;
  exercise: {
    id: number;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    primaryMuscleGroups: string;
    secondaryMuscleGroups?: string;
    equipment: string;
    formTips: string;
    videoUrl?: string;
    imageUrl?: string;
  };
}

export interface WorkoutTemplateDetail extends WorkoutTemplate {
  sections: WorkoutTemplateSection[];
}

// Workout Template API service
export const workoutTemplateService = {
  // Get all workout templates
  getWorkoutTemplates: async (): Promise<WorkoutTemplate[]> => {
    const response = await apiClient.get('/workouttemplates');
    return response.data.templates;
  },

  // Get workout template by ID
  getWorkoutTemplateById: async (id: number): Promise<WorkoutTemplateDetail> => {
    const response = await apiClient.get(`/workouttemplates/${id}`);
    return response.data;
  },

  // Get P90X workout templates
  getP90XWorkoutTemplates: async (): Promise<WorkoutTemplate[]> => {
    const response = await apiClient.get('/workouttemplates/p90x');
    return response.data.templates;
  },

  // Get workout templates by category
  getWorkoutTemplatesByCategory: async (category: string): Promise<WorkoutTemplate[]> => {
    const response = await apiClient.get(`/workouttemplates/category/${category}`);
    return response.data.templates;
  },
};

export default workoutService;
