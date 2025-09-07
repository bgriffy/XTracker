import Card from '@/components/ui/Card';

interface WorkoutSummaryProps {
  filteredCount: number;
  totalCount: number;
  hasFilters: boolean;
  workoutType?: string;
}

export function WorkoutSummary({ 
  filteredCount, 
  totalCount, 
  hasFilters, 
  workoutType = 'workouts' 
}: WorkoutSummaryProps) {
  if (filteredCount === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCount} of {totalCount} {workoutType}
        {hasFilters && ' matching your filters'}
      </div>
    </Card>
  );
}
