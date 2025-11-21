import { DiffType, DiffPart, TextStats, DiffOptions } from '../types';

/**
 * A simplified implementation of the Myers diff algorithm or similar logic 
 * to handle character/word diffing without heavy external dependencies.
 */

// Helper to tokenize text. 
// For CJK (Chinese/Japanese/Korean) characters, we treat each char as a token.
// For Latin text, we can treat words as tokens, but for this specific "Text Truth Mirror"
// precise character/sub-word diffing (like the screenshot) is often preferred.
const tokenize = (text: string): string[] => {
  // Refined regex: Matches CJK chars OR sequences of non-whitespace OR whitespace OR punctuation
  // This ensures we capture everything as distinct tokens for reconstruction
  const regex = /([\u4e00-\u9fa5]|[a-zA-Z0-9_]+|\s+|[^\s\w\u4e00-\u9fa5]+)/g;
  const tokens = text.match(regex) || [];
  return tokens;
};

const isTokenEqual = (t1: string, t2: string, options: DiffOptions): boolean => {
  let s1 = t1;
  let s2 = t2;

  if (options.ignoreNewlines) {
    s1 = s1.replace(/\n/g, '');
    s2 = s2.replace(/\n/g, '');
    if (s1 === '' && s2 === '') return true; // Both became empty (were just newlines)
  }

  if (options.ignoreWhitespace) {
    s1 = s1.trim();
    s2 = s2.trim();
    if (s1 === '' && s2 === '') return true; // Both became empty (were just whitespace)
  }

  if (options.ignorePunctuation) {
     // Remove common punctuation
     const puncRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()"'?。，、；：？！…—·ˉˇ¨‘’“”]/g;
     s1 = s1.replace(puncRegex, '');
     s2 = s2.replace(puncRegex, '');
     if (s1 === '' && s2 === '') return true;
  }

  if (options.ignoreCase) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }

  return s1 === s2;
};

export const calculateDiff = (text1: string, text2: string, options: DiffOptions): DiffPart[] => {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  const m = tokens1.length;
  const n = tokens2.length;
  
  // dp[i][j] stores the length of LCS
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (isTokenEqual(tokens1[i - 1], tokens2[j - 1], options)) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  let i = m;
  let j = n;
  const parts: DiffPart[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && isTokenEqual(tokens1[i - 1], tokens2[j - 1], options)) {
      // If considered equal by options, use the modified version (newest) for display
      // but mark as EQUAL.
      parts.unshift({ type: DiffType.EQUAL, value: tokens2[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      parts.unshift({ type: DiffType.INSERT, value: tokens2[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      parts.unshift({ type: DiffType.DELETE, value: tokens1[i - 1] });
      i--;
    }
  }

  // Optimization: Merge adjacent identical types to reduce DOM nodes
  if (parts.length === 0) return [];

  const merged: DiffPart[] = [parts[0]];
  for (let k = 1; k < parts.length; k++) {
    if (parts[k].type === merged[merged.length - 1].type) {
      merged[merged.length - 1].value += parts[k].value;
    } else {
      merged.push(parts[k]);
    }
  }

  return merged;
};

export const calculateSimilarity = (text1: string, text2: string): number => {
  if (!text1 && !text2) return 100;
  if (!text1 || !text2) return 0;

  const longer = text1.length > text2.length ? text1 : text2;
  const shorter = text1.length > text2.length ? text2 : text1;
  
  if (longer.length === 0) return 100;

  const distance = levenshteinDistance(longer, shorter);
  return Math.round(((longer.length - distance) / longer.length) * 100);
};

const levenshteinDistance = (s: string, t: string): number => {
  // Optimization for very long strings to avoid browser hang could go here
  // For now, standard implementation
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  
  // Use two rows instead of full matrix to save memory
  let prevRow = Array.from({ length: s.length + 1 }, (_, i) => i);
  let currentRow = new Array(s.length + 1);

  for (let i = 1; i <= t.length; i++) {
    currentRow[0] = i;
    for (let j = 1; j <= s.length; j++) {
      const cost = s[j - 1] === t[i - 1] ? 0 : 1;
      currentRow[j] = Math.min(
        currentRow[j - 1] + 1,    // insertion
        prevRow[j] + 1,           // deletion
        prevRow[j - 1] + cost     // substitution
      );
    }
    // Swap rows
    [prevRow, currentRow] = [currentRow, prevRow];
  }
  
  return prevRow[s.length];
};

export const getStats = (text: string): TextStats => {
  return {
    chars: text.length,
    words: text.trim().split(/\s+/).filter(Boolean).length,
    lines: text.split('\n').length,
  };
};