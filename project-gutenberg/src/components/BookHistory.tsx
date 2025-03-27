"use client";

import { useEffect, useState } from "react";
import type { Book } from "../app/types";

type Props = {
  onSelect: (bookId: string) => void;
  selectedBook: boolean;
};

const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

export default function BookHistory({ onSelect, selectedBook }: Props) {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("gutenbergBooks");
    if (stored) {
      setSavedBooks(JSON.parse(stored));
    }
  }, []);

  if (savedBooks.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between">
      <h2 className="text-md font-bold mb-2 opacity-75">Previously Accessed Books</h2>
        <button
          onClick={() => {
            localStorage.removeItem("gutenbergBooks");
            setSavedBooks([]);
          }}
          className="text-sm text-red-600 hover:underline mb-2"
        >
          Clear History
        </button>
      </div>
      <ul className="space-y-2">
        {savedBooks.map((book) => (
          <li
            key={book.id}
            // className="p-3 border rounded cursor-pointer border-accent-grey hover:border-accent-dark hover:bg-accent-light transition-colors "
            onClick={() => onSelect(book.id)}
            className={`p-3 border rounded cursor-pointer   transition-colors ${
              selectedBook ? " border-accent-dark hover:bg-accent-dark" : "border-accent-grey hover:border-accent-dark hover:bg-accent-light"
            }`}
          >
            <strong className="opacity-90">{book.metadata?.Title || "Untitled"}</strong>
            <br/>
            <p className="text-sm opacity-50 mt-2">Author: {book.metadata?.Author || "Unknown"}</p>
            <p className="text-sm opacity-50">ID: {book.id}</p>
            <p className="text-sm opacity-50">Last accessed: {formatTimestamp(book.timestamp)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
