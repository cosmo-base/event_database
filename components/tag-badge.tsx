import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface TagBadgeProps {
  children: ReactNode
  className?: string
  variant?: "default" | "primary" | "accent"
}

export function TagBadge({ children, className, variant = "default" }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
        variant === "default" && "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
        variant === "primary" && "bg-primary/20 text-primary hover:bg-primary/30",
        variant === "accent" && "bg-accent/20 text-accent hover:bg-accent/30",
        className
      )}
    >
      {children}
    </span>
  )
}
