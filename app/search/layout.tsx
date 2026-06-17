import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "詳細検索 | Cosmo Base Event Database",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}