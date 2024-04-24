export function normalizeString(str: String) {
  return str
    .normalize("NFD") // Normalize to decomposed form (NFD)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^a-z0-9 -]/gi, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Replace multiple - with single -
    .toLowerCase(); // Convert to lowercase
}
