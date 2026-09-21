"use client"
import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { useProfile } from '@/hooks/useData'

const quickLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export function Footer() {
  const { profile } = useProfile()
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Makanjuola Ebenezer'

  return (
    <footer className="relative bg-ink-800 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block text-2xl font-bold gradient-text-static font-display">
              {profile?.firstName?.[0] || 'M'}{profile?.lastName?.[0] || 'E'}
              <span className="text-white">.</span>
            </Link>
            <p className="text-ink-200 max-w-sm leading-relaxed">
              {profile?.tagline || 'Electrical Engineer specializing in aviation systems, power infrastructure and maintenance at NAMA, Nigeria.'}
            </p>
            <div className="flex gap-3 pt-2">
              {profile?.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-ink-100 hover:text-white hover:border-primary-400/50 hover:shadow-glow transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-ink-100 hover:text-white hover:border-electric-400/50 hover:shadow-electric transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              <a href={`mailto:${profile?.email || 'makanjuola.ebenezer@nama.gov.ng'}`}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-ink-100 hover:text-white hover:border-accent-400/50 hover:shadow-glow transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-electric-300 mb-5">
              Navigate
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-ink-100 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-electric-300 mb-5">
              Get in touch
            </h3>
            <div className="space-y-2 text-ink-100">
              <p>{profile?.email || 'makanjuola.ebenezer@nama.gov.ng'}</p>
              <p>{profile?.location ? `${profile.location.city}, ${profile.location.country}` : 'Lagos, Nigeria'}</p>
            </div>
            <a href="#contact" className="mt-5 inline-flex btn-secondary !px-5 !py-2 text-sm">
              Let&apos;s talk
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-300">
          <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Crafted with
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-electric-400 animate-pulse" />
            precision &amp; power.
          </p>
        </div>
      </div>
    </footer>
  )
}
