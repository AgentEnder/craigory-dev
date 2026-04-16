export function parseAge(age: string): number {
  const match = age.match(/^(\d+)(h|m|d)$/);
  if (!match) {
    throw new Error(`Invalid age format: "${age}". Use e.g. 2h, 30m, 1d`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * multipliers[unit];
}
