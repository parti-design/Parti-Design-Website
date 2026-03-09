'use client'

import React, { useState } from 'react'

type Status = 'idle' | 'submitting' | 'sent'

export function ContactForm() {
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
        <p className="font-display font-bold text-2xl text-foreground">Thanks &mdash; we&apos;ll be in touch.</p>
        <p className="text-muted-foreground text-sm">We usually reply within a couple of days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-foreground">
            Name <span className="text-lime">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email <span className="text-lime">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="organisation" className="text-sm font-semibold text-foreground">
            Organisation <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            value={form.organisation}
            onChange={handleChange}
            placeholder="Your organisation or municipality"
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="type" className="text-sm font-semibold text-foreground">
            Type of project
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lime transition"
          >
            <option value="">Select a type...</option>
            <option value="architecture">Architecture</option>
            <option value="digital">Digital / Web</option>
            <option value="facilitation">Co-design / Facilitation</option>
            <option value="byggemenskap">Byggemenskap</option>
            <option value="general">General inquiry</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-semibold text-foreground">
          Message <span className="text-lime">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your project, idea, or question..."
          className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center px-8 py-4 rounded-md bg-ink text-off-white font-semibold text-sm hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
