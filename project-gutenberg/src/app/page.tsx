"use client";

import { useState } from "react";
import BookFetcher from "../components/BookFetcher";
import BookHistory from "../components/BookHistory";
import BookDisplay from "../components/BookDisplay";
import type { Book } from "../app/types";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // from Shadcn


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
  <main className="p-4">
      <h1 className="text-2xl font-bold">Project Gutenberg</h1>
      <BookFetcher />
      <BookHistory onSelect={handleBookSelect} />

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-scroll">
          {selectedBook && <BookDisplay book={selectedBook} />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
