// components/header.tsx
import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoImg from "../public/images/cosmo-base-logo.png"

export function Header() {
  return (
    <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <Image
            src={logoImg}
            alt="Cosmo Base"
            className="h-12 w-auto"
          />

        </div>
        <Button asChild variant="outline" className="gap-2 border-border/50 hover:bg-secondary/50">
          <Link href="https://fsifofficial.github.io/CosmoBase/partners" target="_blank">
            <Users className="h-4 w-4" />
            パートナー一覧
          </Link>
        </Button>
      </div>
    </header>
  )
}
