import { WorkoutCard } from '@/types/workout';

// Mock workout cards data
const mockWorkoutCards: WorkoutCard[] = [
  {
    id: 'card-1',
    templateId: '1',
    templateName: 'Chest & Back',
    description: 'Classic P90X chest and back workout focusing on push-ups and pull-ups',
    estimatedDurationMinutes: 55,
    exerciseCount: 24,
    equipment: ['Pull-up Bar', 'Dumbbells', 'Resistance Bands'],
    difficulty: 'Advanced',
    category: 'Resistance',
    lastWorkoutDate: '2024-01-15',
    completionCount: 12,
    isFavorite: true,
  },
  {
    id: 'card-2',
    templateId: '2',
    templateName: 'Plyometrics',
    description: 'High-intensity jumping and explosive movements for power and agility',
    estimatedDurationMinutes: 58,
    exerciseCount: 20,
    equipment: ['None'],
    difficulty: 'Advanced',
    category: 'Plyometrics',
    lastWorkoutDate: '2024-01-14',
    completionCount: 8,
    isFavorite: true,
  },
  {
    id: 'card-3',
    templateId: '3',
    templateName: 'Shoulders & Arms',
    description: 'Targeted shoulder and arm workout with various resistance exercises',
    estimatedDurationMinutes: 60,
    exerciseCount: 22,
    equipment: ['Dumbbells', 'Resistance Bands'],
    difficulty: 'Intermediate',
    category: 'Resistance',
    lastWorkoutDate: '2024-01-13',
    completionCount: 15,
    isFavorite: false,
  },
  {
    id: 'card-4',
    templateId: '4',
    templateName: 'Yoga X',
    description: 'Comprehensive yoga session for flexibility, balance, and core strength',
    estimatedDurationMinutes: 92,
    exerciseCount: 18,
    equipment: ['Yoga Mat'],
    difficulty: 'Beginner',
    category: 'Flexibility',
    lastWorkoutDate: '2024-01-12',
    completionCount: 6,
    isFavorite: true,
  },
  {
    id: 'card-5',
    templateId: '5',
    templateName: 'Legs & Back',
    description: 'Lower body and back strengthening with squats, lunges, and pull-ups',
    estimatedDurationMinutes: 59,
    exerciseCount: 26,
    equipment: ['Pull-up Bar', 'Dumbbells'],
    difficulty: 'Advanced',
    category: 'Resistance',
    lastWorkoutDate: '2024-01-11',
    completionCount: 10,
    isFavorite: false,
  },
  {
    id: 'card-6',
    templateId: '6',
    templateName: 'Kenpo X',
    description: 'Martial arts inspired cardio workout with kicks, punches, and blocks',
    estimatedDurationMinutes: 58,
    exerciseCount: 16,
    equipment: ['None'],
    difficulty: 'Intermediate',
    category: 'Cardio',
    lastWorkoutDate: '2024-01-10',
    completionCount: 7,
    isFavorite: true,
  },
];

// Mock workout templates for the "Add Workout" modal
const mockWorkoutTemplates = [
  {
    id: '7',
    name: 'Core Synergistics',
    description: 'Core-focused workout combining stability and strength exercises',
    estimatedDurationMinutes: 58,
    exerciseCount: 20,
    equipment: ['None'],
    difficulty: 'Intermediate',
    category: 'Core',
  },
  {
    id: '8',
    name: 'X Stretch',
    description: 'Deep stretching session for recovery and flexibility',
    estimatedDurationMinutes: 57,
    exerciseCount: 12,
    equipment: ['Yoga Mat'],
    difficulty: 'Beginner',
    category: 'Flexibility',
  },
  {
    id: '9',
    name: 'Cardio X',
    description: 'Low-impact cardio workout perfect for recovery days',
    estimatedDurationMinutes: 45,
    exerciseCount: 14,
    equipment: ['None'],
    difficulty: 'Beginner',
    category: 'Cardio',
  },
  {
    id: '10',
    name: 'Ab Ripper X',
    description: 'Intense abdominal workout with 11 different exercises',
    estimatedDurationMinutes: 16,
    exerciseCount: 11,
    equipment: ['None'],
    difficulty: 'Advanced',
    category: 'Core',
  },
];

export const workoutCardsService = {
  // Get all workout cards
  getWorkoutCards: async (): Promise<WorkoutCard[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockWorkoutCards];
  },

  // Get workout templates for adding to cards
  getWorkoutTemplates: async (): Promise<any[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockWorkoutTemplates];
  },

  // Add a workout card
  addWorkoutCard: async (templateId: string): Promise<WorkoutCard> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const template = mockWorkoutTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newCard: WorkoutCard = {
      id: `card-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      description: template.description,
      estimatedDurationMinutes: template.estimatedDurationMinutes,
      exerciseCount: template.exerciseCount,
      equipment: template.equipment,
      difficulty: template.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      category: template.category,
      completionCount: 0,
      isFavorite: true,
    };

    return newCard;
  },

  // Remove a workout card
  removeWorkoutCard: async (cardId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // In a real app, this would make an API call
  },

  // Update workout card
  updateWorkoutCard: async (card: WorkoutCard): Promise<WorkoutCard> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return card;
  },

  // Log a workout (update last workout date and completion count)
  logWorkout: async (cardId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // In a real app, this would make an API call to log the workout
  },
};
