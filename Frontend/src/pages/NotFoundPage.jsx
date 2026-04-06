import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-up">
        <p className="font-mono text-[80px] font-medium text-ink-100 leading-none mb-4 select-none">
          404
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink-900 mb-3">
          Page not found
        </h1>
        <p className="font-body text-ink-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </div>
  )
}
