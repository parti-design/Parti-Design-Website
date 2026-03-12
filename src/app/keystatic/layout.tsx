/**
 * Keystatic admin layout.
 * The admin UI is a fully client-side React app served at /keystatic.
 * Next.js App Router requires <html> and <body> in every root layout branch.
 */
export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
