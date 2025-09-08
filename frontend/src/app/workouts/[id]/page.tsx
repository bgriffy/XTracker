'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { WorkoutDetailsPage } from '@/components/workouts/WorkoutDetailsPage';
import { WorkoutSession } from '@/types/workout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WorkoutDetailsRoute() {
  const params = useParams();
  const router = useRouter();
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workoutId = params.id as string;

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, we'll create mock data
    const loadWorkoutSession = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock workout session data - P90X Chest & Back format
        const mockSession: WorkoutSession = {
          id: workoutId,
          templateId: 'template-1',
          templateName: 'Chest & Back',
          startTime: new Date().toISOString(),
          isCompleted: false,
          rounds: [
            {
              id: 'round-1',
              name: 'Round 1',
              order: 1,
              exercises: [
                {
                  id: 'exercise-1',
                  exerciseId: 'ex-1',
                  exerciseName: 'Push-ups',
                  exerciseType: 'Reps-only',
                  order: 1,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 12, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 12, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-2',
                  exerciseId: 'ex-2',
                  exerciseName: 'Pull-ups',
                  exerciseType: 'Reps-only',
                  order: 2,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 10, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 10, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-3',
                  exerciseId: 'ex-3',
                  exerciseName: 'Diamond Push-ups',
                  exerciseType: 'Reps-only',
                  order: 3,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 10, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 10, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-4',
                  exerciseId: 'ex-4',
                  exerciseName: 'Lawn-mowers',
                  exerciseType: 'Reps/Weight',
                  order: 4,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 15, weight: 25, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 15, weight: 25, isCompleted: true }
                  ]
                }
              ]
            },
            {
              id: 'round-2',
              name: 'Round 2',
              order: 2,
              exercises: [
                {
                  id: 'exercise-5',
                  exerciseId: 'ex-1',
                  exerciseName: 'Push-ups',
                  exerciseType: 'Reps-only',
                  order: 1,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 12, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 12, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-6',
                  exerciseId: 'ex-2',
                  exerciseName: 'Pull-ups',
                  exerciseType: 'Reps-only',
                  order: 2,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 10, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 10, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-7',
                  exerciseId: 'ex-3',
                  exerciseName: 'Diamond Push-ups',
                  exerciseType: 'Reps-only',
                  order: 3,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 10, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 10, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-8',
                  exerciseId: 'ex-4',
                  exerciseName: 'Lawn-mowers',
                  exerciseType: 'Reps/Weight',
                  order: 4,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 15, weight: 25, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 15, weight: 25, isCompleted: true }
                  ]
                }
              ]
            },
            {
              id: 'round-3',
              name: 'Round 3',
              order: 3,
              exercises: [
                {
                  id: 'exercise-9',
                  exerciseId: 'ex-1',
                  exerciseName: 'Push-ups',
                  exerciseType: 'Reps-only',
                  order: 1,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 12, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 12, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-10',
                  exerciseId: 'ex-2',
                  exerciseName: 'Pull-ups',
                  exerciseType: 'Reps-only',
                  order: 2,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 10, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 10, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-11',
                  exerciseId: 'ex-3',
                  exerciseName: 'Diamond Push-ups',
                  exerciseType: 'Reps-only',
                  order: 3,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 10, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 10, isCompleted: true }
                  ]
                },
                {
                  id: 'exercise-12',
                  exerciseId: 'ex-4',
                  exerciseName: 'Lawn-mowers',
                  exerciseType: 'Reps/Weight',
                  order: 4,
                  isHidden: false,
                  sets: [
                    { setNumber: 1, reps: 15, weight: 25, isCompleted: false }
                  ],
                  notes: '',
                  lastSessionData: [
                    { setNumber: 1, reps: 15, weight: 25, isCompleted: true }
                  ]
                }
              ]
            }
          ],
          sessionNotes: '',
          lastSessionNotes: 'Great workout yesterday! Felt strong on pull-ups.',
          hasStructuralChanges: false
        };

        setWorkoutSession(mockSession);
      } catch (err) {
        setError('Failed to load workout session');
        console.error('Error loading workout session:', err);
      } finally {
        setLoading(false);
      }
    };

    if (workoutId) {
      loadWorkoutSession();
    }
  }, [workoutId]);

  const handleFinishWorkout = async (session: WorkoutSession) => {
    try {
      // TODO: Implement actual finish logic
      console.log('Finishing workout:', session);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to workouts page
      router.push('/workouts');
    } catch (err) {
      console.error('Error finishing workout:', err);
    }
  };

  const handleSaveToTemplate = async (session: WorkoutSession) => {
    try {
      // TODO: Implement save to template logic
      console.log('Saving changes to template:', session);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (err) {
      console.error('Error saving to template:', err);
      return false;
    }
  };

  const handleUpdateSession = (updatedSession: WorkoutSession) => {
    setWorkoutSession(updatedSession);
  };

  if (loading) {
    return (
      <MainLayout showHeader={false} showFooter={false}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !workoutSession) {
    return (
      <MainLayout showHeader={false} showFooter={false}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {error || 'Workout not found'}
            </h2>
            <button
              onClick={() => router.push('/workouts')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <WorkoutDetailsPage
          workoutSession={workoutSession}
          onFinishWorkout={handleFinishWorkout}
          onSaveToTemplate={handleSaveToTemplate}
          onUpdateSession={handleUpdateSession}
        />
      </div>
    </MainLayout>
  );
}
