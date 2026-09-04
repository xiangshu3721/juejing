export type Clue = {
  title: string;
  body: string;
  certainty: "observed" | "possible";
};

export type SchoolLens = {
  school: string;
  reading: string;
  certainty: "observed" | "possible";
};

export type PositionView = {
  center: string;
  above: string;
  below: string;
  left: string;
  right: string;
};

export type MirrorLog = {
  explorerSubjective: string;
  mirroring: string;
  reflectionInProcess: string;
  explorerResponse: string;
  refractionOnTherapist: string;
};

export type FieldQuality = {
  emptiness: string;
  stillness: string;
  love: string;
};

export type ReviewReport = {
  coreTheme: string;
  clientCore: string;
  clues: Clue[];
  strengths: string[];
  improvements: string[];
  nextActions: string[];
  sampleQuestions: string[];
  positionView: PositionView;
  mirrorLog: MirrorLog;
  fieldQuality: FieldQuality;
  schoolLenses: SchoolLens[];
  transpersonalNote: string;
};

export type SavedReview = {
  id: string;
  caseName: string;
  sessionNumber: number;
  focus: string;
  transcript: string;
  createdAt: string;
  report: ReviewReport;
};

export type ReviewRequest = {
  caseName: string;
  sessionNumber: number;
  transcript: string;
  focus: string;
};
