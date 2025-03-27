
import React, { useState, useEffect } from "react";
import type { Book } from "../app/types";


type Props = {
    book: Book;
    onUpdate?: (updatedBook: Book) => void;
  };

  
export default function BookDisplay({ book, onUpdate }: Props) {
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");
    const [showBookText, setShowBookText] = useState(false); // to delay when dense content appears - prevent delays

    useEffect(() => {
      if (book.text) {
        const timeout = setTimeout(() => setShowBookText(true), 320); // wait for panel to open
        return () => clearTimeout(timeout);
      }
    }, [book.text]);

    const handleAnalyze = async () => {
        setAnalyzing(true);      
        const baseUrl = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_BASE : "";
    
    
        try {
          console.log("fetching analysis for metadata:", book.metadata);
          const response = await fetch(`${baseUrl}/.netlify/functions/analyze-book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookMetadata: book.metadata,
            })
          });
      
          const data = await response.json();
          const updatedBook = { ...book, analysis: data.analysis || "No analysis returned." };

          console.log("analysis...", data.analysis)

        // Save updated book to localStorage
        // not using the function that passes in book cause its asyncronus and may not reflect newly fetched analysis
        const existing: Book[] = JSON.parse(localStorage.getItem("gutenbergBooks") || "[]");
        const updated = [updatedBook, ...existing.filter(b => b.id !== book.id)];
        localStorage.setItem("gutenbergBooks", JSON.stringify(updated));


        // send notification about update
        onUpdate?.(updatedBook);

        } catch (err : unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Something went wrong while fetching the book metadata.");
          }    
        } finally {
          setAnalyzing(false);
        }
    
      };

  return (

    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{book.metadata?.Title || "Untitled"}</h2>
        <p className="text-gray-600 italic">by {book.metadata?.Author || "Unknown"}</p>
      </div>


      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        {/* Metadata box */}

        {book.metadata && (
        // <div>
        //   <h3 className="font-semibold">Metadata</h3>
        //   <ul className="list-disc pl-4 text-sm">
        //     {Object.entries(book.metadata).map(([key, value]) => (
        //       <li key={key}><strong>{key}:</strong> {value}</li>
        //     ))}
        //   </ul>
        // </div>

        <div className="flex-1 bg-accent-white border p-4 rounded shadow-sm">
        <h3 className="font-semibold text-2xl mb-8">📚 Metadata</h3>
        <ul className="text-sm space-y-2.5 opacity-70">
          {Object.entries(book.metadata).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </li>
          ))}
        </ul>
        </div>
      )}



      {/* AI Analysis box */}
      <div className="flex-1 bg-accent-white border p-4 rounded shadow-sm relative">
        <div className="flex justify-between items-start mb-8">
          <h3 className="font-semibold text-2xl">🤖 AI Analysis</h3>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : book.analysis ? "Re-Analyze" : "Analyze Book"}
          </button>
        </div>

        {book.analysis ? (
          <div className="text-sm space-y-2 whitespace-pre-wrap">
          {typeof book.analysis === "object" ? (
            <ul className="list-disc pl-4 text-sm space-y-1">
              {/* {Object.entries(book.analysis).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))} */}
            </ul>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{book.analysis}</pre>
          )}          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No analysis yet.</p>
        )}
      </div>
    </div>


      {error && <p className="text-red-500 text-sm">{error}</p>}

      {showBookText ? (
        book.text && (
            <div className="bg-accent-white text-foreground p-4 max-h-150 overflow-y-auto border flex flex-col items-center">
              <pre className="whitespace-pre-wrap text-sm">{book.text}</pre>
            </div>
          )
        // <div className="bg-gray-100 p-4 max-h-96 overflow-y-auto border">
        //     <h3 className="font-semibold mb-2">Content</h3>
        //     <pre className="whitespace-pre-wrap text-sm">{book.text}</pre>
        // </div>
        ) : (
        <p className="text-sm bg-accent-white text-foreground italic">Loading book text...</p>
        )}
      

    </div>
  );
}
