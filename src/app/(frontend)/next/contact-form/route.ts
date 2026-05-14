import { NextRequest } from 'next/server'

type SubmissionBody = {
  name?: string
  email?: string
  organization?: string
  type?: string
  message?: string
  // Honeypot — bots fill hidden fields; humans don't.
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NOCODB_URL
  const tableId = process.env.NOCODB_TABLE_ID
  const token = process.env.NOCODB_TOKEN

  if (!baseUrl || !tableId || !token) {
    return Response.json(
      { error: 'Contact form is not configured.' },
      { status: 500 },
    )
  }

  let body: SubmissionBody
  try {
    body = (await req.json()) as SubmissionBody
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (body.website) {
    return Response.json({ ok: true })
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const message = body.message?.trim() ?? ''

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 })
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return Response.json({ error: 'Field too long.' }, { status: 400 })
  }

  const record = {
    name,
    email,
    organization: body.organization?.trim() ?? '',
    type: body.type?.trim() ?? '',
    message,
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/v2/tables/${tableId}/records`

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': token,
      },
      body: JSON.stringify(record),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('NocoDB submission failed', res.status, detail)
      return Response.json(
        { error: 'Could not save submission.' },
        { status: 502 },
      )
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('NocoDB submission error', err)
    return Response.json({ error: 'Could not reach storage.' }, { status: 502 })
  }
}
