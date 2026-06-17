import type { ReactNode } from "react"

interface LevelSectionProps {
  level: number
  title: string
  children: ReactNode
}

export function LevelSection({ level, title, children }: LevelSectionProps) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary/20 text-primary font-bold text-lg">
          Level {level}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </section>
  )
}
