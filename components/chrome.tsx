import Link from "next/link";

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex min-w-0 items-baseline gap-2 no-underline">
      <span className="text-[22px] font-light tracking-tight text-ink-strong">觉镜</span>
      <span className="text-[13px] font-light tracking-[0.18em] text-ink/70">JueLens</span>
    </Link>
  );
}

export function SiteHeader({
  action,
}: {
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-4 py-5">
      <BrandMark />
      {action}
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] px-4 pb-16 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_80%_at_80%_0%,rgba(217,209,255,0.35),transparent_58%),radial-gradient(60%_70%_at_12%_8%,rgba(126,200,184,0.22),transparent_50%)]" />
      <div className="relative mx-auto w-full max-w-[1040px]">{children}</div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="max-w-[65ch] text-[13px] leading-relaxed text-ink/80">
      觉镜用于个案复盘与专业成长辅助，不能替代专业人工督导、心理诊断、医疗诊断或危机干预。复盘内容默认私密，仅保存在你的浏览器里。
    </p>
  );
}
