'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentWorkout, useWorkoutUI } from '@/contexts/WorkoutContext';
import { workoutService, WorkoutTemplateDetail } from '@/lib/api/workoutService';

interface UseWorkoutLoggingProps {
  templateId?: number;
}

export function useWorkoutLogging({ templateId }: UseWorkoutLoggingProps = {}) {
  const router = useRouter();
  const { currentWorkout, startWorkout, setCurrentExercise, addSet, updateSet, removeSet, setNotes, completeWorkout, clearCurrentWorkout } = useCurrentWorkout();
  const { ui, setLoading, setError } = useWorkoutUI();
  
  const [template, setTemplate] = useState<WorkoutTemplateDetail | null>(null);

  // Load template if templateId is provided
  useEffect(() => {
    if (templateId && !currentWorkout.template) {
      loadTemplate(templateId);
    } else if (currentWorkout.template) {
      setTemplate(currentWorkout.template);
    }
  }, [templateId, currentWorkout.template]);

  const loadTemplate = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutService.getWorkoutTemplateById(id);
      setTemplate(data);
    } catch (err) {
      console.error('Failed to load workout template:', err);
      setError('Failed to load workout details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const startNewWorkout = useCallback((templateData: WorkoutTemplateDetail) => {
    startWorkout(templateData);
    setTemplate(templateData);
  }, [startWorkout]);

  const navigateToExercise = useCallback((exerciseIndex: number) => {
    setCurrentExercise(exerciseIndex);
  }, [setCurrentExercise]);

  const logSet = useCallback((exerciseId: number, setData: {
    reps: number;
    weight?: number;
    duration?: number;
    notes?: string;
  }) => {
    addSet(exerciseId, setData);
  }, [addSet]);

  const updateLoggedSet = useCallback((exerciseId: number, setId: string, field: string, value: any) => {
    updateSet(exerciseId, setId, field as any, value);
  }, [updateSet]);

  const deleteLoggedSet = useCallback((exerciseId: number, setId: string) => {
    removeSet(exerciseId, setId);
  }, [removeSet]);

  const saveWorkoutNotes = useCallback((notes: string) => {
    setNotes(notes);
  }, [setNotes]);

  const finishWorkout = useCallback(async () => {
    if (!currentWorkout.template) return;

    try {
      setLoading(true);
      setError(null);

      // Create workout data from current state
      const workoutData = {
        date: currentWorkout.startTime?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        type: currentWorkout.template.name,
        durationMinutes: currentWorkout.template.estimatedDurationMinutes,
        notes: currentWorkout.notes,
        exercises: Object.entries(currentWorkout.loggedSets).map(([exerciseId, sets]) => ({
          exerciseId: parseInt(exerciseId),
          sets: sets.length,
          reps: sets.reduce((sum, set) => sum + set.reps, 0),
          weight: sets.reduce((sum, set) => sum + (set.weight || 0), 0) / sets.length,
          duration: sets.reduce((sum, set) => sum + (set.duration || 0), 0),
          notes: sets.map(set => set.notes).filter(Boolean).join('; ')
        }))
      };

      // TODO: Replace with actual API call when backend is ready
      console.log('Saving workout:', workoutData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock workout response
      const savedWorkout = {
        id: Date.now(),
        date: workoutData.date,
        type: workoutData.type,
        durationMinutes: workoutData.durationMinutes,
        notes: workoutData.notes,
        reps: workoutData.exercises.reduce((sum, ex) => sum + ex.reps, 0),
        weight: workoutData.exercises.reduce((sum, ex) => sum + (ex.weight || 0), 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        exerciseCount: workoutData.exercises.length
      };

      completeWorkout(savedWorkout as any);
      
      // Navigate to history or success page
      router.push('/workouts/history');
      
    } catch (err) {
      console.error('Failed to save workout:', err);
      setError('Failed to save workout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentWorkout, completeWorkout, setLoading, setError, router]);

  const cancelWorkout = useCallback(() => {
    clearCurrentWorkout();
    router.back();
  }, [clearCurrentWorkout, router]);

  // Get current exercise data
  const getCurrentExercise = useCallback(() => {
    if (!template || !currentWorkout.template) return null;
    
    const allExercises = template.sections.flatMap(section => section.exercises);
    const currentExercise = allExercises[currentWorkout.currentExerciseIndex];
    const loggedSets = currentExercise ? currentWorkout.loggedSets[currentExercise.exercise.id] || [] : [];
    
    return {
      exercise: currentExercise,
      loggedSets,
      isFirst: currentWorkout.currentExerciseIndex === 0,
      isLast: currentWorkout.currentExerciseIndex === allExercises.length - 1,
      totalExercises: allExercises.length
    };
  }, [template, currentWorkout]);

  // Get workout progress
  const getWorkoutProgress = useCallback(() => {
    if (!template) return { completed: 0, total: 0, percentage: 0 };
    
    const totalExercises = template.sections.reduce((sum, section) => sum + section.exercises.length, 0);
    const completedExercises = Object.keys(currentWorkout.loggedSets).length;
    
    return {
      completed: completedExercises,
      total: totalExercises,
      percentage: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
    };
  }, [template, currentWorkout.loggedSets]);

  // Get exercise statistics
  const getExerciseStats = useCallback((exerciseId: number) => {
    const sets = currentWorkout.loggedSets[exerciseId] || [];
    
    if (sets.length === 0) {
      return {
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        totalDuration: 0,
        averageWeight: 0,
        averageReps: 0
      };
    }

    const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
    const totalWeight = sets.reduce((sum, set) => sum + (set.weight || 0), 0);
    const totalDuration = sets.reduce((sum, set) => sum + (set.duration || 0), 0);

    return {
      totalSets: sets.length,
      totalReps,
      totalWeight,
      totalDuration,
      averageWeight: sets.length > 0 ? totalWeight / sets.length : 0,
      averageReps: sets.length > 0 ? totalReps / sets.length : 0
    };
  }, [currentWorkout.loggedSets]);

  return {
    // State
    template,
    currentWorkout,
    ui,
    
    // Actions
    startNewWorkout,
    navigateToExercise,
    logSet,
    updateLoggedSet,
    deleteLoggedSet,
    saveWorkoutNotes,
    finishWorkout,
    cancelWorkout,
    
    // Computed values
    getCurrentExercise,
    getWorkoutProgress,
    getExerciseStats,
    
    // Utilities
    loadTemplate
  };
}
