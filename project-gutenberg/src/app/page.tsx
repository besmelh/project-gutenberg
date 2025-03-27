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
  <main className={` flex px-6  ${
        selectedBook ? "py-8" : "py-18 max-w-screen-xl mx-auto"
      }`}>
        
      {/* Left panel: Search + History */}
      <div className={`transition-all duration-300 ease-in-out p-4 overflow-y-auto ${
        selectedBook ? "w-1/4 border-r bg-accent bg-opacity-10" : "w-full"
      }`}>
        <h1 className={`font-bold mb-10 
        ${selectedBook ? "text-left text-2xl opacity-80" : "text-4xl text-center"}`}>
          Project Gutenberg
        </h1>
        {!selectedBook && (
          <div className="mb-20">
            <BookFetcher onBookFetched={(book) => setSelectedBook(book)}/>
            <BookHistory onSelect={handleBookSelect} selectedBook={false} />
          </div>
        )}
        {selectedBook && (
          <BookHistory onSelect={handleBookSelect} selectedBook={true}/>
        )}

      </div>

        {/* Right panel: BookDisplay */}
        {selectedBook && (
        <div className="flex-1 p-6 overflow-y-auto ">
          <button
            onClick={() => setSelectedBook(null)}
            className="mb-4 text-sm bg-accent text-accent-foreground px-3 py-1 rounded hover:bg-accent-dark disabled:opacity-50"
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
