import type {
  FieldQuality,
  MirrorLog,
  PositionView,
  ReviewReport,
  SchoolLens,
} from "./types";

export function emptyReport(): ReviewReport {
  return {
    coreTheme: "",
    clientCore: "",
    clues: [],
    strengths: [],
    improvements: [],
    nextActions: [],
    sampleQuestions: [],
    positionView: emptyPosition(),
    mirrorLog: emptyMirror(),
    fieldQuality: emptyField(),
    schoolLenses: [],
    transpersonalNote: "",
  };
}

export function normalizeReport(raw: unknown): ReviewReport {
  if (!raw || typeof raw !== "object") {
    throw new Error("模型返回格式无效。");
  }
  const data = raw as Record<string, unknown>;
  const clues = Array.isArray(data.clues)
    ? data.clues.slice(0, 3).map((item) => {
        const clue = (item ?? {}) as Record<string, unknown>;
        return {
          title: String(clue.title ?? "").trim(),
          body: String(clue.body ?? "").trim(),
          certainty: clue.certainty === "possible" ? "possible" as const : "observed" as const,
        };
      }).filter((c) => c.title || c.body)
    : [];

  return {
    coreTheme: String(data.coreTheme ?? "").trim(),
    clientCore: String(data.clientCore ?? "").trim(),
    clues,
    strengths: stringList(data.strengths, 3),
    improvements: stringList(data.improvements, 3),
    nextActions: stringList(data.nextActions, 3),
    sampleQuestions: stringList(data.sampleQuestions, 3),
    positionView: asPosition(data.positionView),
    mirrorLog: asMirror(data.mirrorLog),
    fieldQuality: asField(data.fieldQuality),
    schoolLenses: asLenses(data.schoolLenses),
    transpersonalNote: String(data.transpersonalNote ?? "").trim(),
  };
}

function emptyPosition(): PositionView {
  return { center: "", above: "", below: "", left: "", right: "" };
}

function emptyMirror(): MirrorLog {
  return {
    explorerSubjective: "",
    mirroring: "",
    reflectionInProcess: "",
    explorerResponse: "",
    refractionOnTherapist: "",
  };
}

function emptyField(): FieldQuality {
  return { emptiness: "", stillness: "", love: "" };
}

function asPosition(value: unknown): PositionView {
  const o = (value ?? {}) as Record<string, unknown>;
  return {
    center: String(o.center ?? "").trim(),
    above: String(o.above ?? "").trim(),
    below: String(o.below ?? "").trim(),
    left: String(o.left ?? "").trim(),
    right: String(o.right ?? "").trim(),
  };
}

function asMirror(value: unknown): MirrorLog {
  const o = (value ?? {}) as Record<string, unknown>;
  return {
    explorerSubjective: String(o.explorerSubjective ?? "").trim(),
    mirroring: String(o.mirroring ?? "").trim(),
    reflectionInProcess: String(o.reflectionInProcess ?? "").trim(),
    explorerResponse: String(o.explorerResponse ?? "").trim(),
    refractionOnTherapist: String(o.refractionOnTherapist ?? "").trim(),
  };
}

function asField(value: unknown): FieldQuality {
  const o = (value ?? {}) as Record<string, unknown>;
  return {
    emptiness: String(o.emptiness ?? "").trim(),
    stillness: String(o.stillness ?? "").trim(),
    love: String(o.love ?? "").trim(),
  };
}

function asLenses(value: unknown): SchoolLens[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 3).map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      school: String(o.school ?? "").trim(),
      reading: String(o.reading ?? "").trim(),
      certainty: o.certainty === "observed" ? "observed" as const : "possible" as const,
    };
  }).filter((x) => x.school || x.reading);
}

function stringList(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? "").trim()).filter(Boolean).slice(0, max);
}

export function hasPosition(view: PositionView) {
  return Boolean(view.center || view.above || view.below || view.left || view.right);
}

export function hasMirror(log: MirrorLog) {
  return Object.values(log).some(Boolean);
}

export function hasField(field: FieldQuality) {
  return Object.values(field).some(Boolean);
}
