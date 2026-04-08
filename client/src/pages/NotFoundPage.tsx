import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
      <p className="text-8xl font-black text-gray-800">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-gray-500">That route doesn't exist.</p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
