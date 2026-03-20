'use client'

import { getClientSideURL } from '@/utilities/getURL'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

type Status = 'idle' | 'submitting' | 'sent' | 'error'

export function InterestForm({ formId, locale }: { formId: number | null; locale: string }) {
  const t = useTranslations('byggemenskapPage')
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formId) return
    setStatus('submitting')

    const submissionData = Object.entries(form).map(([field, value]) => ({ field, value }))

    try {
      const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="py-10 space-y-3">
        <p className="font-display font-bold text-2xl text-foreground">{t('interestFormSuccess')}</p>
        <p className="text-muted-foreground text-sm">{t('interestFormSuccessBody')}</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="py-10 space-y-3">
        <p className="font-display font-bold text-2xl text-foreground">{t('interestFormError')}</p>
        <p className="text-muted-foreground text-sm">{t('interestFormErrorBody')}</p>
      </div>
    )
  }

  if (!formId) {
    return (
      <a
        href="mailto:hej@parti.design"
        className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold hover:bg-ink/90 transition-colors"
      >
        hej@parti.design
      </a>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-foreground">
            {t('interestFormName')} <span className="text-lime">{t('interestFormNameRequired')}</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder={t('interestFormNamePlaceholder')}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            {t('interestFormEmail')} <span className="text-lime">{t('interestFormEmailRequired')}</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder={t('interestFormEmailPlaceholder')}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-semibold text-foreground">
          {t('interestFormMessage')}{' '}
          <span className="text-muted-foreground font-normal">{t('interestFormMessageOptional')}</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder={t('interestFormMessagePlaceholder')}
          className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold text-sm hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('interestFormSubmitting') : t('interestFormSubmit')}
      </button>
    </form>
  )
}
