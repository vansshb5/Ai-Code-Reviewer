import { useState } from "react";
import axios from "axios";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(url, payload);

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">
          🤖 AI Code Reviewer
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {isLogin ? "Welcome back!" : "Create your account"}
        </p>

        {/* Name field (register only) */}
        {!isLogin && (
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-1 block">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-purple-500"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-xl mb-4 border border-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-bold py-3 rounded-xl transition mb-4"
        >
          {loading ? "⏳ Please wait..." : isLogin ? "🔑 Login" : "🚀 Create Account"}
        </button>

        {/* Toggle */}
        <p className="text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

      </div>
    </div>
  );
}