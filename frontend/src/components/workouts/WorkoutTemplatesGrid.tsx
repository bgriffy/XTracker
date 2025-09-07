import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { WorkoutTemplate } from '@/lib/api/workoutService';

interface WorkoutTemplatesGridProps {
  templates: WorkoutTemplate[];
  onStartWorkout?: (template: WorkoutTemplate) => void;
  onViewDetails?: (template: WorkoutTemplate) => void;
  hasFilters: boolean;
  searchTerm: string;
  filterCategory: string;
  filterDifficulty: string;
}

export function WorkoutTemplatesGrid({
  templates,
  onStartWorkout,
  onViewDetails,
  hasFilters,
  searchTerm,
  filterCategory,
  filterDifficulty,
}: WorkoutTemplatesGridProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'resistance':
        return '🏋️';
      case 'cardio':
        return '🏃';
      case 'flexibility':
        return '🧘';
      case 'plyometrics':
        return '⚡';
      case 'martial arts':
        return '🥋';
      default:
        return '💪';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'resistance':
        return 'bg-blue-100 text-blue-800';
      case 'cardio':
        return 'bg-red-100 text-red-800';
      case 'flexibility':
        return 'bg-purple-100 text-purple-800';
      case 'plyometrics':
        return 'bg-orange-100 text-orange-800';
      case 'martial arts':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (templates.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No workouts found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {hasFilters ? 'Try adjusting your filters' : 'No P90X workouts available'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
              {template.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">⏱️</span>
                <span className="text-gray-700 dark:text-gray-300">{formatDuration(template.estimatedDurationMinutes)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">💪</span>
                <span className="text-gray-700 dark:text-gray-300">{template.exerciseCount} exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📋</span>
                <span className="text-gray-700 dark:text-gray-300">{template.sectionCount} sections</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">🏋️</span>
                <span className="text-gray-700 dark:text-gray-300 text-xs truncate">{template.equipment}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
              {onStartWorkout && (
                <Button
                  onClick={() => onStartWorkout(template)}
                  className="flex-1"
                  size="sm"
                >
                  Start Workout
                </Button>
              )}
              {onViewDetails && (
                <Button
                  onClick={() => onViewDetails(template)}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Details
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
