export const legacyVentureStatusMap = {
  active: 'grow',
  'in-development': 'root',
  completed: 'sprout',
} as const

export function normalizeVentureStatus(value?: string | null): string | null | undefined {
  if (!value) return value

  return legacyVentureStatusMap[value as keyof typeof legacyVentureStatusMap] ?? value
}
