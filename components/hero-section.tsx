"use client"

import { AutoSlider } from "@/components/auto-slider"

export function HeroSection() {
  return (
    <section className="relative px-4 pt-24 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Auto Slider with welcome message */}
        <AutoSlider />
      </div>
    </section>
  )
}
