import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { QUESTIONS } from "@/app/const";

const DATA_FILE = path.join(process.cwd(), "sessions.json");

function loadSessions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

export async function GET() {
  const sessions = loadSessions().slice(-30); // last 30 sessions
  // For each question, collect all sentiment scores
  const avgScores: number[] = QUESTIONS.map((q) => {
    let scores: number[] = [];
    sessions.forEach((session: any) => {
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
  return NextResponse.json({ avgScores });
}
