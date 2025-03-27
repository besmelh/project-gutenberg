"use client";

import { useState } from "react";
import BookFetcher from "../components/BookFetcher";
import BookHistory from "../components/BookHistory";
import BookDisplay from "../components/BookDisplay";
import type { Book } from "../app/types";


export default function Home() {

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookSelect = (bookId: string) => {
    console.log("selected: ", bookId);
    const stored = localStorage.getItem("gutenbergBooks");
    if (!stored) return;
    const books: Book[] = JSON.parse(stored);
    const found = books.find((b) => b.id === bookId);
    if (found) setSelectedBook(found);
  };


  return (
  <main className={` flex px-6 py-8 ${
        selectedBook ? "" : "max-w-screen-xl mx-auto"
      }`}>
        
      {/* Left panel: Search + History */}
      <div className={`transition-all duration-300 ease-in-out p-4 overflow-y-auto ${
        selectedBook ? "w-1/4 border-r" : "w-full"
      }`}>
        <h1 className="text-2xl font-bold text-center mb-10">Project Gutenberg</h1>
        {!selectedBook && (
          <div className="mb-20">
            <BookFetcher onBookFetched={(book) => setSelectedBook(book)}/>
            <BookHistory onSelect={handleBookSelect} />
          </div>
        )}
        {selectedBook && (
          <BookHistory onSelect={handleBookSelect} />
        )}

      </div>

        {/* Right panel: BookDisplay */}
        {selectedBook && (
        <div className="flex-1 p-6 overflow-y-auto ">
          <button
            onClick={() => setSelectedBook(null)}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            ← Back to Search
          </button>
          <BookDisplay
            book={selectedBook}
            onUpdate={(updated) => setSelectedBook(updated)}
          />

        </div>
      )}
    </main>
  );
}
