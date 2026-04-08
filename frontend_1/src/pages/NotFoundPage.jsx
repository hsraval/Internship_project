import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="text-center max-w-sm animate-fade-up">
        <p className="font-mono text-[80px] font-medium text-[#0F172A] leading-none mb-4 select-none">
          404
        </p>
        <h1 className="font-display text-3xl font-semibold text-[#0F172A] mb-3">
          Page not found
        </h1>
        <p className="font-body text-[#64748B] text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </div>
  )
}
