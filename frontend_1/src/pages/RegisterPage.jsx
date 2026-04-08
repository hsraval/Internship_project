import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerUser } from '../api/api'
import { useFormValidation, validators } from '../hooks/useFormValidation'
import { FormField, PasswordInput, Spinner } from '../components/FormField'

const RULES = {
  name: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  password: [validators.required, validators.minLength(8)],
  confirmPassword: [validators.required],
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation(
      { name: '', email: '', password: '', confirmPassword: '' },
      {
        ...RULES,
        // Dynamic rule that references current password value
        confirmPassword: [
          validators.required,
          // Inline match validator using closure
          (v) => (v !== values.password ? 'Passwords do not match' : null),
        ],
      }
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitting(true)
    try {
      await registerUser(values)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.userMessage || 'Registration failed')
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
            Luminary
          </Link>
          <p className="font-mono text-xs text-[#64748B] uppercase tracking-widest mt-3">Create Account</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormField label="Full name" error={errors.name} touched={touched.name}>
              <input
                type="text"
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane Smith"
                autoComplete="name"
                className={`input-field ${touched.name && errors.name ? 'error' : ''}`}
              />
            </FormField>

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
                className={`input-field ${touched.email && errors.email ? 'error' : ''}`}
              />
            </FormField>

            <FormField
              label="Password"
              error={errors.password}
              touched={touched.password}
              hint="Minimum 8 characters"
            >
              <PasswordInput
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                autoComplete="new-password"
              />
            </FormField>

            <FormField label="Confirm password" error={errors.confirmPassword} touched={touched.confirmPassword}>
              <PasswordInput
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                autoComplete="new-password"
              />
            </FormField>

            {/* Password strength indicator */}
            {values.password.length > 0 && (
              <PasswordStrength password={values.password} />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center mt-1"
            >
              {submitting ? (
                <>
                  <Spinner /> Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 text-center">
            <p className="text-sm font-body text-ink-500">
              Already have an account?{' '}
              <Link to="/login" className="text-ink-900 font-medium hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-body text-ink-300 mt-6 px-4">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

function PasswordStrength({ password }) {
  const score = getScore(password)
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-400']
  const textColors = ['text-red-500', 'text-amber-500', 'text-blue-500', 'text-green-500']

  return (
    <div>
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : 'bg-ink-100'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-mono ${textColors[score]}`}>{labels[score]}</p>
    </div>
  )
}

function getScore(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 3)
}
