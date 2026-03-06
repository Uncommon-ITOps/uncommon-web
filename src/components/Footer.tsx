import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export async function Footer() {
  const payload = await getPayloadClient()
  const footer = await payload.findGlobal({
    slug: 'footer',
  })

  if (!footer) {
    return (
      <footer className="footer">
        <p>© Uncommon. Coworking &amp; flexible office space in London.</p>
      </footer>
    )
  }

  const links = footer.links ?? []
  const socialLinks = footer.socialLinks ?? []
  const legalText = footer.legalText

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          {links.map((link) => (
            <Link key={link.url ?? link.id ?? ''} href={link.url ?? '#'}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="footer-social">
          {socialLinks.map((link) => (
            <a
              key={link.url ?? link.id ?? ''}
              href={link.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
        {legalText && <p className="footer-legal">{legalText}</p>}
      </div>
    </footer>
  )
}
