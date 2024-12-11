export function toTitleCase0(str: string): string {
  return str
    .split(" ") // Split the string into words based on spaces
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of each word
    })
    .join(" "); // Join the words back together with spaces in between
}

export function toTitleCase(str: string): string {
  // List of words to keep lowercase unless they are at the start
  const lowercaseWords = ["de", "del", "la", "les", "d'", "de la", "de les"];

  return str
    .split(" ") // Split the string into words based on spaces
    .map((word, index) => {
      // Check for words in the lowercaseWords list
      if (index > 0 && lowercaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase(); // Keep them lowercase unless at the beginning
      }

      // Special handling for words like "d'"
      if (word.toLowerCase().startsWith("d'")) {
        return (
          "d'" + word.charAt(2).toUpperCase() + word.slice(3).toLowerCase()
        );
      }

      // Capitalize the first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ") // Join the words back together with spaces
    .replace("l.l", "l·l"); // Handle specific replacements like l·l → l.l
}

export function encodeForReadableURI(input: string): string {
  return input.trim().toLowerCase().replace(/[\s]+/g, "-");
}

export function decodeReadableURI(input: string): string {
  return decodeURIComponent(input.trim().replace(/-/g, " "));
}
