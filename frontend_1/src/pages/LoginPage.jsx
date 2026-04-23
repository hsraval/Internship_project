import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/api'
import { useFormValidation, validators } from '../hooks/useFormValidation'
import { FormField, PasswordInput, Spinner } from '../components/FormField'
import { useState } from 'react'

const RULES = {
  email: [validators.required, validators.email],
  password: [validators.required],
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [submitting, setSubmitting] = useState(false)
  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation({ email: '', password: '' }, RULES)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitting(true)
    try {
      const { data } = await loginUser(values)
      login(data.user ?? data)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      const errorMessage = err.userMessage || err.message || 'Invalid email or password'
      // Show proper error message for authentication failures
      if (errorMessage.includes('Invalid') || errorMessage.includes('request failed') || errorMessage.includes('Request failed')) {
        toast.error('Invalid credentials')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-semibold text-[#0F172A] hover:text-[#333333] transition-colors">
            Larkinse
          </Link>
          <p className="font-mono text-xs text-[#64748B] uppercase tracking-widest mt-3">Sign in</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormField label="Email address" error={errors.email} touched={touched.email}>
              <input
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                autoComplete="email"
                className={`input-field ${touched.email && errors.email ? 'border-[#EF4444]' : 'border-[#CBD5E1]'}`}
              />
            </FormField>

            <FormField label="Password" error={errors.password} touched={touched.password}>
              <PasswordInput
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                autoComplete="current-password"
              />
            </FormField>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-body text-[#64748B] hover:text-[#333333] transition-colors underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center mt-1"
            >
              {submitting ? (
                <>
                  <Spinner /> Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 text-center">
            <p className="text-sm font-body text-ink-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-ink-900 font-medium hover:underline underline-offset-2">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
