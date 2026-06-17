import { ExternalLink, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  note?: string
}

export function FormCard({ title, description, href, icon: Icon, note }: FormCardProps) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:bg-card/80 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6" />
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
          {note && (
            <p className="mt-2 text-xs text-accent font-medium">
              ※ {note}
            </p>
          )}
        </CardContent>
      </Card>
    </a>
  )
}
