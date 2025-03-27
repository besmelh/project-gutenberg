"use client";

import { useState } from "react";
import BookFetcher from "../components/BookFetcher";
import BookHistory from "../components/BookHistory";
import BookDisplay from "../components/BookDisplay";
import type { Book } from "../app/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";


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
  <main className="flex h-screen">

      {/* Left panel: Search + History */}
      <div className={`transition-all duration-500 ease-in-out p-4 border-r overflow-y-auto ${
        selectedBook ? "w-1/3 max-w-xs" : "w-full"
      }`}>
        <h1 className="text-2xl font-bold">Project Gutenberg</h1>
        {!selectedBook && (
          <>
            <BookFetcher onBookFetched={(book) => setSelectedBook(book)}/>
            <BookHistory onSelect={handleBookSelect} />
          </>
        )}
        {selectedBook && (
          <BookHistory onSelect={handleBookSelect} />
        )}

      </div>

        {/* Right panel: BookDisplay */}
        {selectedBook && (
        <div className="flex-1 p-6 overflow-y-auto">
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
