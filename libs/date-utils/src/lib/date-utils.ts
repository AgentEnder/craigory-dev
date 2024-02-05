export function formatDateString(date: Date): string {
  return date.toISOString().replace(/T.*/, '');
}