/**
 * KeystaticContent
 *
 * Renders Keystatic MDX document fields using Keystatic's built-in DocumentRenderer.
 * Replaces the old Payload <RichText> component which rendered Lexical JSON.
 *
 * Usage:
 *   const entry = await reader.collections.projects.read(slug)
 *   const document = await entry.content()  // note: Keystatic returns an async function
 *   <KeystaticContent document={document} />
 */
'use client'
import { DocumentRenderer } from '@keystatic/core/renderer'
import type { DocumentRendererProps } from '@keystatic/core/renderer'
import React from 'react'

type Props = {
  document: DocumentRendererProps['document']
  className?: string
}

export function KeystaticContent({ document, className }: Props) {
  return (
    <div className={className}>
      <DocumentRenderer
        document={document}
        renderers={{
          inline: {
            bold: ({ children }) => <strong>{children}</strong>,
            italic: ({ children }) => <em>{children}</em>,
            underline: ({ children }) => <u>{children}</u>,
            strikethrough: ({ children }) => <s>{children}</s>,
            code: ({ children }) => (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ),
            link: ({ href, children }) => (
              <a
                href={href}
                className="underline underline-offset-2 hover:no-underline"
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
          },
          block: {
            paragraph: ({ children, textAlign }) => (
              <p className="mb-4 leading-relaxed" style={{ textAlign }}>
                {children}
              </p>
            ),
            heading: ({ level, children, textAlign }) => {
              // Map heading levels to appropriate Tailwind styles
              const styles: Record<number, string> = {
                1: 'text-3xl font-bold mb-6 mt-8',
                2: 'text-2xl font-bold mb-4 mt-8',
                3: 'text-xl font-semibold mb-3 mt-6',
                4: 'text-lg font-semibold mb-2 mt-4',
                5: 'text-base font-semibold mb-2 mt-4',
                6: 'text-sm font-semibold mb-2 mt-4',
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Tag: any = `h${level}`
              return (
                <Tag className={styles[level]} style={{ textAlign }}>
                  {children}
                </Tag>
              )
            },
            list: ({ type, children }) =>
              type === 'ordered' ? (
                <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
              ) : (
                <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
              ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic mb-4 text-muted-foreground">
                {children}
              </blockquote>
            ),
            code: ({ children, language }) => (
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4 text-sm">
                <code className={language ? `language-${language}` : ''}>{children}</code>
              </pre>
            ),
            divider: () => <hr className="my-8 border-muted" />,
            image: ({ src, alt, title }) => (
              <figure className="mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt ?? ''}
                  title={title}
                  className="w-full rounded-lg"
                />
                {title && (
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                    {title}
                  </figcaption>
                )}
              </figure>
            ),
          },
        }}
      />
    </div>
  )
}
