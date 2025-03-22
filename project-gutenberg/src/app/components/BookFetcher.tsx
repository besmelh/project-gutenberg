"use client";

import { useState } from "react";

export default function BookFetcher() {
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookText, setBookText] = useState("");
  const [metadata, setMetadata] = useState("");
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!bookId) return;
    setLoading(true);
    setError("");
    setBookText("");
    setMetadata("");

    const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_BASE : ""; // Netlify will handle prod path
    // const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
    const bookUrl = `${baseUrl}/.netlify/functions/fetch-book?id=${bookId}`;
    const metaUrl = `${baseUrl}/.netlify/functions/fetch-metadata?id=${bookId}`;

    const metaRes = await fetch(`${baseUrl}/.netlify/functions/fetch-metadata?id=${bookId}`);
    const metadata = await metaRes.json();
    console.log('metadata: ', metadata);


    try {
      const response = await fetch(bookUrl);

      if (!response.ok) throw new Error("Book not found or unavailable.");
      const text = await response.text();
      setBookText(text.slice(0, 2000)); // Limit display for now
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Something went wrong while fetching the book text.");
          }    } finally {
      setLoading(false);
    }

    try {
        const response = await fetch(metaUrl);
        if (!response.ok) throw new Error("Metadata not found or unavailable.");
        const metadata = await response.json();
        console.log('metadata: ', metadata);
        setMetadata(metadata);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong while fetching the book metadata.");
            }    } finally {
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

    {metadata && (
       <div className="mt-6">
       <h3 className="text-xl font-semibold mb-2">Metadata</h3>
       <ul className="list-disc pl-5 text-sm space-y-1">
         {Object.entries(metadata).map(([key, value]) => (
           <li key={key}>
             <strong>{key}:</strong> {value}
           </li>
         ))}
       </ul>
     </div>
      )}
    </div>
  );
}
