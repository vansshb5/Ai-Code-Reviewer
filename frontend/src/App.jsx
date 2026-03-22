import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import History from "./components/History";
import Auth from "./components/Auth";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "c++", label: "C++", icon: "⚙️" },
  { value: "typescript", label: "TypeScript", icon: "🔷" },
  { value: "php", label: "PHP", icon: "🐘" },
  { value: "go", label: "Go", icon: "🐹" },
];

function ScoreCard({ result }) {
  const issueCount = result.issues?.length || 0;
  const suggestionCount = result.suggestions?.length || 0;
  const securityCount = result.security?.length || 0;
  const score = Math.max(0, 100 - issueCount * 15 - securityCount * 20 - suggestionCount * 5);
  const scoreColor = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const scoreLabel = score >= 80 ? "Good" : score >= 50 ? "Fair" : "Poor";

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-5 mb-4 fade-in flex items-center justify-between">
      <div>
        <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Quality Score</p>
        <p className="text-5xl font-bold" style={{ color: scoreColor }}>
          {score}<span className="text-xl text-neutral-500">/100</span>
        </p>
        <p className="text-neutral-400 text-sm mt-1">{scoreLabel}</p>
      </div>
      <div className="flex gap-3">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-center w-20">
          <p className="text-xl font-bold text-red-400">{issueCount}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Issues</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-center w-20">
          <p className="text-xl font-bold text-yellow-400">{suggestionCount}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Tips</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-center w-20">
          <p className="text-xl font-bold text-orange-400">{securityCount}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Security</p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 fade-in">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl p-5 border border-[#1e1e1e]">
          <div className="shimmer h-3 w-24 rounded mb-3"></div>
          <div className="shimmer h-3 w-full rounded mb-2"></div>
          <div className="shimmer h-3 w-2/3 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState("// Paste your code here\n");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setResult(null);
  };

 const handleReview = async () => {
  setLoading(true);
  setError(null);
  setResult(null);
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/review`,
      { code, language },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setResult(res.data);
  } catch (err) {
    setError("Something went wrong. Is your backend running?");
  } finally {
    setLoading(false);
  }
};

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improved_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectReview = (review) => {
    setCode(review.code);
    setLanguage(review.language);
    setResult(review.result);
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Top Nav */}
      <div className="border-b border-[#1a1a1a] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-semibold text-white tracking-tight">CodeReview</span>
            <span className="text-[10px] bg-[#1a1a1a] border border-[#2a2a2a] text-neutral-400 px-2 py-0.5 rounded-full ml-1">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 hover:text-white border border-[#222] hover:border-[#444] px-3 py-1.5 rounded-lg transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Code Reviewer</h2>
          <p className="text-neutral-500 text-sm mt-1">Paste your code and get instant AI-powered feedback</p>
        </div>

        {/* History */}
        <History onSelectReview={handleSelectReview} />

        {/* Editor Card */}
        <div className="border border-[#1e1e1e] rounded-xl overflow-hidden mb-3 bg-[#0d0d0d]">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e1e] bg-[#111]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              <span className="text-neutral-600 text-xs ml-2">editor</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1a1a1a] text-neutral-300 text-xs px-3 py-1.5 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[#444]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <Editor
            height="320px"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              lineNumbers: "on",
              cursorBlinking: "smooth",
            }}
          />
        </div>

        {/* Review Button */}
        <button
          onClick={handleReview}
          disabled={loading}
          className="w-full bg-white hover:bg-neutral-100 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-semibold py-3 rounded-xl transition mb-6 text-sm"
        >
          {loading ? "Analyzing..." : "Review Code →"}
        </button>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm p-4 rounded-xl mb-4 border border-red-900/50 bg-red-900/10 fade-in">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-3">

            <ScoreCard result={result} />

            {/* Summary */}
            <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 fade-in">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Summary</p>
              <p className="text-neutral-300 leading-relaxed text-sm">{result.summary}</p>
            </div>

            {/* Issues */}
            {result.issues?.length > 0 && (
              <div className="bg-[#111] border border-[#2a1a1a] rounded-xl p-5 fade-in">
                <p className="text-xs text-red-500 uppercase tracking-widest mb-3">Issues · {result.issues.length}</p>
                <ul className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2 items-start">
                      <span className="text-red-500 mt-0.5 shrink-0">–</span> {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <div className="bg-[#111] border border-[#2a2a1a] rounded-xl p-5 fade-in">
                <p className="text-xs text-yellow-500 uppercase tracking-widest mb-3">Suggestions · {result.suggestions.length}</p>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2 items-start">
                      <span className="text-yellow-500 mt-0.5 shrink-0">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security */}
            {result.security?.length > 0 && (
              <div className="bg-[#111] border border-[#2a1f1a] rounded-xl p-5 fade-in">
                <p className="text-xs text-orange-500 uppercase tracking-widest mb-3">Security · {result.security.length}</p>
                <ul className="space-y-2">
                  {result.security.map((s, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2 items-start">
                      <span className="text-orange-500 mt-0.5 shrink-0">!</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Performance */}
            {result.performance?.length > 0 && (
              <div className="bg-[#111] border border-[#1a1a2a] rounded-xl p-5 fade-in">
                <p className="text-xs text-blue-500 uppercase tracking-widest mb-3">Performance · {result.performance.length}</p>
                <ul className="space-y-2">
                  {result.performance.map((s, i) => (
                    <li key={i} className="text-sm text-neutral-300 flex gap-2 items-start">
                      <span className="text-blue-500 mt-0.5 shrink-0">↑</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improved Code */}
            {result.improved_code && (
              <div className="bg-[#0d0d0d] border border-[#1a2a1a] rounded-xl overflow-hidden fade-in">
                <div className="px-5 py-3 border-b border-[#1a2a1a] flex justify-between items-center bg-[#111]">
                  <p className="text-xs text-green-500 uppercase tracking-widest">Improved Code</p>
                  <button
                    onClick={handleCopy}
                    className={`text-xs px-3 py-1.5 rounded-lg transition border ${
                      copied
                        ? "bg-green-900/30 text-green-400 border-green-800"
                        : "text-neutral-400 border-[#2a2a2a] hover:border-[#444] hover:text-white"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <Editor
                  height="250px"
                  language={language}
                  value={result.improved_code}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    readOnly: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                    fontFamily: "JetBrains Mono, Fira Code, monospace",
                  }}
                />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}