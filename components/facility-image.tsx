// components/facility-image.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface FacilityImageProps {
  src?: string
  alt: string
  sizes?: string
  priority?: boolean
  variant?: "card" | "detail"
}

export function FacilityImage({
  src,
  alt,
  sizes,
  priority = false,
  variant = "card"
}: FacilityImageProps) {
  const [error, setError] = useState(false)

  // 施設データ（src）が切り替わったらエラー状態をリセット
  useEffect(() => {
    setError(false)
  }, [src])

  const isAvailable = src && src !== "/images/placeholder.jpg" && !error

  // ■ パターンA: 施設詳細ページ（上部の巨大パノラマ画像）の場合
  if (variant === "detail") {
    // 画像がない、またはリンク切れエラーの場合はエリア（巨大なガラス枠）ごと完全に非表示にする
    if (!isAvailable) return null

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-in fade-in duration-300">
        <div className="aspect-[21/9] rounded-3xl bg-secondary/30 overflow-hidden flex items-center justify-center glass relative">
          <Image 
            src={src} 
            alt={alt} 
            fill
            sizes="100vw"
            priority={priority}
            className="object-cover"
            onError={() => setError(true)}
          />
        </div>
      </div>
    )
  }

  // ■ パターンB: カード型一覧（トップ、検索、データベース）の場合
  if (!isAvailable) {
    // 画像がない、またはリンク切れエラーの場合は写真未設定時と同じマップピンを表示
    return (
      <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-secondary/10 text-muted-foreground">
        <MapPin className="w-8 h-8 opacity-40" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes || "(max-width: 768px) 100vw, 33vw"}
      priority={priority}
      className="object-cover"
      onError={() => setError(true)}
    />
  )
}