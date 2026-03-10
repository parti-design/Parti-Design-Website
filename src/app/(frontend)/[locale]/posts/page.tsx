/**
 * Posts listing page — fetches all posts from Keystatic content files.
 * Replaces the old Payload-based page which fetched from a PostgreSQL database.
 */
import type { Metadata } from 'next/types'
import { queryAllPosts } from '@/lib/keystatic-queries'
import Link from 'next/link'
import PageClient from './page.client'

interface Props {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: Props) {
  const { locale } = await params
  const posts = await queryAllPosts(locale)

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => {
              if (!post) return null
              // Keystatic slug fields return { value: string }; handle both shapes
              const title = typeof post.title === 'object' && post.title !== null
                ? ((post.title as unknown as { value?: string }).value ?? post.slug)
                : (post.title as unknown as string) ?? post.slug

              return (
                <article key={post.slug} className="border-b border-border pb-8">
                  <Link href={`/${locale}/posts/${post.slug}`} className="group">
                    <h2 className="text-2xl font-bold group-hover:text-lime transition-colors mb-2">
                      {title}
                    </h2>
                  </Link>
                  {post.publishedAt && (
                    <time className="text-sm text-muted-foreground" dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {post.categories.map((cat) => (
                        <span key={cat} className="text-xs bg-muted px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Posts — Parti Design',
  }
}
