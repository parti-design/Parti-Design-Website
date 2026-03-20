import { Logo } from '@/components/Logo/Logo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations()

  const NAV_LINKS = [
    { label: t('nav.work'), href: '/work' },
    { label: t('nav.ventures'), href: '/ventures' },
    { label: t('nav.about'), href: '/studio' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="container pt-16 pb-8">
        {/* Top row: logo + tagline | nav links + locale switcher */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 pb-12 border-b border-border">
          <div className="max-w-xs space-y-3">
            <Link href="/" aria-label="Parti Design home">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <LocaleSwitcher className="text-muted-foreground" />
          </div>
        </div>

        {/* Bottom row: location | copyright */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 text-sm text-muted-foreground">
          <span>{t('footer.location')}</span>
          <span>{t('footer.copyright')}</span>
        </div>
      </div>
    </footer>
  )
}
