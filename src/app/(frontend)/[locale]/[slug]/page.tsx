/**
 * Dynamic page route — previously served Payload CMS "Pages" collection content.
 *
 * With Keystatic, we do not have a generic Pages collection.
 * All known routes are explicit (/, /work, /ventures, /contact, etc.).
 * This catch-all returns 404 for unknown slugs.
 *
 * TODO: If a general-purpose Pages collection is needed in the future,
 * add it to keystatic.config.ts and read it here via createReader().
 */
import { notFound } from 'next/navigation'

export const dynamicParams = false

export async function generateStaticParams() {
  // No pages to pre-generate — return empty
  return []
}

export default function Page() {
  notFound()
}
