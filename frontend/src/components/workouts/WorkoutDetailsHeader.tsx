'use client';

import { useState, useRef, useEffect } from 'react';
import { WorkoutSession } from '@/types/workout';
import Button from '@/components/ui/Button';

interface WorkoutDetailsHeaderProps {
  session: WorkoutSession;
  onFinishClick: () => void;
  onSessionMenuToggle: () => void;
  showSessionMenu: boolean;
  onAddRound: () => void;
  onSaveToTemplate: () => void;
  onNotesToggle: () => void;
  onClearPrefills: () => void;
  onDiscardSession: () => void;
  onManageHidden: () => void;
}

export function WorkoutDetailsHeader({
  session,
  onFinishClick,
  onSessionMenuToggle,
  showSessionMenu,
  onAddRound,
  onSaveToTemplate,
  onNotesToggle,
  onClearPrefills,
  onDiscardSession,
  onManageHidden
}: WorkoutDetailsHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onSessionMenuToggle();
      }
    };

    if (showSessionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSessionMenu, onSessionMenuToggle]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getElapsedTime = () => {
    const start = new Date(session.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-6 mb-6">
      {/* Main Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {session.templateName}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{formatDate(session.startTime)}</span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="font-medium">Elapsed: {getElapsedTime()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Session Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={onSessionMenuToggle}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Session menu"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showSessionMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  <button
                    onClick={onAddRound}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Add Round
                  </button>
                  <button
                    onClick={onSaveToTemplate}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Save Changes To Template…
                  </button>
                  <button
                    onClick={onNotesToggle}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Notes
                  </button>
                  <button
                    onClick={onClearPrefills}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Clear Prefills
                  </button>
                  <button
                    onClick={onDiscardSession}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Discard Session
                  </button>
                  <button
                    onClick={onManageHidden}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Manage Hidden (Session)
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Finish Button */}
          <Button
            onClick={onFinishClick}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            Finish
          </Button>
        </div>
      </div>

      {/* Template Origin */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <span>From template: </span>
        <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          {session.templateName}
        </button>
      </div>
    </div>
  );
}
