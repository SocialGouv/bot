/**
 * Generate a dash-separated non-accented lowercase letter-or-number-only string from a text:
 *
 * @todo Replace accented letters with non-accented ones.
 */
export default function generateBranchNameFromText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/, "");
}
