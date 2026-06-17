import Image from "next/image"
import { ExternalLink } from "lucide-react"

import logoImg from "../public/images/cosmo-base-logo.png"

const links = [
  { label: "Cosmo Base", href: "https://fsifofficial.github.io/CosmoBase/" },
  { label: "Cosmo Base Library", href: "https://cosmo-base.github.io/library/index.html" },
  { label: "X", href: "https://x.com/CosmoBase" },
  { label: "Instagram", href: "https://www.instagram.com/cosmobase.official/" },
  { label: "note", href: "https://note.com/cosmobase" },
  { label: "YouTube", herf: "https://www.youtube.com/channel/UC3bcWCM6ccvsyQyiXLIwhkQ"},
]

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 py-16 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={logoImg}
              alt="Cosmo Base"
              className="w-auto h-12"
            />
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Cosmo Base. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
