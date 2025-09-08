'use client';

import { useState, useEffect } from 'react';
import { WorkoutSession } from '@/types/workout';
import Button from '@/components/ui/Button';

interface WorkoutDetailsNotesPanelProps {
  session: WorkoutSession;
  onUpdateSession: (session: WorkoutSession) => void;
  onClose: () => void;
}

export function WorkoutDetailsNotesPanel({
  session,
  onUpdateSession,
  onClose
}: WorkoutDetailsNotesPanelProps) {
  const [currentNotes, setCurrentNotes] = useState(session.sessionNotes);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced autosave
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentNotes !== session.sessionNotes) {
        handleSaveNotes();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentNotes]);

  const handleSaveNotes = async () => {
    if (currentNotes === session.sessionNotes) return;

    setIsSaving(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedSession = {
        ...session,
        sessionNotes: currentNotes
      };
      
      onUpdateSession(updatedSession);
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotesChange = (value: string) => {
    setCurrentNotes(value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Session Notes
        </h3>
        <div className="flex items-center space-x-2">
          {isSaving && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Saving...
            </span>
          )}
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close notes panel"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Last Session Notes */}
        {session.lastSessionNotes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Session Notes
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
              {session.lastSessionNotes}
            </div>
          </div>
        )}

        {/* Current Session Notes */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Session Notes
          </h4>
          <textarea
            value={currentNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about your workout session..."
            className="w-full h-32 px-4 py-3 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
