"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { QUESTIONS } from "@/app/const";

export default function SessionDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [session, setSession] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((d) => {
        const s = d.sessions.find((x: any) => x.id == id);
        if (s) {
          setSession(s);
          // Convert responses object to answers array
          const ansArr = QUESTIONS.map((q) => s.responses[q]?.answer || "");
          setAnswers(ansArr);
        }
      });
  }, [id]);

  const handleChange = (i: number, val: string) => {
    const newAns = [...answers];
    newAns[i] = val;
    setAnswers(newAns);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/sessions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, answers }),
    });
    setTimeout(() => setLoading(false), 1000);
    router.refresh();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    setDeleteLoading(true);
    await fetch("/api/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id }),
    });
    setTimeout(() => setDeleteLoading(false), 1000);
    router.push("/sessions");
  };

  if (!session)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500 text-lg">Loading...</div>
      </div>
    );

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
        <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300 text-center">
          Session {new Date(session.timestamp).toLocaleString()}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {QUESTIONS.map((q, i) => (
          <div key={q} className="flex flex-col">
            <label className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-base">
              {q}
            </label>
            <textarea
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              rows={3}
              className="rounded-lg border border-gray-300 dark:border-gray-700 p-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Your answer..."
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-colors flex items-center justify-center relative ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Updating...
            </span>
          ) : (
            "Update"
          )}
        </button>
      </form>
      <form className="space-y-6 mt-4" onSubmit={handleDelete}>
        <button
          type="submit"
          disabled={deleteLoading}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg shadow transition-colors"
        >
          {deleteLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </button>
      </form>
    </div>
  );
}
