import { Bell, Megaphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Notice {
  id: number
  date: string
  content: string
  isNew?: boolean
}

const notices: Notice[] = [
  {
    id: 1,
    date: "2026年4月1日",
    content: "Cosmo Baseがオープンしました。",
    isNew: true,
  },
]

export function AdminNotice() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Megaphone className="h-5 w-5 text-accent" />
          運営からのお知らせ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <Bell className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">{notice.date}</span>
                {notice.isNew && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{notice.content}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
