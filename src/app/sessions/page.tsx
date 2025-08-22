"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSessions } from "@/lib/db";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  useEffect(() => {
    getSessions().then((all) => setSessions(all.slice(-5).reverse()));
  }, []);
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
        Your Inner Engineering Crash Course Diary
      </h1>
      <div className="mb-8 flex flex-col items-center gap-6">
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sessions/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition-colors text-center"
          >
            Start New Session
          </Link>
          <Link
            href="/sessions/sentiment"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded shadow transition-colors text-center"
          >
            View Sentiment
          </Link>
        </div>
      </div>
      <div className="w-full border-t border-gray-200 dark:border-gray-700 my-6"></div>
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
        Last 5 Sessions
      </h2>
      <ul className="space-y-3 mb-8">
        {sessions.map((s) => (
          <li
            key={s.id}
            className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 shadow-sm flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
          >
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {new Date(s.timestamp).toLocaleString()}
            </span>
            <Link
              href={`/sessions/${s.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow font-semibold transition-colors"
            >
              View/Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
