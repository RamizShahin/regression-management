import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState, FormEvent } from "react";
import authService from "../../services/auth";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const formValues = { email, password };
    const result = userSchema.safeParse(formValues);

    if (!result.success) {
      setErrorMessage(result.error.errors.map((e) => e.message).join("\n"));
      return;
    }

    try {
      await authService.login(email, password);
      navigate("/");
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login failed", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2b003a] to-[#000842] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 mt-2 text-center text-2xl font-bold text-gray-800">
          Sign in
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email or phone number
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
           <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-fuchsia-600 hover:to-violet-600 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;