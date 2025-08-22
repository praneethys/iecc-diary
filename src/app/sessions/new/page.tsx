"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/app/const";
import { addSession } from "@/lib/db";
import { getSentiment } from "@/lib/sentiment";

export default function NewSession() {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleChange = (i: number, val: string) => {
    const newAns = [...answers];
    newAns[i] = val;
    setAnswers(newAns);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Create session object
    const id = crypto.randomUUID();
    const responses: any = {};

    await Promise.all(
      QUESTIONS.map(async (q, i) => {
        const sentiment = await getSentiment(answers[i]);
        responses[q] = {
          answer: answers[i],
          sentiment,
        };
      }),
    );

    const session = {
      id,
      timestamp: new Date().toISOString(),
      responses,
    };
    await addSession(session);
    setLoading(false);
    router.push("/sessions");
  };
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mt-10 relative">
      <div className="flex flex-col items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push("/sessions")}
          className="absolute top-6 left-8 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center"
          aria-label="Back to sessions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600 dark:text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
          New Diary Session
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {QUESTIONS.map((q, i) => (
          <div key={q} className="flex flex-col">
            <label className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-base" htmlFor={q}>
              {q}
            </label>
            <input
              id={q}
              type="textarea"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 p-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Your answer..."
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-colors"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
