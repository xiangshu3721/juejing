"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Disclaimer, PageShell, SiteHeader } from "@/components/chrome";
import { FormingWait } from "@/components/forming-wait";
import { extractTextFromFile } from "@/lib/parse-file";
import { normalizeReport } from "@/lib/report";
import { newReviewId, nextCaseName, saveReview } from "@/lib/storage";
import { reviewApiUrl } from "@/lib/urls";

function reviewFailureMessage(err: unknown) {
  if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "SecurityError")) {
    return "本机存储不可用";
  }
  if (
    err instanceof DOMException &&
    (err.name === "AbortError" || err.name === "TimeoutError")
  ) {
    return "网络连不上复盘服务";
  }
  if (err instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(err.message)) {
    return "网络连不上复盘服务";
  }
  if (err instanceof Error && err.message) return err.message;
  return "服务返回异常";
}

export default function NewReviewPage() {
  const router = useRouter();
  const [caseName, setCaseName] = useState("个案 001");
  const [sessionNumber, setSessionNumber] = useState(1);
  const [transcript, setTranscript] = useState("");
  const [focus, setFocus] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"parse" | "review" | null>(null);

  useEffect(() => {
    setCaseName(nextCaseName());
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy("parse");
    try {
      const text = await extractTextFromFile(file);
      if (!text) throw new Error("没有从文件里读到文字。");
      setTranscript((prev) => (prev ? `${prev.trim()}\n\n${text}` : text));
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "文件读取失败。");
    } finally {
      setBusy(null);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const name = caseName.trim() || nextCaseName();
    const body = transcript.trim();
    if (body.length < 40) {
      setError("请粘贴或上传足够的会谈内容，至少大约几段对话或笔记。");
      return;
    }
    setError("");
    setBusy("review");
    try {
      const signal =
        typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(70_000)
          : undefined;
      const res = await fetch(reviewApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseName: name,
          sessionNumber,
          transcript: body,
          focus: focus.trim(),
        }),
        signal,
      });
      const raw = await res.text();
      let payload: { report?: unknown; error?: string };
      try {
        payload = raw ? (JSON.parse(raw) as { report?: unknown; error?: string }) : {};
      } catch {
        throw new Error("服务返回异常");
      }
      if (!res.ok || payload.report == null) {
        throw new Error(payload.error || "服务返回异常");
      }
      const report = normalizeReport(payload.report);
      let saved;
      try {
        saved = saveReview({
          id: newReviewId(),
          caseName: name,
          sessionNumber,
          focus: focus.trim(),
          transcript: body,
          createdAt: new Date().toISOString(),
          report,
        });
      } catch (err) {
        // QuotaExceededError and private-mode SecurityError both land here.
        if (err instanceof DOMException && err.name !== "QuotaExceededError" && err.name !== "SecurityError") {
          throw err;
        }
        throw new Error("本机存储不可用");
      }
      // Pages export uses trailingSlash, so the query sits after the slash.
      await router.push(`/review/?id=${encodeURIComponent(saved.id)}`);
    } catch (err) {
      setError(reviewFailureMessage(err));
      setBusy(null);
    }
  }

  if (busy === "review") {
    return (
      <PageShell>
        <SiteHeader />
        <div className="pt-10">
          <FormingWait label="光谱边缘正在形成" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SiteHeader
        action={
          <Link href="/" className="text-[14px] font-light text-ink no-underline">
            返回首页
          </Link>
        }
      />
      <form onSubmit={onSubmit} className="mx-auto max-w-[760px] pb-8 pt-4">
        <h1 className="text-[32px] font-extralight tracking-tight text-ink-strong">新建复盘</h1>
        <p className="mt-3 max-w-[60ch] text-[14px] font-light leading-relaxed text-ink">
          请使用昵称或代号，避免上传姓名、手机号、身份证、详细地址等可识别身份的信息。
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[13px] text-ink-strong">个案名称</span>
            <input
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              className="h-12 w-full rounded-[18px] border border-rule bg-sheet px-4 text-[15px] text-ink-strong"
            />
            <span className="mt-2 block text-[13px] font-light text-ink/80">
              建议使用昵称或代号，不填写真实姓名。
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-[13px] text-ink-strong">第几次会谈</span>
            <select
              value={sessionNumber}
              onChange={(e) => setSessionNumber(Number(e.target.value))}
              className="h-12 w-full rounded-[18px] border border-rule bg-sheet px-4 text-[15px] text-ink-strong"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  第 {n} 次
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-8 block">
          <span className="mb-2 block text-[13px] text-ink-strong">会谈内容</span>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={14}
            placeholder="粘贴本次会谈转写稿、聊天记录或个案笔记。"
            className="w-full resize-y rounded-[18px] border border-rule bg-sheet px-4 py-3 text-[15px] leading-relaxed text-ink-strong placeholder:text-ink/50"
          />
        </label>

        <label className="mt-4 flex cursor-pointer flex-col gap-1 rounded-[18px] border border-dashed border-rule bg-mist/40 px-4 py-4">
          <span className="text-[13px] text-ink-strong">上传文本文件</span>
          <span className="text-[13px] font-light text-ink/80">
            支持 TXT、DOCX、PDF。
            {fileName ? `已读入：${fileName}` : busy === "parse" ? "正在读取文件…" : "尚未选择文件"}
          </span>
          <input
            type="file"
            accept=".txt,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              e.target.value = "";
              onFile(picked);
            }}
          />
        </label>

        <label className="mt-8 block">
          <span className="mb-2 block text-[13px] text-ink-strong">这次个案，你最想复盘什么？（可选）</span>
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="例如：我感觉自己一直在给建议，不知道这样对不对。"
            className="h-12 w-full rounded-[18px] border border-rule bg-sheet px-4 text-[15px] text-ink-strong placeholder:text-ink/50"
          />
        </label>

        {error ? (
          <p className="mt-5 text-[14px] text-[#9a4a58]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy !== null}
          className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-ink-strong text-[15px] font-medium text-white transition active:scale-[0.98] disabled:opacity-50 sm:w-auto sm:px-8"
        >
          开始 AI 复盘
        </button>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </form>
    </PageShell>
  );
}
