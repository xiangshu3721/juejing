"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Disclaimer, PageShell, SiteHeader } from "@/components/chrome";
import { hasField, hasMirror, hasPosition } from "@/lib/report";
import { getReview } from "@/lib/storage";
import type { Clue, FieldQuality, MirrorLog, PositionView, SavedReview, SchoolLens } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function Section({
  title,
  question,
  children,
  speculative,
}: {
  title: string;
  question: string;
  children: React.ReactNode;
  speculative?: boolean;
}) {
  return (
    <section
      className={`rounded-[18px] bg-sheet px-5 py-6 sm:px-7 sm:py-8 ${speculative ? "diffract" : "border border-rule/80"}`}
    >
      <h2 className="text-[22px] font-light tracking-tight text-ink-strong">{title}</h2>
      <p className="mt-2 text-[14px] font-light text-ink/80">{question}</p>
      <div className="mt-5 max-w-[65ch] text-[16px] font-light leading-[1.75] text-ink-strong">{children}</div>
    </section>
  );
}

function ClueList({ clues }: { clues: Clue[] }) {
  if (!clues.length) return <p>这次会谈里，还不足以稳定地标出三条线索。</p>;
  return (
    <ol className="space-y-5">
      {clues.map((clue, i) => (
        <li key={`${clue.title}-${i}`} className="grid grid-cols-[2rem_1fr] gap-x-2">
          <span className="pt-0.5 text-[13px] text-ink/70">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-medium">{clue.title}</p>
            <p className="mt-1">{clue.body}</p>
            {clue.certainty === "possible" ? (
              <p className="mt-2 text-[13px] text-violet">这是一种可能的理解，值得进一步探索。</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <SiteHeader />
          <div className="mt-10 h-40 rounded-[18px] bg-mist/80" />
        </PageShell>
      }
    >
      <ReviewBody />
    </Suspense>
  );
}

function ReviewBody() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [review, setReview] = useState<SavedReview | null | undefined>(undefined);

  useEffect(() => {
    setReview(id ? getReview(id) : null);
  }, [id]);

  if (review === undefined) {
    return (
      <PageShell>
        <SiteHeader />
        <div className="mt-10 h-40 rounded-[18px] bg-mist/80" />
      </PageShell>
    );
  }

  if (review === null) {
    return (
      <PageShell>
        <SiteHeader />
        <p className="pt-10 text-[16px] font-light">找不到这次复盘。它只保存在当前浏览器里。</p>
        <Link href="/" className="mt-6 inline-block text-[15px] text-ink-strong">
          返回首页
        </Link>
      </PageShell>
    );
  }

  const { report } = review;
  const hasGuess = report.clues.some((c) => c.certainty === "possible");

  return (
    <PageShell>
      <SiteHeader
        action={
          <Link href="/" className="text-[14px] font-light text-ink no-underline">
            返回首页
          </Link>
        }
      />
      <article className="mx-auto max-w-[760px] pb-10 pt-4">
        <p className="text-[13px] font-light text-ink/80">
          {formatDate(review.createdAt)}  第 {review.sessionNumber} 次会谈
        </p>
        <h1 className="mt-3 text-[34px] font-extralight tracking-tight text-ink-strong">{review.caseName}</h1>
        <p className="mt-3 max-w-[50ch] text-[16px] font-light leading-relaxed text-ink">
          核心主题：{report.coreTheme}
        </p>
        <p className="mt-4 text-[13px] font-light text-ink/80">本次复盘已自动保存在本机浏览器，不公开。</p>

        {review.focus ? (
          <p className="mt-6 max-w-[60ch] rounded-[18px] bg-mist/70 px-4 py-3 text-[14px] font-light leading-relaxed text-ink-strong">
            你想复盘的是：{review.focus}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-5">
          <Section title="看见来访者" question="这个来访者真正卡在哪里？">
            <p>{report.clientCore}</p>
            {hasPosition(report.positionView) ? (
              <PositionBlock view={report.positionView} />
            ) : null}
          </Section>

          <Section
            title="关键线索"
            question="本次最值得关注的点"
            speculative={hasGuess}
          >
            <ClueList clues={report.clues} />
          </Section>

          {hasMirror(report.mirrorLog) ? (
            <Section title="镜像过程" question="探索者主观 · 照见 · 反射 · 反馈 · 折射">
              <MirrorBlock log={report.mirrorLog} />
            </Section>
          ) : null}

          <Section title="看见自己" question="这次你做得好的地方">
            <PointList items={report.strengths} empty="这次还没有足够具体的对话，难以给出有依据的肯定。" />
          </Section>

          <Section title="可以改进的地方" question="你可能错过了什么？">
            <PointList items={report.improvements} empty="从现有材料看，还不宜给出改进判断。" />
          </Section>

          {hasField(report.fieldQuality) || report.schoolLenses.length || report.transpersonalNote ? (
            <Section
              title="超个人督导"
              question="空静爱的场域，以及各流派的一种理解"
              speculative={report.schoolLenses.some((x) => x.certainty === "possible")}
            >
              {hasField(report.fieldQuality) ? <FieldBlock field={report.fieldQuality} /> : null}
              {report.schoolLenses.length ? <LensList lenses={report.schoolLenses} /> : null}
              {report.transpersonalNote ? (
                <p className={report.schoolLenses.length || hasField(report.fieldQuality) ? "mt-6" : ""}>
                  {report.transpersonalNote}
                </p>
              ) : null}
            </Section>
          ) : null}

          <Section title="下一次怎么做" question="下一次最值得做的事，以及可以参考的问题">
            <p className="mb-4 font-medium">最值得做的事</p>
            <PointList items={report.nextActions} empty="还不足以给出下一次行动。" />
            <p className="mb-3 mt-8 font-medium">可以参考的问题</p>
            <ul className="space-y-3">
              {report.sampleQuestions.map((q) => (
                <li key={q} className="border-l border-violet/50 pl-4">
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] text-ink/80">问题仅供参考，不建议照稿执行。</p>
          </Section>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <p className="flex h-12 items-center justify-center rounded-full border border-rule bg-sheet px-6 text-[14px] text-ink">
            已保存
          </p>
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-full bg-ink-strong px-6 text-[15px] font-medium text-white no-underline"
          >
            返回首页
          </Link>
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </article>
    </PageShell>
  );
}

function PositionBlock({ view }: { view: PositionView }) {
  const rows: [string, string][] = [
    ["中 · 当下课题", view.center],
    ["上 · 可能的生命意义", view.above],
    ["下 · 底层驱动", view.below],
    ["左 · 内在 / 过去", view.left],
    ["右 · 外在 / 将面对", view.right],
  ];
  return (
    <dl className="mt-6 space-y-4 border-t border-rule/70 pt-5">
      {rows.filter(([, body]) => body).map(([label, body]) => (
        <div key={label}>
          <dt className="text-[13px] text-ink/70">{label}</dt>
          <dd className="mt-1">{body}</dd>
        </div>
      ))}
    </dl>
  );
}

function MirrorBlock({ log }: { log: MirrorLog }) {
  const rows: [string, string][] = [
    ["探索者 / 主观", log.explorerSubjective],
    ["镜像 / 咨询师照见", log.mirroring],
    ["反射 / 探索中", log.reflectionInProcess],
    ["探索者反馈", log.explorerResponse],
    ["折射 / 对咨询师的反射", log.refractionOnTherapist],
  ];
  return (
    <dl className="space-y-5">
      {rows.filter(([, body]) => body).map(([label, body]) => (
        <div key={label}>
          <dt className="text-[13px] text-ink/70">{label}</dt>
          <dd className="mt-1">{body}</dd>
        </div>
      ))}
    </dl>
  );
}

function FieldBlock({ field }: { field: FieldQuality }) {
  const rows: [string, string][] = [
    ["空", field.emptiness],
    ["静", field.stillness],
    ["爱", field.love],
  ];
  return (
    <dl className="space-y-4">
      {rows.filter(([, body]) => body).map(([label, body]) => (
        <div key={label}>
          <dt className="text-[13px] text-ink/70">{label}</dt>
          <dd className="mt-1">{body}</dd>
        </div>
      ))}
    </dl>
  );
}

function LensList({ lenses }: { lenses: SchoolLens[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {lenses.map((lens, i) => (
        <li key={`${lens.school}-${i}`} className="grid grid-cols-[2rem_1fr] gap-x-2">
          <span className="pt-0.5 text-[13px] text-ink/70">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-medium">{lens.school}</p>
            <p className="mt-1">{lens.reading}</p>
            {lens.certainty === "possible" ? (
              <p className="mt-2 text-[13px] text-violet">这是一种可能的理解，值得进一步探索。</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function PointList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p>{empty}</p>;
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[2rem_1fr] gap-x-2">
          <span className="pt-0.5 text-[13px] text-ink/70">{String(i + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}
