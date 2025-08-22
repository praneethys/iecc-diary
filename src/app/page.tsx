import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-700 dark:text-blue-300 text-center drop-shadow-lg">
          Inner Engineering Crash Course Diary
        </h1>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-200 text-center">
          A daily/hourly diary to answer 5 questions and reflect on your Inner
          Engineering journey.
        </p>
        <p className="mb-6 text-base text-gray-500 dark:text-gray-400 text-center italic">
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Data Privacy
          </span>{" "}
          is at the forefront. All your data is stored{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            locally
          </span>{" "}
          in your browser. None of your data is ever sent to any server.
        </p>
        <Link
          href="/sessions/new"
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 text-lg mt-2"
        >
          Start Your Diary
        </Link>
      </div>
    </div>
  );
}
