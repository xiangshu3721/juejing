"use client";

import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Disclaimer, PageShell, SiteHeader } from "@/components/chrome";
import { listReviews } from "@/lib/storage";
import type { SavedReview } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default function HomePage() {
  const [reviews, setReviews] = useState<SavedReview[] | null>(null);

  useEffect(() => {
    setReviews(listReviews());
  }, []);

  return (
    <PageShell>
      <SiteHeader />
      <section className="pt-6 sm:pt-10">
        <p className="text-[15px] font-light text-ink/80">AI 个案复盘与专业成长助手</p>
        <h1 className="mt-4 max-w-[16ch] text-[40px] font-extralight leading-[1.15] tracking-tight text-ink-strong sm:text-[56px]">
          看见来访者，也看见自己。
        </h1>
        <p className="mt-6 max-w-[42ch] text-[16px] font-light leading-relaxed text-ink">
          做完一次个案，不必一个人反复琢磨。把会谈内容交给觉镜。
        </p>
        <ul className="mt-8 max-w-[52ch] space-y-2 text-[16px] font-light leading-relaxed text-ink-strong">
          <li>TA 真正发生了什么</li>
          <li>你哪里做得很好</li>
          <li>还有什么值得继续探索</li>
          <li>下一次可以怎么做</li>
        </ul>
        <Link
          href="/new"
          className="mt-10 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-strong px-6 text-[15px] font-medium text-white transition active:scale-[0.98] sm:w-auto"
        >
          <Plus size={18} weight="bold" />
          开始一次复盘
        </Link>
      </section>

      <section className="mt-16 border-t border-rule/80 pt-8">
        <h2 className="text-[18px] font-light text-ink-strong">最近复盘</h2>
        {reviews === null ? (
          <div className="mt-6 space-y-3">
            <div className="h-20 rounded-[18px] bg-mist/80" />
            <div className="h-20 rounded-[18px] bg-mist/70" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-5 max-w-[50ch] text-[15px] font-light leading-relaxed text-ink">
            还没有复盘。完成一次会谈后，把转写稿或笔记贴进来，觉镜会帮你看这一次到底发生了什么。
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-rule/70">
            {reviews.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/review?id=${item.id}`}
                  className="group relative flex flex-col gap-1 py-5 no-underline sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="absolute left-0 top-5 hidden h-[calc(100%-2.5rem)] w-px fringe opacity-0 transition group-hover:opacity-100 sm:block" />
                  <span className="sm:pl-4">
                    <span className="block text-[17px] font-medium text-ink-strong">{item.caseName}</span>
                    <span className="mt-1 block max-w-[52ch] text-[14px] font-light leading-relaxed text-ink">
                      核心主题：{item.report.coreTheme || "未提炼主题"}
                    </span>
                  </span>
                  <span className="text-[13px] font-light text-ink/70 sm:pl-4">
                    {formatDate(item.createdAt)}
                    {item.sessionNumber ? `  第 ${item.sessionNumber} 次` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-16">
        <Disclaimer />
        <p className="mt-4 text-[13px] font-light text-ink/70">每一次个案，都是一次专业成长。</p>
      </footer>
    </PageShell>
  );
}
