import { NextResponse } from "next/server";
import { pipeline, TextClassificationOutput } from "@huggingface/transformers";
import { QUESTIONS } from "@/app/const";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "sessions.json");

function loadSessions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveSessions(sessions: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getSentiment(answer: string) {
  const sentimentPipeline = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    { dtype: "fp32" },
  );
  return await sentimentPipeline(answer);
}

export async function GET() {
  const sessions = loadSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const body = await req.json();
  const sessions = loadSessions();
  const id = uuidv4();
  const responses: any = {};
  const session = {
    id,
    timestamp: new Date().toISOString(),
    responses: {},
  };

  await Promise.all(
    QUESTIONS.map(async (q, i) => {
      const sentiment = await getSentiment(body.answers[i]);
      responses[q] = {
        answer: body.answers[i],
        sentiment,
      };
    }),
  );

  console.log("Responses with sentiment:", responses);
  session.responses = responses;

  sessions.push(session);
  saveSessions(sessions);

  return NextResponse.json({ session });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const sessions = loadSessions();
  const idx = sessions.findIndex((s: any) => s.id === body.id);
  if (idx === -1)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  // Update responses
  await Promise.all(
    QUESTIONS.map(async (q, i) => {
      const sentiment = await getSentiment(body.answers[i]);
      sessions[idx].responses[q] = {
        answer: body.answers[i],
        sentiment,
      };
    }),
  );

  saveSessions(sessions);
  return NextResponse.json({ session: sessions[idx] });
}

export async function DELETE(req: Request) {
  console.log("DELETE request received: ", JSON.stringify(req));
  const body = await req.json();
  const sessions = loadSessions();
  const idx = sessions.findIndex((s: any) => s.id === body.id);
  if (idx === -1)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  sessions.splice(idx, 1);
  saveSessions(sessions);
  return NextResponse.json({ success: true });
}

export { QUESTIONS };
