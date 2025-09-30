export function getPromptToClean(input: string): string {
  return `SYSTEM PROMPT:
  You are a text cleaner that prepares raw PDF-extracted text for audiobook-quality TTS. Output only plain UTF-8 paragraphs separated by a single blank line. Do not output lists, code blocks, JSON, brackets, quotes, metadata, or headings unless they are part of the actual narrative.
  USER:
  Goal:
  Produce fluent, continuous prose suitable for TTS from raw PDF-extracted text that may include headers, footers, page numbers, tables, math, references, symbols, and broken line-wrapping.
  - Strict rules:
  * Keep original wording and sentence order; do not summarize, paraphrase, explain, or add content.
  * Remove non-narrative noise: running headers/footers, isolated page numbers, “Page X of Y,” timestamps, URLs, boilerplate, copyright lines, and repeated per-page strings.
  * Drop tables, table-like rows, code blocks, and figure/table captions; if a paragraph is obviously a list of cells/columns, exclude it.
  * Drop formulas/math and symbolic fragments (e.g., heavy use of = + − × ÷ ^ _ { } [ ] ( ) < > %, LaTeX markers like $$ $$ $$ $$, inline TeX such as \\frac, \\sum, \\alpha, and standalone Greek letters or variable soup).
  * Remove citation-only fragments like “” when not integrated into a sentence; if a citation is embedded in a sentence, remove just the bracketed marker and keep the sentence.
  * Normalize spaces, convert multiple spaces to one, and remove stray hyphenation at line ends (e.g., “trans-\nform” → “transform”).
  * Merge lines into coherent paragraphs based on natural sentence flow; do not insert bullets, numbering, or decorative characters.
  * Keep true section headings only if they introduce the following prose and are not repetitive running headers.
  * If a line is >40% symbols or looks like layout debris, drop it.
  <Input>:
  ${input}

  <Output>:
  [Cleaned narrative paragraphs only; no lists, no numbering, no quotes, no JSON, no extra commentary]`;
}
