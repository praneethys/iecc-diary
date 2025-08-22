"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/app/const";
import { useRouter } from "next/navigation";
import { getSessions } from "@/lib/db";

export default function SentimentPage() {
  const router = useRouter();
  const [sentiment, setSentiment] = useState<any>(null);
  useEffect(() => {
    getSessions().then((all) => {
      const last30 = all.slice(-30);
      const avgScores = QUESTIONS.map((q) => {
        let scores: number[] = [];
        last30.forEach((session: any) => {
          const resp = session.responses?.[q];
          if (resp && Array.isArray(resp.sentiment)) {
            resp.sentiment.forEach((s: any) => {
              if (s.label === "POSITIVE") scores.push(s.score);
              else if (s.label === "NEGATIVE") scores.push(-Math.abs(s.score));
            });
          }
        });
        return scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;
      });
      setSentiment({ avgScores });
    });
  }, []);
  if (!sentiment)
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
        <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
          Sentiment Analysis
        </h1>
      </div>
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">
        Last 30 Sessions (Average Sentiment Score)
      </h2>
      <ul className="space-y-4">
        {QUESTIONS.map((q, i) => {
          const score = sentiment.avgScores[i];
          let color = "text-gray-700";
          let bg = "bg-gray-100 dark:bg-gray-800";
          let label = "Neutral";
          if (score > 0.1) {
            color = "text-green-700 dark:text-green-400";
            bg = "bg-green-50 dark:bg-green-900";
            label = "Positive";
          }
          if (score < -0.1) {
            color = "text-red-700 dark:text-red-400";
            bg = "bg-red-50 dark:bg-red-900";
            label = "Negative";
          }
          return (
            <li
              key={i}
              className={`rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between ${bg}`}
            >
              <span className="font-medium text-base mb-2 sm:mb-0 sm:text-lg text-gray-900 dark:text-gray-100">
                {q}
              </span>
              <span
                className={`font-semibold text-lg px-3 py-1 rounded-full ${color} bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 ml-0 sm:ml-4`}
              >
                {label}{" "}
                <span className="text-xs text-gray-500">
                  ({score.toFixed(2)})
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
