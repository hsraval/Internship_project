import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <p className="font-mono text-xs text-ink-400 uppercase tracking-widest mb-4">Error</p>
            <h1 className="font-display text-3xl font-semibold text-ink-900 mb-3">
              Something broke
            </h1>
            <p className="font-body text-ink-500 mb-8 text-sm">
              An unexpected error occurred. The issue has been noted.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn-ghost"
              >
                Try again
              </button>
              <Link to="/" className="btn-primary">
                Go home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
