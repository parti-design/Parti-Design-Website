/**
 * Post detail page — fetches a single post from Keystatic content files.
 * Replaces the old Payload-based page which fetched from PostgreSQL and used
 * Lexical RichText + live preview + PayloadRedirects.
 */
import type { Metadata } from 'next'
import { queryPostBySlug, queryAllPosts } from '@/lib/keystatic-queries'
import { KeystaticContent } from '@/components/KeystaticContent'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageClient from './page.client'

export const dynamicParams = true

interface Args {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export async function generateStaticParams() {
  try {
    // Pre-generate static params for all posts in both locales at build time
    const slugs = await (await import('@keystatic/core/reader')).createReader(
      process.cwd(),
      (await import('../../../../../../keystatic.config')).default
    ).collections.posts.list()

    return ['en', 'sv'].flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug }))
    )
  } catch {
    return []
  }
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { locale, slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug(decodedSlug, locale)

  if (!post) notFound()

  // Keystatic slug fields return { value: string }; handle both shapes
  const title = typeof post.title === 'object' && post.title !== null
    ? ((post.title as unknown as { value?: string }).value ?? decodedSlug)
    : (post.title as unknown as string) ?? decodedSlug

  // Keystatic MDX fields return a function — call it to get the renderable document
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentDocument: any = post.content ? await (post.content as unknown as () => Promise<unknown>)() : null

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Hero image */}
      {post.heroImage && (
        <div className="relative h-[50vh] overflow-hidden mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={typeof post.heroImage === 'string' ? post.heroImage : ''}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="container max-w-3xl mx-auto">
        {/* Post header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.authors && post.authors.length > 0 && (
              <span>by {post.authors.join(', ')}</span>
            )}
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mt-4">
              {post.categories.map((cat) => (
                <span key={cat} className="text-xs bg-muted px-2 py-1 rounded">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post body */}
        {contentDocument && (
          <KeystaticContent
            document={contentDocument as any}
            className="prose prose-lg dark:prose-invert max-w-none"
          />
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href={`/${locale}/posts`}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All posts
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug(decodedSlug, locale)

  if (!post) return {}

  const title = typeof post.title === 'object' && post.title !== null
    ? ((post.title as unknown as { value?: string }).value ?? decodedSlug)
    : (post.title as unknown as string) ?? decodedSlug

  return {
    title: post.metaTitle ?? `${title} — Parti Design`,
    description: post.metaDescription ?? '',
  }
}
