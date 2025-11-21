export enum DiffType {
  EQUAL = 0,
  INSERT = 1,
  DELETE = -1,
}

export interface DiffPart {
  type: DiffType;
  value: string;
}

export interface AnalysisResult {
  summary: string;
  toneChange: string;
  suggestions: string;
}

export interface TextStats {
  chars: number;
  words: number;
  lines: number;
}

export interface DiffOptions {
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  ignorePunctuation: boolean;
  ignoreNewlines: boolean;
}