// components/site-header.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Users, BookOpen, Database, Globe, HelpCircle, Twitter, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import logoImg from "../public/images/cosmo-base-logo.png"
import cbIcon from "../public/CB_icon.png"
import xIcon from "../public/X.png"
import instaIcon from "../public/Instagram.png"
import noteIcon from "../public/note.png"
import YouTubeIcon from "../public/youtube.png"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Back button + Logo - Left */}
        <div className="flex items-center gap-2">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
            aria-label="戻る"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoImg}
              alt="Cosmo Base"
              className="h-10 w-auto"
              priority
              loading="eager"
            />
            <span className="text-xs text-muted-foreground border-l border-border pl-3 hidden sm:block">
              参加者ページ
            </span>
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Partners button */}
          <a href="https://fsifofficial.github.io/CosmoBase/partners">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">パートナー一覧</span>
            </Button>
          </a>

          {/* Usage guide button */}
          <Link href="/guide">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">使い方</span>
            </Button>
          </Link>

          {/* Hamburger menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Dropdown menu - right half only */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-full sm:w-[320px] bg-background/95 backdrop-blur-xl border-b border-l border-border/50 rounded-bl-2xl shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200">
          <nav className="p-3">
            <ul className="flex flex-col gap-1">

              <li>
                <a
                  href="https://fsifofficial.github.io/CosmoBase/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={cbIcon.src} className="w-5 h-5 object-contain" alt="Cosmo Base" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Cosmo Base</p>
                    <p className="text-xs text-muted-foreground mt-0.5">公式サイト</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://cosmo-base.github.io/library/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Cosmo Base Library</p>
                    <p className="text-xs text-muted-foreground mt-0.5">宇宙の知識を体系的に学ぶ</p>
                  </div>
                </a>
              </li>

              {/* 区切り線 */}
              <div className="h-px w-full bg-border/50 my-1 rounded-full" />

              <li>
                <a
                  href="https://x.com/CosmoBase"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={xIcon.src} alt="X" className="w-4 h-4 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">X (Twitter)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">最新情報をチェック</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/cosmobase.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={instaIcon.src} alt="Instagram" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Instagram</p>
                    <p className="text-xs text-muted-foreground mt-0.5">活動の様子をチェック</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://note.com/cosmobase"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={noteIcon.src} alt="note" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">note</p>
                    <p className="text-xs text-muted-foreground mt-0.5">記事を読む</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://www.youtube.com/channel/UC3bcWCM6ccvsyQyiXLIwhkQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={YouTubeIcon.src} alt="YouTube" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">YouTube</p>
                    <p className="text-xs text-muted-foreground mt-0.5">動画を見る</p>
                  </div>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
