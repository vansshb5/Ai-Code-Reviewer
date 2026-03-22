import { useState, useEffect } from "react";
import axios from "axios";

export default function History({ onSelectReview }) {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/review/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchHistory();
  }, [open]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/review/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(history.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete");
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="mb-5">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white border border-[#222] hover:border-[#444] px-3 py-1.5 rounded-lg transition mb-3"
      >
        <span></span>
        <span>{open ? "Hide History" : "History"}</span>
        {history.length > 0 && (
          <span className="bg-[#1e1e1e] text-neutral-400 text-xs px-1.5 py-0.5 rounded-md">
            {history.length}
          </span>
        )}
      </button>

      {/* History Panel */}
      {open && (
        <div className="border border-[#1e1e1e] rounded-xl overflow-hidden bg-[#0d0d0d] fade-in">

          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#1e1e1e]">
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Recent Reviews</p>
            <button
              onClick={fetchHistory}
              className="text-xs text-neutral-600 hover:text-neutral-300 transition"
            >
              Refresh
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-6 text-center text-neutral-600 text-sm">Loading...</div>
          ) : history.length === 0 ? (
            <div className="p-6 text-center text-neutral-600 text-sm">No reviews yet</div>
          ) : (
            <div className="divide-y divide-[#141414] max-h-72 overflow-y-auto">
              {history.map((review) => (
                <div
                  key={review._id}
                  onClick={() => { onSelectReview(review); setOpen(false); }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#111] cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-neutral-400 px-2 py-0.5 rounded-md shrink-0">
                      {review.language}
                    </span>
                    <span className="text-sm text-neutral-500 truncate">
                      {review.code.slice(0, 55)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <span className="text-xs text-neutral-600">
                      {timeAgo(review.createdAt)}
                    </span>
                    <button
                      onClick={(e) => handleDelete(review._id, e)}
                      className="text-neutral-700 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}