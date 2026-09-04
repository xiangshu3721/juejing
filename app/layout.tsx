import type { Metadata } from "next";
import { Noto_Sans_SC, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-noto",
  display: "swap",
});

const source = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  title: "觉镜 JueLens",
  description: "AI 个案复盘与专业成长助手。看见来访者，也看见自己。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${noto.variable} ${source.variable} font-sans antialiased`}>
        {/*
          THESIS: A session review is an observation of a forming edge: facts stay in slate on white, guesses live only in a mint-rose-violet fringe. Refuses cream-wellness SaaS cards and chat-with-AI chrome.
          OWN-WORLD: Cloud white field, mist wells, slate ink, hairline iridescent diffraction; thin humanist sans; pill actions; color never fills a region, only the edge.
          STORY: After one session the therapist pastes notes, watches a fringe form, and reads five precise observations they can take into the next hour.
          FIRST VIEWPORT: Centered sheet on cloud ground, running wordmark left, full-width Start on mobile, manifesto in light display, recent observations listed below with date and theme.
          FORM: Iridescent cloud edge. Seed 09db270e. Challenger clouds-storms-auroras-iridescent-cloud-edge.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
