// components/auto-slider.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// スライダー用の画像をすべて直接インポートする
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import welcomeImg from "../public/images/slider-welcome.jpg"
import partnerImg from "../public/CBP.png"
import shittokuImg from "../public/shittoku/9.png"
import feedbackImg from "../public/feedback.png"
import memberImg from "../public/member.png"
import partImg from "../public/part.jpg"

const slides = [
  {
    id: 0,
    title: "Cosmo Baseへようこそ",
    description: "宇宙をさらに身近にしていくコミュニティーです。\nCosmo Baseで宇宙を楽しみましょう。",
    image: welcomeImg,
    href: "/",
  },
  {
    id: 1,
    title: "",
    description: "",
    image: partnerImg,
    href: "https://fsifofficial.github.io/CosmoBase/news/kitaurora",
  },
  {
    id: 2,
    title: "",
    description: "",
    image: shittokuImg,
    href: "https://cosmo-base.github.io/member_only/shittoku/",
  },
  {
    id: 3,
    title: "",
    description: "",
    image: feedbackImg,
    href: "https://fsifofficial.github.io/CosmoBase/contact",
  },
  {
    id: 4,
    title: "",
    description: "",
    image: memberImg,
    href: "https://fsifofficial.github.io/CosmoBase/contact",
  },
  {
    id: 5,
    title: "",
    description: "",
    image: partImg,
    href: "https://fsifofficial.github.io/CosmoBase/partner",
  },
]

export function AutoSlider() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ]

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [isTransitioning])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [isTransitioning])

  useEffect(() => {
    const timer = setInterval(goToNext, 5000)
    return () => clearInterval(timer)
  }, [goToNext])

  useEffect(() => {
    if (!isTransitioning) return

    const timer = setTimeout(() => {
      setIsTransitioning(false)
      
      if (currentIndex === extendedSlides.length - 1) {
        setCurrentIndex(1)
      }
      if (currentIndex === 0) {
        setCurrentIndex(slides.length)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [currentIndex, isTransitioning, extendedSlides.length])

  const goToSlide = (realIndex: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(realIndex + 1)
  }

  const actualIndex = currentIndex === 0 
    ? slides.length - 1 
    : currentIndex === extendedSlides.length - 1 
    ? 0 
    : currentIndex - 1

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <Link
            key={`${slide.id}-${index}`}
            href={slide.href}
            className="min-w-full relative block group"
          >
            <div className="relative aspect-[1280/670] overflow-hidden rounded-xl">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index === 0 || index === 1}
                loading="eager"
              />
              
              {(slide.title || slide.description) && (
                <div className="absolute inset-0 flex items-center p-6 md:p-12">
                  <div className="max-w-xl bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-xl transition-all group-hover:bg-background/80">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {slide.title}
                    </h3>
                    <p className="text-sm md:text-base whitespace-pre-line text-foreground/90 font-medium">
                      {slide.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm shadow-md"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm shadow-md"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-background/30 backdrop-blur-md px-4 py-2 rounded-full border border-border/20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
              index === actualIndex
                ? "bg-primary w-8"
                : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
