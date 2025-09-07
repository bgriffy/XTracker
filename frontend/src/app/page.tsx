import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <MainLayout showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Transform Your Body with{' '}
              <span className="text-blue-600 dark:text-blue-400">XTracker</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate P90X workout tracking platform. Log your workouts, monitor your progress, 
              and achieve your fitness goals with our comprehensive system designed for serious athletes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up Free
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
                Log In
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Join thousands of athletes already transforming their fitness journey
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything you need to track your fitness journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed to help you stay consistent and motivated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Workout Logging
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Log your P90X workouts with detailed exercise tracking, sets, reps, and weights.
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Schedule Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Follow the 90-day P90X program with our interactive schedule and progress tracking.
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Progress Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your progress with detailed statistics and performance metrics.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your fitness journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of athletes who are already tracking their P90X progress and achieving incredible results
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Your Transformation
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
