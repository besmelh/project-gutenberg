"use client";

import BookFetcher from "../components/BookFetcher";
import BookHistory from "../components/BookHistory";

export default function Home() {

  const handleBookSelect = (bookId: string) => {
    console.log("selected: ", bookId);
  };


  return (
  <main className="p-4">
      <h1 className="text-2xl font-bold">Project Gutenberg</h1>
      <BookFetcher />
      <BookHistory onSelect={handleBookSelect} />
    </main>
  );
}
