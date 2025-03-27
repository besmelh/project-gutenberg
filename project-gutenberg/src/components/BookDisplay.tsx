
import React from "react";
import type { Book } from "../app/types";

export default function BookDisplay({ book }: { book: Book }) {
  return (

    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{book.metadata?.Title || "Untitled"}</h2>
        <p className="text-gray-600 italic">by {book.metadata?.Author || "Unknown"}</p>
      </div>


      {book.metadata && (
        <div>
          <h3 className="font-semibold">Metadata</h3>
          <ul className="list-disc pl-4 text-sm">
            {Object.entries(book.metadata).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>
      )}

    <h3 className="font-semibold">AI Analysis...</h3>
      {book.analysis && (
        <div className="bg-yellow-50 p-4 rounded border">
          <h3 className="font-semibold">AI Analysis</h3>
          <pre className="whitespace-pre-wrap text-sm">{book.analysis}</pre>
        </div>
      )}

      {book.text && (
        <div className="bg-gray-100 p-4 max-h-96 overflow-y-auto border">
          <h3 className="font-semibold mb-2">Content</h3>
          <pre className="whitespace-pre-wrap text-sm">{book.text}</pre>
        </div>
      )}

    </div>
  );
}
