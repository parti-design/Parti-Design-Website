'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React from 'react'

import { fallbackVentureColors, normalizeHexColor } from '@/lib/venture-colors'

export const VentureThemeColorField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const normalized = normalizeHexColor(value)
  const swatchColor = normalized ?? fallbackVentureColors.lavender
  const label =
    typeof field.label === 'string' ? field.label : field.name ?? 'Theme Color'

  React.useEffect(() => {
    if (!readOnly && typeof value === 'string' && normalized && value !== normalized) {
      setValue(normalized)
    }
  }, [normalized, readOnly, setValue, value])

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>
          {label}
        </label>
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)', fontSize: '0.875rem' }}>
          Pick any hex color for the venture card and page accent.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="color"
          value={swatchColor}
          disabled={Boolean(readOnly)}
          onChange={(event) => setValue(event.target.value)}
          style={{
            width: '3rem',
            height: '3rem',
            padding: 0,
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '999px',
            background: 'transparent',
            cursor: readOnly ? 'default' : 'pointer',
          }}
        />

        <input
          type="text"
          value={normalized ?? value ?? ''}
          disabled={Boolean(readOnly)}
          onChange={(event) => setValue(event.target.value)}
          placeholder="#ccc2de"
          style={{
            width: '10rem',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '0.5rem',
            padding: '0.7rem 0.85rem',
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
          }}
        />
      </div>
    </div>
  )
}
