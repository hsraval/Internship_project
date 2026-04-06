import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Loader from "../components/Loader";
import { registerUser } from "../services/authApi";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordHash: "",
    role: "customer",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.passwordHash) newErrors.passwordHash = "Password is required";
    else if (formData.passwordHash.length < 6) newErrors.passwordHash = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) setErrors({ ...errors, [e.target.id]: "" });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h2>
      <p className="text-slate-500 text-sm mb-6">Start managing your tailoring orders today</p>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Full Name"
          id="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isLoading}
        />
        
        <InputField
          label="Email Address"
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
        />

        <InputField
          label="Password"
          id="passwordHash"
          type="password"
          placeholder="••••••••"
          value={formData.passwordHash}
          onChange={handleChange}
          error={errors.passwordHash}
          disabled={isLoading}
        />

        <div className="space-y-1.5">
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">
            Account Type
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {isLoading ? <Loader size="sm" /> : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;