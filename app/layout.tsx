// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  // タイトルをテンプレート化
  title: {
    template: '%s| CBED | Cosmo Base - 参加者ページ',
    default: 'Cosmo Base Event Database | Cosmo Base - 参加者ページ',
  },
  description: '宇宙に興味はあるが何から始めればいいかわからない人のための入口。関心を行動へ変えるコミュニティー。',
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 検索エンジン避け（最重要）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
 
  
}