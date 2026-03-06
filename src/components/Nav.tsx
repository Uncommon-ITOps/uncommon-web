import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export async function Nav() {
  const payload = await getPayloadClient()
  const nav = await payload.findGlobal({
    slug: 'navigation',
  })

  if (!nav) {
    return (
      <nav className="nav">
        <Link href="/">Uncommon</Link>
      </nav>
    )
  }

  const primaryLinks = nav.primaryLinks ?? []
  const ctaLabel = nav.ctaLabel ?? 'Book a tour'
  const ctaUrl = nav.ctaUrl ?? '#'

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          Uncommon
        </Link>
        <ul className="nav-links">
          {primaryLinks.map((link) => (
            <li key={link.url ?? link.id ?? ''}>
              {link.children?.length ? (
                <span className="nav-parent">
                  <Link href={link.url ?? '#'}>{link.label}</Link>
                  <ul className="nav-dropdown">
                    {link.children.map((child) => (
                      <li key={child.url ?? child.id ?? ''}>
                        <Link href={child.url ?? '#'}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </span>
              ) : (
                <Link href={link.url ?? '#'}>{link.label}</Link>
              )}
            </li>
          ))}
          <li>
            <Link href={ctaUrl} className="nav-cta">
              {ctaLabel}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
