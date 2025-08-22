import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">IECC Diary App</h1>
      <p className="mb-4">
        A daily/hourly diary to answer 5 questions, track your progress, and
        analyze your sentiment.
      </p>
      <Link
        href="/sessions/new"
        className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700"
      >
        Go to Diary
      </Link>
    </div>
  );
}
