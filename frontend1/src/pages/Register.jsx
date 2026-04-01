// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthLayout from "../components/AuthLayout";
// import InputField from "../components/InputField";
// import Loader from "../components/Loader";
// import { registerUser } from "../services/authApi";

// const Register = () => {
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     passwordHash: "",
//     role: "customer",
//   });
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email) newErrors.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
//     if (!formData.passwordHash) newErrors.passwordHash = "Password is required";
//     else if (formData.passwordHash.length < 6) newErrors.passwordHash = "Password must be at least 6 characters";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");
//     if (!validate()) return;

//     setIsLoading(true);
//     try {
//       await registerUser(formData);
//       navigate("/login");
//     } catch (error) {
//       setApiError(error.response?.data?.message || "Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//     if (errors[e.target.id]) setErrors({ ...errors, [e.target.id]: "" });
//   };

//   return (
//     <AuthLayout>
//       <h2 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h2>
//       <p className="text-slate-500 text-sm mb-6">Start managing your tailoring orders today</p>

//       {apiError && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//           {apiError}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <InputField
//           label="Full Name"
//           id="name"
//           type="text"
//           placeholder="John Doe"
//           value={formData.name}
//           onChange={handleChange}
//           error={errors.name}
//           disabled={isLoading}
//         />
        
//         <InputField
//           label="Email Address"
//           id="email"
//           type="email"
//           placeholder="you@example.com"
//           value={formData.email}
//           onChange={handleChange}
//           error={errors.email}
//           disabled={isLoading}
//         />

//         <InputField
//           label="Password"
//           id="passwordHash"
//           type="password"
//           placeholder="••••••••"
//           value={formData.passwordHash}
//           onChange={handleChange}
//           error={errors.passwordHash}
//           disabled={isLoading}
//         />

//         <div className="space-y-1.5">
//           <label htmlFor="role" className="block text-sm font-medium text-slate-700">
//             Account Type
//           </label>
//           <select
//             id="role"
//             value={formData.role}
//             onChange={handleChange}
//             disabled={isLoading}
//             className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             <option value="customer">Customer</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
//         >
//           {isLoading ? <Loader size="sm" /> : "Create Account"}
//         </button>
//       </form>

//       <p className="mt-6 text-center text-sm text-slate-500">
//         Already have an account?{" "}
//         <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
//           Sign in
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// };

// export default Register;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Loader from "../components/Loader";
import { registerUser } from "../services/authApi";

// Password strength calculator
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score, label: "Fair", color: "#f97316" };
  if (score === 3) return { score, label: "Good", color: "#eab308" };
  if (score >= 4) return { score, label: "Strong", color: "#22c55e" };
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const FieldWrapper = ({ label, htmlFor, error, children }) => (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
);

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});

  const passwordStrength = getPasswordStrength(formData.password);

  const validate = (data = formData) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = "Full name is required";
    else if (data.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!data.email) newErrors.email = "Email address is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = "Enter a valid email address";

    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (passwordStrength.score < 2) newErrors.password = "Password is too weak — add uppercase, numbers, or symbols";

    if (!data.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Mark all fields as touched on submit
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      // Only send name, email, password — role assigned server-side
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Clear api error on any change
    if (apiError) setApiError("");

    // Live validate only touched fields
    if (touched[name]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name] || "",
        // Also re-validate confirmPassword if password changes
        ...(name === "password" && touched.confirmPassword
          ? { confirmPassword: newErrors.confirmPassword || "" }
          : {}),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate();
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none transition-all duration-200 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed text-sm";
  const inputNormal = "border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500";
  const inputError = "border-red-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-red-50";

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h2>
      <p className="text-slate-500 text-sm mb-6">Start managing your tailoring orders today</p>

      {/* API Error Banner */}
      {apiError && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Full Name */}
        <FieldWrapper label="Full Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
        </FieldWrapper>

        {/* Email */}
        <FieldWrapper label="Email Address" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            aria-invalid={!!errors.email}
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
        </FieldWrapper>

        {/* Password */}
        <FieldWrapper label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              className={`${inputBase} pr-11 ${errors.password ? inputError : inputNormal}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Password strength meter */}
          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        i <= passwordStrength.score
                          ? passwordStrength.color
                          : "#e2e8f0",
                    }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: passwordStrength.color }}>
                {passwordStrength.label} password
              </p>
            </div>
          )}
        </FieldWrapper>

        {/* Confirm Password */}
        <FieldWrapper label="Confirm Password" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              className={`${inputBase} pr-11 ${errors.confirmPassword ? inputError : inputNormal}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>

          {/* Match indicator */}
          {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Passwords match
            </p>
          )}
        </FieldWrapper>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 mt-2"
        >
          {isLoading ? <Loader size="sm" /> : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Register;