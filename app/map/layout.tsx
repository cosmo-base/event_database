import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "地図で探す | Cosmo Base Event Database",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}