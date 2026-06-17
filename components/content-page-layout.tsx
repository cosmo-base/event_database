"use client"

import Image from "next/image"
import { StarBackground } from "@/components/star-background"
import { SiteHeader } from "@/components/site-header"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. フッター用のロゴ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import footerLogo from "../public/images/cosmo-base-logo.png"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2. 各コンテンツ用のロゴをすべてインポート
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import cbedLogo from "../public/CBED_logo.png"
import cblLogo from "../public/CBL_logo.png" 
import ittekitaLogo from "../public/CBittekita_logo.png" 
import ittoideLogo from "../public/CBittoide_logo.png" 
import newsLogo from "../public/CBnews_logo.png" 
import oshieteLogo from "../public/CBoshiete_logo.png" 
import quizLogo from "../public/CBquiz_logo.png" 
import shittokuLogo from "../public/CBshittoku_logo.png" 
import typeLogo from "../public/CBtype_logo.png" 
import voyagerLogo from "../public/CBvoyager_logo.png"
import cbmdLogo from "../public/CBMD_logo.png"
import cmlogo from "../public/CosmoMatch.png"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. 呼び出し名（prop）とインポートした画像を紐づける辞書
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LOGO_MAP: Record<string, any> = {
  "CBED": cbedLogo,
  "CBL": cblLogo,
  "CBittekita": ittekitaLogo,
  "CBittoide": ittoideLogo, 
  "CBnews": newsLogo,
  "CBoshiete": oshieteLogo,
  "CBquiz": quizLogo,
  "CBshittoku": shittokuLogo,
  "CBtype": typeLogo,
  "CBvoyager": voyagerLogo,
  "CBMD":cbmdLogo,
  "CosmoMatch":cmlogo
}

interface ContentPageLayoutProps {
  children: React.ReactNode
  title: string
  level: number
  levelTitle: string
  logo: string
}

export function ContentPageLayout({
  children,
  title,
  level,
  levelTitle,
  logo
}: ContentPageLayoutProps) {
  
  // 辞書から、渡されたlogo名に一致する画像を取り出す
  const currentLogo = LOGO_MAP[logo]

  return (
    <div className="relative min-h-screen">
      <StarBackground />

      <main className="relative z-10">
        <SiteHeader />

        <div className="h-16" />

        <div className="max-w-5xl mx-auto px-4 pt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          <div className="flex-1">
            {level > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                  Level {level}
                </span>
                <span className="text-muted-foreground text-sm">{levelTitle}</span>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance" suppressHydrationWarning>
              {title}
            </h1>
          </div>

          <div className="ml-10 flex-shrink-0 mb-6">
            {/* ★ 辞書から取り出した画像をImageコンポーネントに渡す */}
            {currentLogo && (
              <Image 
                src={currentLogo} 
                alt={`${logo} logo`} 
                className="h-24 w-auto object-contain"
                priority
              />
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-16">
          {children}
        </div>

        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-8">
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
            <Image
              src={footerLogo}
              alt="Cosmo Base"
              className="h-8 w-auto opacity-70"
            />
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Cosmo Base. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
