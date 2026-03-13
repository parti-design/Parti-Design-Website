export const fallbackVentureColors = {
  lime: '#bbd644',
  lavender: '#ccc2de',
  ink: '#231f20',
} as const

type VentureTheme = keyof typeof fallbackVentureColors

export function normalizeHexColor(value?: string | null): string | undefined {
  if (!value) return undefined

  const trimmed = value.trim()
  const lowered = trimmed.toLowerCase()
  const shortHex = /^#([0-9a-fA-F]{3})$/
  const longHex = /^#([0-9a-fA-F]{6})$/

  if (lowered in fallbackVentureColors) {
    return fallbackVentureColors[lowered as VentureTheme]
  }

  if (longHex.test(trimmed)) {
    return trimmed.toLowerCase()
  }

  const shortMatch = trimmed.match(shortHex)
  if (shortMatch?.[1]) {
    const [r, g, b] = shortMatch[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  return undefined
}

export function resolveVentureColor(
  value?: string | null,
  fallbackTheme: VentureTheme = 'lavender',
): string {
  return normalizeHexColor(value) ?? fallbackVentureColors[fallbackTheme]
}

export function isDarkHexColor(value: string): boolean {
  const hex = value.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance < 0.52
}

export function rgbaFromHex(value: string, alpha: number): string {
  const hex = value.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
