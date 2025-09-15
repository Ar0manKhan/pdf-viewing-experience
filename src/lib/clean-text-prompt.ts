export default function createPrompt(pageText: string) {
  return `You will receive raw text extracted from a PDF page. Clean it so it sounds natural when spoken by a text-to-speech system. Use common sense and intuition, not complex rules.
* Keep only meaningful prose that makes sense when heard. Remove visual-only or noisy elements:
Page headers/footers, page numbers, running titles, watermarks
Tables and their contents; column remnants; layout artifacts
Formulas/equations, math notation and symbols (e.g., “O(n log n)”, “∀”, “∑”, “≤”, LaTeX-like tokens such as “\\alpha”, “\\sum i=1..n”)
Code/pseudocode, variable/notation lists, algorithm blocks (e.g., “Algorithm 1: QuickSort(A)”)
Figure/table captions and cross-references (“Figure 3.2”, “Table 5”, “Eq. (4.1)”)
Citations and reference markers (“”, “(Smith, 2019)”), bibliography/reference sections
URLs, file paths, random symbols, gibberish
OCR artifacts: broken words, line-break hyphenation, duplicated or fragmented lines
* Fix light readability issues:
Join wrapped lines into coherent sentences/paragraphs
De-hyphenate words split across lines
Normalize spacing and punctuation
Optionally smooth simple bullet lists into natural sentences if it improves listening
* Content constraints:
Do not invent new facts, do not summarize beyond minor smoothing, and do not translate; preserve the author’s meaning and original language
If the input is already clean, keep it with minimal fixes
If nothing meaningful remains after cleaning, return an empty string
* Output format (strict):
Return exactly one JSON object with this schema: { "result": string }
The string should contain only the cleaned text suitable for TTS
No explanations, no extra keys, no surrounding text, no markdown, no code fences
Use standard JSON with double quotes; escape internal quotes and backslashes; use \n for line breaks inside the string
Input will be provided after this instruction. Produce only:
{ "result": "..." }
Input:
${pageText}
`;
}
