import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "イベント登録 | Cosmo Base Event Database",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}