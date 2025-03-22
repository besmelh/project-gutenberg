"use client";

import { useState } from "react";

export default function BookFetcher() {
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookText, setBookText] = useState("");
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!bookId) return;
    setLoading(true);
    setError("");
    setBookText("");

    // const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
    const contentUrl = `http://localhost:8888/.netlify/functions/fetch-book?id=${bookId}`;

    try {
      const response = await fetch(contentUrl);

      if (!response.ok) throw new Error("Book not found or unavailable.");
      const text = await response.text();
      setBookText(text.slice(0, 2000)); // Limit display for now
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Fetch a Book by ID</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Book ID (e.g., 75682)"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !bookId}
          className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {bookText && (
        <div className="mt-4 max-h-80 overflow-y-scroll border p-2 bg-gray-100 whitespace-pre-wrap">
          {bookText}
        </div>
      )}
    </div>
  );
}
