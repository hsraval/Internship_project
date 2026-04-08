import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPassword } from '../api/api'
import { useFormValidation, validators } from '../hooks/useFormValidation'
import { FormField, Spinner } from '../components/FormField'

const RULES = {
  email: [validators.required, validators.email],
}

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation({ email: '' }, RULES)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitting(true)
    try {
      await forgotPassword(values.email)
      setSent(true)
      toast.success('Reset email sent!')
    } catch (err) {
      toast.error(err.userMessage || 'Could not send reset email')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-semibold text-[#0F172A] hover:text-[#333333] transition-colors">
            Luminary
          </Link>
          <p className="font-mono text-xs text-[#64748B] uppercase tracking-widest mt-3">
            Reset password
          </p>
        </div>

        <div className="auth-card">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#34C759] border border-[#34C759] flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#0F172A] mb-2">
                Check your inbox
              </h2>
              <p className="font-body text-[#333333] text-sm leading-relaxed mb-6">
                We sent a reset link to{' '}
                <span className="font-medium text-[#333333]">{values.email}</span>.
                It expires in 30 minutes.
              </p>
              <p className="text-xs font-body text-[#333333]">
                Didn't get it?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#333333] font-medium hover:underline underline-offset-2"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <p className="font-body text-[#64748B] text-sm mb-6 leading-relaxed">
                Enter the email address linked to your account and we'll send you a secure reset link.
              </p>

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
                    className={`input-field ${touched.email && errors.email ? 'error' : ''}`}
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center"
                >
                  {submitting ? (
                    <>
                      <Spinner /> Sending…
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-ink-100 text-center">
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
