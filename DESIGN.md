---
name: 觉镜 JueLens
description: Session review as a forming cloud edge: facts in slate, guesses only on the fringe.
colors:
  cloud: "#f7f7f8"
  mist: "#eef1f4"
  sheet: "#ffffff"
  ink: "#5b6570"
  ink-strong: "#3d4550"
  rule: "#d5dbe2"
  mint: "#7ec8b8"
  rose: "#d9a7b8"
  violet: "#8b7bb8"
typography:
  display:
    fontFamily: "Noto Sans SC, Source Sans 3, ui-sans-serif, sans-serif"
    fontSize: "40px"
    fontWeight: 200
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Noto Sans SC, Source Sans 3, ui-sans-serif, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.75
    letterSpacing: "normal"
rounded:
  sheet: "18px"
  pill: "999px"
spacing:
  page: "24px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 24px"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.sheet}"
---

## Overview

Operate-mode product UI for post-session review. The surface is a cloud-white field. Color is confined to a mint-rose-violet hairline (the diffraction fringe) that marks speculation, generating, and focus. Body copy stays slate. Never fill regions with pastel.

World: iridescent cloud edge (seed 09db270e). Code-led build.

## Colors

Cloud `#f7f7f8` is the page. Sheets are white. Ink `#5b6570` is body; `#3d4550` is headings and primary buttons. Mint, rose, and violet appear together as a 1px fringe or as a short “possible reading” caption. Do not use one of those hues as a fill, badge, or hero gradient.

## Typography

One family: Noto Sans SC with Source Sans 3 as Latin companion. Display is extralight. Body is light, measure about 65ch. UI labels are 13px. No serif, no mono costume, no uppercase eyebrows.

## Layout

Max content width 1040px. Home manifesto left-aligned. Forms and reports cap around 760px. Below 768px everything stacks; primary actions go full width. Desktop and phone share one column.

## Elevation & Depth

Sheets use a large, tinted, offset shadow, never a glow halo. Generating and speculative blocks add the iridescent 1px edge. History rows are divided by hairlines, not cards.

## Shapes

18px on sheets and fields. Full pill on primary actions only.

## Components

Primary button: ink-strong pill, white label, 48px tall. Secondary is a text link or outlined pill (“已保存”). Inputs: 18px radius, rule border, labels above. Report sections: white sheets; speculative clue groups get the fringe. Wait state: centered sheet, moving fringe bar, copy about facts versus possible readings.

## Do's and Don'ts

Do keep guesses visually on the edge, not in colored body text.
Do cite session language in strengths and misses.
Don't diagnose, don't use wellness cream palettes, don't add export/share chrome.
Don't turn the five report questions into a dashboard or equal icon cards.
