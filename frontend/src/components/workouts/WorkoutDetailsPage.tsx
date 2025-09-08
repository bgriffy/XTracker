'use client';

import { useState, useCallback } from 'react';
import { WorkoutSession } from '@/types/workout';
import { WorkoutDetailsHeader } from '@/components/workouts/WorkoutDetailsHeader';
import { WorkoutDetailsBody } from '@/components/workouts/WorkoutDetailsBody';
import { WorkoutDetailsNotesPanel } from '@/components/workouts/WorkoutDetailsNotesPanel';
import { WorkoutFinishModal } from '@/components/workouts/WorkoutFinishModal';

interface WorkoutDetailsPageProps {
  workoutSession: WorkoutSession;
  onFinishWorkout: (session: WorkoutSession) => Promise<void>;
  onSaveToTemplate: (session: WorkoutSession) => Promise<boolean>;
  onUpdateSession: (session: WorkoutSession) => void;
}

export function WorkoutDetailsPage({
  workoutSession,
  onFinishWorkout,
  onSaveToTemplate,
  onUpdateSession
}: WorkoutDetailsPageProps) {
  const [session, setSession] = useState<WorkoutSession>(workoutSession);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);

  const handleUpdateSession = useCallback((updatedSession: WorkoutSession) => {
    setSession(updatedSession);
    onUpdateSession(updatedSession);
  }, [onUpdateSession]);

  const handleFinishClick = () => {
    setShowFinishModal(true);
  };

  const handleFinishConfirm = async (saveToTemplate: boolean) => {
    try {
      if (saveToTemplate && session.hasStructuralChanges) {
        await onSaveToTemplate(session);
      }
      
      await onFinishWorkout(session);
      setShowFinishModal(false);
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  const handleFinishCancel = () => {
    setShowFinishModal(false);
  };

  const handleSessionMenuToggle = () => {
    setShowSessionMenu(!showSessionMenu);
  };

  const handleNotesToggle = () => {
    setShowNotesPanel(!showNotesPanel);
    setShowSessionMenu(false);
  };


  const handleAddRound = () => {
    // TODO: Implement add round functionality
    console.log('Add round clicked');
    setShowSessionMenu(false);
  };

  const handleSaveToTemplate = async () => {
    try {
      await onSaveToTemplate(session);
      setShowSessionMenu(false);
    } catch (error) {
      console.error('Error saving to template:', error);
    }
  };

  const handleClearPrefills = () => {
    // TODO: Implement clear prefills functionality
    console.log('Clear prefills clicked');
    setShowSessionMenu(false);
  };

  const handleDiscardSession = () => {
    // TODO: Implement discard session functionality
    console.log('Discard session clicked');
    setShowSessionMenu(false);
  };

  const handleManageHidden = () => {
    // TODO: Implement manage hidden functionality
    console.log('Manage hidden clicked');
    setShowSessionMenu(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <WorkoutDetailsHeader
        session={session}
        onFinishClick={handleFinishClick}
        onSessionMenuToggle={handleSessionMenuToggle}
        showSessionMenu={showSessionMenu}
        onAddRound={handleAddRound}
        onSaveToTemplate={handleSaveToTemplate}
        onNotesToggle={handleNotesToggle}
        onClearPrefills={handleClearPrefills}
        onDiscardSession={handleDiscardSession}
        onManageHidden={handleManageHidden}
      />

      {/* Notes Panel */}
      {showNotesPanel && (
        <WorkoutDetailsNotesPanel
          session={session}
          onUpdateSession={handleUpdateSession}
          onClose={() => setShowNotesPanel(false)}
        />
      )}

      {/* Main Body */}
      <WorkoutDetailsBody
        session={session}
        onUpdateSession={handleUpdateSession}
      />

      {/* Finish Modal */}
      {showFinishModal && (
        <WorkoutFinishModal
          session={session}
          onConfirm={handleFinishConfirm}
          onCancel={handleFinishCancel}
        />
      )}
    </div>
  );
}
