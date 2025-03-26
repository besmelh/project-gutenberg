"use client";

import { useEffect, useState } from "react";
import type { Book } from "../app/types";

type Props = {
  onSelect: (bookId: string) => void;
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

  
export default function BookHistory({ onSelect }: Props) {
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
      <h2 className="text-lg font-bold mb-2">Previously Accessed Books</h2>
      <ul className="space-y-2">
        {savedBooks.map((book) => (
          <li
            key={book.id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => onSelect(book.id)}
          >
            <strong>{book.metadata?.Title || "Untitled"}</strong>
            <br />
            <p className="text-sm text-gray-600">Author: {book.metadata?.Author || "Unknown"}</p>
            <p className="text-sm text-gray-600">ID: {book.id}</p>
            <p className="text-sm text-gray-600">Last accessed: {formatTimestamp(book.timestamp)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
