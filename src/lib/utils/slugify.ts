/**
 * Generate a URL-friendly slug from a title
 * Removes diacritics, converts to lowercase, replaces non-alphanumeric with hyphens
 */
export function generateSlug(title: string): string {
  return title
    .normalize("NFKD")                            // split accented letters
    .replace(/[\u0300-\u036f]/g, "")               // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")                   // non-alphanumeric → hyphen
    .replace(/(^-|-$)/g, "");                      // trim leading/trailing hyphens
}
