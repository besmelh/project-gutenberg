import BookFetcher from "./components/BookFetcher";


export default function Home() {
  return (
  <main className="p-4">
      <h1 className="text-2xl font-bold">Project Gutenberg</h1>
      <BookFetcher />
    </main>
  );
}
