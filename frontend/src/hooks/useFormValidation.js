import { useState, useCallback } from 'react'

const validators = {
  required: (value) => (!value || !String(value).trim() ? 'This field is required' : null),
  email: (value) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : null,
  minLength: (min) => (value) =>
    value && value.length < min ? `Must be at least ${min} characters` : null,
  match: (other, label = 'Passwords') => (value) =>
    value !== other ? `${label} do not match` : null,
}

export function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = useCallback(
    (fieldValues = values) => {
      const newErrors = {}
      Object.keys(rules).forEach((field) => {
        const fieldRules = rules[field]
        for (const rule of fieldRules) {
          const error = rule(fieldValues[field])
          if (error) {
            newErrors[field] = error
            break
          }
        }
      })
      return newErrors
    },
    [rules, values]
  )

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear error on change after being touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }, [touched])

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))
      const fieldErrors = validate()
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || null }))
    },
    [validate]
  )

  const validateAll = useCallback(() => {
    const allErrors = validate()
    setErrors(allErrors)
    const allTouched = Object.keys(rules).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)
    return Object.keys(allErrors).length === 0
  }, [validate, rules])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return { values, errors, touched, handleChange, handleBlur, validateAll, reset, setValues }
}

export { validators }
