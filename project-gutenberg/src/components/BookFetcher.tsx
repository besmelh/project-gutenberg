"use client";

import { useState } from "react";
import type { Book } from "../app/types";


type Props = {
  onBookFetched?: (book: Book) => void;
};


export default function BookFetcher({ onBookFetched }: Props) {
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  
  //const saveBookToLocalStorage = (id: string, text: string, metadata: Record<string, string>, analysis: string) => {
  const saveBookToLocalStorage = (newBook: Book) => {
    const existing: Book[] = JSON.parse(localStorage.getItem("gutenbergBooks") || "[]");

    // replace the book listing if already exist
    const updated: Book[] = [newBook, ...existing.filter((book: Book) => book.id !== newBook.id)];
    localStorage.setItem("gutenbergBooks", JSON.stringify(updated));
  };
  

  const handleFetch = async () => {
    if (!bookId) return;
    setLoading(true);
    setError("");

    const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_BASE : ""; // Netlify will handle prod path
    // const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
    const bookUrl = `${baseUrl}/.netlify/functions/fetch-book?id=${bookId}`;
    const metaUrl = `${baseUrl}/.netlify/functions/fetch-metadata?id=${bookId}`;

    const metaRes = await fetch(`${baseUrl}/.netlify/functions/fetch-metadata?id=${bookId}`);
    const metadata = await metaRes.json();
    console.log('metadata: ', metadata);

    let text = "";

    try {
      const response = await fetch(bookUrl);

      if (!response.ok) throw new Error("Book not found or unavailable.");
      text = await response.text();
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Something went wrong while fetching the book text.");
          }    
    } 
    finally {
      setLoading(false);
    }

    try {
        const response = await fetch(metaUrl);
        if (!response.ok) throw new Error("Metadata not found or unavailable.");
        const metadata = await response.json();
        console.log('metadata: ', metadata);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while fetching the book metadata.");
      }    
    } 
    finally {
      setLoading(false);
    }
    
    const newBook = {
      id: bookId || "",
      text,
      metadata: metadata || {},
      timestamp: Date.now(),
      analysis: "",
    };
    saveBookToLocalStorage(newBook);
    onBookFetched?.(newBook);
    // setTimeout(() => {
    //   onBookFetched?.(newBook);
    // }, 0);
    
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 opacity-75">Fetch a Book by ID</h2>
      <div className="flex gap-2 mb-10">
        <input
          type="text"
          placeholder="Enter Book ID (e.g., 75682)"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="border rounded px-2 py-1 flex-1 border-accent-grey"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !bookId}
          className="text-foreground px-4 py-2 rounded bg-accent hover:bg-accent-dark transition-colors disabled:opacity-70"

        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

    </div>
  );
}
