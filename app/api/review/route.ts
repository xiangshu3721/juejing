import { NextResponse } from "next/server";
import { getLlmConfig } from "@/lib/llm";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { clientKey, takeReviewSlot } from "@/lib/rate-limit";
import { normalizeReport } from "@/lib/report";
import type { ReviewRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(request: Request) {
  const { apiKey, baseUrl, model } = getLlmConfig();

  if (!apiKey) {
    return withCors(
      NextResponse.json(
        { error: "尚未配置 DEEPSEEK_API_KEY。本地请写在 .env.local，上线请写在托管平台的环境变量里。" },
        { status: 500 },
      ),
    );
  }

  const slot = takeReviewSlot(clientKey(request));
  if (!slot.ok) {
    return withCors(
      NextResponse.json(
        { error: `调用过于频繁，请约 ${slot.retryMinutes} 分钟后再试。` },
        { status: 429 },
      ),
    );
  }

  let input: ReviewRequest;
  try {
    input = (await request.json()) as ReviewRequest;
  } catch {
    return withCors(NextResponse.json({ error: "请求无法解析。" }, { status: 400 }));
  }

  if (!input?.transcript || input.transcript.trim().length < 40) {
    return withCors(NextResponse.json({ error: "会谈内容过短。" }, { status: 400 }));
  }

  const payload = {
    model,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(input) },
    ],
  };

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return withCors(
      NextResponse.json({ error: "无法连接到 DeepSeek，请检查网络或 DEEPSEEK_BASE_URL。" }, { status: 502 }),
    );
  }

  const raw = await upstream.text();
  if (!upstream.ok) {
    return withCors(
      NextResponse.json(
        { error: `DeepSeek 返回 ${upstream.status}。请检查 Key 与模型名。` },
        { status: 502 },
      ),
    );
  }

  try {
    const completion = JSON.parse(raw) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return withCors(NextResponse.json({ error: "模型没有返回内容。" }, { status: 502 }));
    }
    const report = normalizeReport(JSON.parse(content));
    if (!report.clientCore) {
      return withCors(NextResponse.json({ error: "模型没有生成完整复盘。" }, { status: 502 }));
    }
    return withCors(NextResponse.json({ report }));
  } catch {
    return withCors(NextResponse.json({ error: "模型输出无法整理成复盘报告。" }, { status: 502 }));
  }
}
