import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
        
        <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for doesn't exist or was moved.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>

          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 text-blue-600 border border-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  )
}
