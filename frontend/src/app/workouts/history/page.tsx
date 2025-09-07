import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';

export default function WorkoutHistory() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Workout History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View your past workout sessions and track your progress over time.
          </p>
        </div>

        <Card className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No workout history yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start logging your P90X workouts to see your progress here.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
