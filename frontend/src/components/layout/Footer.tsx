export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* App Info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">X</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">XTracker</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Track your P90X workouts and achieve your fitness goals with our comprehensive workout logging system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="/workouts" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Workouts
                </a>
              </li>
              <li>
                <a href="/schedule" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Schedule
                </a>
              </li>
              <li>
                <a href="/stats" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Statistics
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="/help" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} XTracker. All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
              Built with Next.js and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
