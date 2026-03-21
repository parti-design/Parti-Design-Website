const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // ── Legacy URL redirects ────────────────────────────────────────────────
  // Old site used /studio; page is now at /about
  const studioToAbout = [
    { source: '/studio',     destination: '/en/about', permanent: true },
    { source: '/en/studio',  destination: '/en/about', permanent: true },
    { source: '/sv/studio',  destination: '/sv/about', permanent: true },
  ]

  // Old co-design service URL renamed to regenerative-placemaking
  const coDesignRedirects = [
    { source: '/services/co-design',                  destination: '/en/services/regenerative-placemaking', permanent: true },
    { source: '/en/services/co-design',               destination: '/en/services/regenerative-placemaking', permanent: true },
    { source: '/sv/services/co-design',               destination: '/sv/services/regenerative-placemaking', permanent: true },
    { source: '/services/regenerative-strategies',    destination: '/en/services/regenerative-placemaking', permanent: true },
    { source: '/en/services/regenerative-strategies', destination: '/en/services/regenerative-placemaking', permanent: true },
    { source: '/sv/services/regenerative-strategies', destination: '/sv/services/regenerative-placemaking', permanent: true },
  ]

  const redirects = [internetExplorerRedirect, ...studioToAbout, ...coDesignRedirects]

  return redirects
}

export default redirects
