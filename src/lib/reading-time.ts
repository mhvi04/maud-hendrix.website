// Schat leestijd op basis van woordenaantal in de ruwe markdown-body
// (frontmatter is al gesplitst), aan 200 woorden per minuut.
export function estimateReadingMinutes(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = plain.length > 0 ? plain.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}
