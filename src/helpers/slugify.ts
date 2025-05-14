export function slugify(text: string): string {
  // Normalize text (decompose accents)
  const normalized = text.normalize("NFKD");

  // Remove accents by filtering out non-ASCII characters
  const withoutAccents = normalized.replace(/[\u0300-\u036f]/g, "");

  // Remove non-word characters (excluding whitespace and hyphens)
  const cleaned = withoutAccents.replace(/[^\w\s-]/g, "");

  // Replace whitespace with hyphens and convert to lowercase
  const hyphenated = cleaned.replace(/\s+/g, "-").toLowerCase();

  // Trim hyphens from start and end
  return hyphenated.replace(/^-+|-+$/g, "");
}
