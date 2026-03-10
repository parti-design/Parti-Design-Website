'use client'

import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

type Status = 'idle' | 'submitting' | 'sent'

export function ContactForm() {
  const t = useTranslations('contactForm')
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    type: '',
    message: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    // TODO: wire up to a form service (Resend, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="font-display font-bold text-2xl text-foreground">{t('successHeading')}</p>
        <p className="text-muted-foreground text-sm">{t('successBody')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-foreground">
            {t('nameLabel')} <span className="text-lime">{t('nameRequired')}</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder={t('namePlaceholder')}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            {t('emailLabel')} <span className="text-lime">{t('emailRequired')}</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder={t('emailPlaceholder')}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="organisation" className="text-sm font-semibold text-foreground">
            {t('orgLabel')} <span className="text-muted-foreground font-normal">{t('orgOptional')}</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            value={form.organisation}
            onChange={handleChange}
            placeholder={t('orgPlaceholder')}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="type" className="text-sm font-semibold text-foreground">
            {t('typeLabel')}
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lime transition"
          >
            <option value="">{t('typeDefault')}</option>
            <option value="architecture">{t('typeArchitecture')}</option>
            <option value="digital">{t('typeDigital')}</option>
            <option value="facilitation">{t('typeFacilitation')}</option>
            <option value="byggemenskap">{t('typeByggemenskap')}</option>
            <option value="general">{t('typeGeneral')}</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-semibold text-foreground">
          {t('messageLabel')} <span className="text-lime">{t('messageRequired')}</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold text-sm hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
