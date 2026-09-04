"use client";

import { useReducedMotion } from "motion/react";

export function FormingWait({
  label,
  detail = "正在从会谈文字里分辨事实与可能的理解。",
}: {
  label: string;
  detail?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="sheet diffract relative overflow-hidden rounded-[18px] px-6 py-16 text-center sm:px-10">
      <p className="text-[15px] font-light text-ink-strong">{label}</p>
      <p className="mt-3 text-[13px] text-ink/80">{detail}</p>
      <div className="mx-auto mt-10 h-px w-full max-w-md overflow-hidden rounded-full bg-mist">
        <div
          className="h-full w-1/2 fringe"
          style={
            reduce
              ? undefined
              : { animation: "form 1.6s ease-in-out infinite" }
          }
        />
      </div>
      <style>{`
        @keyframes form {
          0% { transform: translateX(-80%); opacity: .45; }
          50% { transform: translateX(80%); opacity: 1; }
          100% { transform: translateX(180%); opacity: .45; }
        }
      `}</style>
    </div>
  );
}
