import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resetPassword } from '../api/api'
import { useFormValidation, validators } from '../hooks/useFormValidation'
import { FormField, PasswordInput, Spinner } from '../components/FormField'

const RULES = {
  password: [validators.required, validators.minLength(8)],
  confirmPassword: [validators.required],
}

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation(
      { password: '', confirmPassword: '' },
      {
        ...RULES,
        confirmPassword: [
          validators.required,
          (v) => (v !== values.password ? 'Passwords do not match' : null),
        ],
      }
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitting(true)
    try {
      await resetPassword(token, values.password)
      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      toast.error(err.userMessage || 'Reset link is invalid or expired')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-sm">
          <p className="font-mono text-xs text-[#64748B] uppercase tracking-widest mb-4">Error</p>
          <h2 className="font-display text-2xl font-semibold text-[#0F172A] mb-3">Invalid link</h2>
          <p className="font-body text-[#64748B] text-sm mb-6">
            This reset link is missing a token. Please request a new one.
          </p>
          <Link to="/forgot-password" className="btn-primary">
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-semibold text-[#0F172A] hover:text-[#333333] transition-colors">
            Larkinse
          </Link>
          <p className="font-mono text-xs text-[#64748B] uppercase tracking-widest mt-3">
            Choose new password
          </p>
        </div>

        <div className="auth-card">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#0F172A] mb-2">
                Password updated!
              </h2>
              <p className="font-body text-[#64748B] text-sm">
                Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <>
              <p className="font-body text-[#64748B] text-sm mb-6 leading-relaxed">
                Choose a new strong password for your account. Make it at least 8 characters.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <FormField
                  label="New password"
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
                    placeholder="••••••••"
                  />
                </FormField>

                <FormField
                  label="Confirm new password"
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                >
                  <PasswordInput
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center mt-1"
                >
                  {submitting ? (
                    <>
                      <Spinner /> Resetting…
                    </>
                  ) : (
                    'Reset password'
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-[#CBD5E1] text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-body text-[#64748B] hover:text-[#333333] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
