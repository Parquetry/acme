export type Scale = 0 | 1 | 2 | 3;

export type MetricItem = {
  id: string;
  label: string;
  prompt: string;
};

export const PHQ9_ITEMS: MetricItem[] = [
  {
    id: "anhedonia",
    label: "Anhedonia",
    prompt: "Little interest or pleasure in activities?",
  },
  {
    id: "mood",
    label: "Mood",
    prompt: "Feeling down, depressed, or hopeless?",
  },
  {
    id: "sleep",
    label: "Sleep",
    prompt: "Difficulty sleeping or sleeping too much?",
  },
  {
    id: "energy",
    label: "Energy",
    prompt: "Feeling tired or low energy?",
  },
  {
    id: "appetite",
    label: "Appetite",
    prompt: "Poor appetite or overeating?",
  },
  {
    id: "selfWorth",
    label: "Self-worth",
    prompt: "Feeling bad about yourself or feeling like a failure?",
  },
  {
    id: "concentration",
    label: "Concentration",
    prompt: "Trouble concentrating on things, such as reading or watching TV?",
  },
  {
    id: "psychomotor",
    label: "Psychomotor",
    prompt: "Moving or speaking unusually slowly, or feeling restless and fidgety?",
  },
  {
    id: "selfHarm",
    label: "Self-harm thoughts",
    prompt: "Thoughts that you would be better off dead, or of hurting yourself?",
  },
];

export const GAD7_ITEMS: MetricItem[] = [
  {
    id: "nervousness",
    label: "Nervousness",
    prompt: "Feeling nervous, anxious, or on edge?",
  },
  {
    id: "worryControl",
    label: "Worry control",
    prompt: "Difficulty controlling or stopping worry?",
  },
  {
    id: "excessiveWorry",
    label: "Excessive worry",
    prompt: "Worrying too much about various things?",
  },
  {
    id: "relaxation",
    label: "Relaxation",
    prompt: "Hard to relax?",
  },
  {
    id: "restlessness",
    label: "Restlessness",
    prompt: "So restless it is hard to sit still?",
  },
  {
    id: "irritability",
    label: "Irritability",
    prompt: "Easily annoyed or irritable?",
  },
  {
    id: "dread",
    label: "Dread",
    prompt: "Feeling afraid that something awful might happen?",
  },
];

export const SCALE_LABELS: Record<Scale, string> = {
  0: "Not at all",
  1: "Slightly / brief period",
  2: "Moderate / half the day",
  3: "Severe / nearly all day",
};

export type Entry = {
  date: string;
  phq9: number[];
  gad7: number[];
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type Severity =
  | "Minimal"
  | "Mild"
  | "Moderate"
  | "Moderately severe"
  | "Severe";

export type ScoredEntry = Entry & {
  phq9Total: number;
  gad7Total: number;
  phq9Severity: Severity;
  gad7Severity: Severity;
};
