// app/CBED/search/page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar, Loader2, Filter, RotateCcw } from "lucide-react"
import { fetchEventsData, SpaceEvent } from "@/data/CBED"

export default function EventSearchPage() {
  const [events, setEvents] = useState<SpaceEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all") 
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedOrganizer, setSelectedOrganizer] = useState("all")
  const [showPastEvents, setShowPastEvents] = useState(false)

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true)
      const data = await fetchEventsData()
      const validEvents = data.filter(e => e.title && String(e.title).trim() !== "")
      setEvents(validEvents)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  const uniqueTypes = useMemo(() => {
    const typesSet = new Set<string>()
    events.forEach(event => {
      if (event.type) {
        String(event.type).split(',').forEach(t => {
          const trimmed = t.trim()
          if (trimmed) typesSet.add(trimmed)
        })
      }
    })
    
    return Array.from(typesSet).sort((a, b) => {
      if (a === "その他") return 1;
      if (b === "その他") return -1;
      return 0;
    })
  }, [events])

  const handleReset = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedDifficulty("all")
    setSelectedOrganizer("all")
    setShowPastEvents(false)
  }

  const filteredEvents = useMemo(() => {
    const d = new Date()
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const filtered = events.filter((event) => {
      const title = event.title ? String(event.title).toLowerCase() : ""
      const location = event.location ? String(event.location).toLowerCase() : ""
      
      const eventTypes = event.type ? String(event.type).split(',').map(t => t.trim()) : []
      const difficulty = event.difficulty ? String(event.difficulty).trim() : ""
      const query = searchQuery.toLowerCase().trim()

      const isCosmoBaseEvent: boolean = event.organizer 
        ? String(event.organizer).replace(/\s+/g, "").toLowerCase().includes("cosmobase") 
        : false;
        
      const isPartnerEvent: boolean = (event.isPartner === true) || (String(event.isPartner).toUpperCase() === "TRUE") 
        ? true 
        : false;

      const targetDate = event.endDate || event.date || ""
      const isPastEvent = targetDate !== "" && targetDate < todayStr

      if (!showPastEvents && isPastEvent) {
        return false
      }

      const matchQuery = !query || title.includes(query) || location.includes(query)
      const matchType = selectedType === "all" || eventTypes.includes(selectedType)
      
      let matchDifficulty = true
      if (selectedDifficulty !== "all") {
        if (difficulty === "全レベル") {
          matchDifficulty = true
        } else if (selectedDifficulty === "初心者向け") {
          matchDifficulty = difficulty === "初心者向け"
        } else if (selectedDifficulty === "中級者向け") {
          matchDifficulty = difficulty === "中級者向け" || difficulty === "中級者以上"
        } else if (selectedDifficulty === "上級者向け") {
          matchDifficulty = difficulty === "上級者向け" || difficulty === "中級者以上"
        } else {
          matchDifficulty = false
        }
      }

      let matchOrganizer: boolean = true
      if (selectedOrganizer === "cosmobase") {
        matchOrganizer = isCosmoBaseEvent
      } else if (selectedOrganizer === "partner") {
        matchOrganizer = isPartnerEvent
      } else if (selectedOrganizer === "others") {
        matchOrganizer = !isCosmoBaseEvent && !isPartnerEvent
      }

      return matchQuery && matchType && matchDifficulty && matchOrganizer
    })

    return filtered.sort((a, b) => {
      const dateA = a.date || ""
      const dateB = b.date || ""
      return dateA.localeCompare(dateB)
    })

  }, [events, searchQuery, selectedType, selectedDifficulty, selectedOrganizer, showPastEvents])

  return (
    <ContentPageLayout title="詳細検索" level={3} levelTitle="" logo="CBED">
      <div className="glass-card rounded-xl p-5 md:p-6 mb-8 border border-border/50 shadow-sm">
        
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="イベント名や会場で検索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border border-border/50"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="絞り込みをリセット"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">リセット</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">主催・運営</span>
            <select 
              value={selectedOrganizer}
              onChange={(e) => setSelectedOrganizer(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべてのイベント</option>
              <option value="cosmobase">Cosmo Base主催</option>
              <option value="partner">パートナー主催</option>
              <option value="others">外部イベント</option>
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">イベントの形式</span>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべての形式</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">対象者のレベル</span>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべてのレベル</option>
              <option value="初心者向け">初心者向け</option>
              <option value="中級者向け">中級者向け</option>
              <option value="上級者向け">上級者向け</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer w-max hover:opacity-80 transition-opacity">
          <input
            type="checkbox"
            checked={showPastEvents}
            onChange={(e) => setShowPastEvents(e.target.checked)}
            className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50 bg-secondary/50"
          />
          過去のイベントも表示する
        </label>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">イベントを読み込み中...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const displayTypes = event.type ? String(event.type).split(',').map(t => t.trim()) : []
            
            const isCosmoBaseEvent: boolean = event.organizer 
              ? String(event.organizer).replace(/\s+/g, "").toLowerCase().includes("cosmobase") 
              : false;
              
            const isPartnerEvent: boolean = (event.isPartner === true) || (String(event.isPartner).toUpperCase() === "TRUE") 
              ? true 
              : false;

            let orgLabel = "外部イベント"
            let orgStyle = "bg-secondary text-muted-foreground border-border/50"

            if (isCosmoBaseEvent) {
              orgLabel = "主催イベント"
              orgStyle = "bg-primary/20 text-primary border-primary/30"
            } else if (isPartnerEvent) {
              orgLabel = "パートナー"
              orgStyle = "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
            }
            
            return (
              <Link href={`/CBED/${event.id}`} key={event.id} className="block group">
                <div className="glass-card rounded-xl p-5 border border-border/50 hover:bg-primary/5 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-sm hover:shadow-md">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${orgStyle}`}>
                        {orgLabel}
                      </span>

                      {displayTypes.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-accent/20 text-accent border border-accent/30">
                          {t}
                        </span>
                      ))}
                      {event.difficulty && (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary border border-border/50 text-muted-foreground">
                          {event.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors break-words">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground w-full md:w-[280px] shrink-0">
                    {(event.date || event.time) && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="break-words whitespace-pre-wrap leading-relaxed">
                          {event.endDate ? `${event.date} 〜 ${event.endDate}` : event.date} {event.time}
                        </span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="break-words line-clamp-2 leading-relaxed">{event.location}</span>
                      </div>
                    )}
                  </div>

                </div>
              </Link>
            )
          })
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border/50">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">条件に一致するイベントが見つかりません。</p>
            <p className="text-sm mt-1">フィルターをリセットするか、キーワードを変えてみてください。</p>
            <Button variant="outline" onClick={handleReset} className="mt-4">
              絞り込みをリセット
            </Button>
          </div>
        )}
      </div>
    </ContentPageLayout>
  )
}
