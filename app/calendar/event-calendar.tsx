// app/CBED/calendar/event-calendar.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Award, X, Bookmark, Rocket, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagBadge } from "@/components/tag-badge"
import { GlassCard } from "@/components/glass-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SpaceEvent } from "@/data/CBED"
import { LaunchEvent } from "@/data/launches"

// ★ TypeScriptの型安全のためのカスタム型
type ParsedSpaceEvent = Omit<SpaceEvent, 'date' | 'endDate'> & {
  date: Date;
  endDate: Date | null;
};

type CalendarItem = ParsedSpaceEvent | LaunchEvent;

function getSafeDate(dateValue: any): Date {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'string' || typeof dateValue === 'number') return new Date(dateValue);
  return new Date(0);
}

function isLaunch(item: CalendarItem): item is LaunchEvent {
  return 'isLaunch' in item && item.isLaunch === true;
}

export default function EventCalendar({ events = [], launches = [] }: { events: SpaceEvent[], launches?: LaunchEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarItem | null>(null)
  
  // ★ 追加: その日のイベントをすべて一覧表示するためのState
  const [selectedDayItems, setSelectedDayItems] = useState<{ date: Date, items: CalendarItem[] } | null>(null)
  
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [hostFilter, setHostFilter] = useState<"all" | "host" | "partner" | "external">("all")
  
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const daysInMonth = lastDayOfMonth.getDate()
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayOfWeek + 1
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)
    }
    return null
  })

  const safeEvents = useMemo(() => {
    return (events || [])
      .filter((e) => e && e.date)
      .map((e) => {
        return {
          ...e,
          date: getSafeDate(e.date),
          endDate: e.endDate ? getSafeDate(e.endDate) : null,
        } as unknown as ParsedSpaceEvent;
      })
      .filter((e) => e.date && !isNaN(e.date.getTime()));
  }, [events]);

  const eventTypes = useMemo(() => {
    const types = Array.from(new Set(safeEvents.map(e => e.type).filter(Boolean))) as string[];
    return types.sort((a, b) => {
      if (a === "その他") return 1;
      if (b === "その他") return -1;
      return a.localeCompare(b, "ja");
    });
  }, [safeEvents]);

  const filteredEvents = safeEvents.filter((event) => {
    const isHost = event.organizer && (event.organizer.includes("Cosmo Base") || event.organizer.includes("CosmoBase"));
    const isPartner = event.isPartner === true || String(event.isPartner).toUpperCase() === "TRUE";
    const isExternal = !isHost && !isPartner;

    const hostMatch = 
      hostFilter === "all" || 
      (hostFilter === "host" && isHost) || 
      (hostFilter === "partner" && isPartner) || 
      (hostFilter === "external" && isExternal);
    
    const typeMatch = typeFilter === "all" || event.type === typeFilter
    
    let difficultyMatch = true;
    if (difficultyFilter !== "all") {
      if (event.difficulty === "全レベル") {
        difficultyMatch = true;
      } else if (difficultyFilter === "初心者向け") {
        difficultyMatch = event.difficulty === "初心者向け";
      } else if (difficultyFilter === "中級者向け") {
        difficultyMatch = event.difficulty === "中級者向け" || event.difficulty === "中級者以上向け";
      } else if (difficultyFilter === "上級者向け") {
        difficultyMatch = event.difficulty === "上級者向け" || event.difficulty === "中級者以上向け";
      } else {
        difficultyMatch = event.difficulty === difficultyFilter;
      }
    }
    
    return hostMatch && typeMatch && difficultyMatch
  })

  const SEVEN_DAYS_MS = 6 * 24 * 60 * 60 * 1000;

  const shortTermEvents = filteredEvents.filter(e => {
    if (!e.endDate) return true;
    return (e.endDate.getTime() - e.date.getTime()) < SEVEN_DAYS_MS;
  });

  const longTermEvents = filteredEvents.filter(e => {
    if (!e.endDate) return false;
    return (e.endDate.getTime() - e.date.getTime()) >= SEVEN_DAYS_MS;
  });

  const currentMonthLongTermEvents = longTermEvents.filter(event => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).getTime();
    const eventStart = event.date.getTime();
    const eventEnd = event.endDate!.getTime();
    return eventStart <= monthEnd && eventEnd >= monthStart;
  }).sort((a, b) => {
    const aScore = (a.organizer && (a.organizer.includes("Cosmo Base") || a.organizer.includes("CosmoBase"))) ? 2 : (a.isPartner ? 1 : 0);
    const bScore = (b.organizer && (b.organizer.includes("Cosmo Base") || b.organizer.includes("CosmoBase"))) ? 2 : (b.isPartner ? 1 : 0);
    return bScore - aScore; 
  });

  const getItemsForDay = (date: Date | null) => {
    if (!date) return { dayLaunches: [], dayEvents: [] }
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    const dayLaunches = (launches || []).filter(launch => {
      const lDate = getSafeDate(launch.date);
      const launchDateTime = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate()).getTime();
      return checkDate === launchDateTime;
    });

    const dayEvents = shortTermEvents.filter((event) => {
      const eventStart = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate()).getTime();
      const eventEnd = event.endDate 
        ? new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate()).getTime()
        : eventStart;
      return checkDate >= eventStart && checkDate <= eventEnd;
    });

    const sortedEvents = dayEvents.sort((a, b) => {
      const aScore = (a.organizer && (a.organizer.includes("Cosmo Base") || a.organizer.includes("CosmoBase"))) ? 2 : (a.isPartner ? 1 : 0);
      const bScore = (b.organizer && (b.organizer.includes("Cosmo Base") || b.organizer.includes("CosmoBase"))) ? 2 : (b.isPartner ? 1 : 0);
      return bScore - aScore; 
    });

    return { dayLaunches, dayEvents: sortedEvents };
  }

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]
  const MAX_EVENTS_PER_DAY = 3;

  return (
    <>
      {/* ★ 修正: ご要望通り上部にあったナビゲーションボタン（トップ、カレンダー等）のブロックを削除しました */}

      <GlassCard className="mb-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">種別:</span>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">難易度:</span>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[150px] bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="初心者向け">初心者向け</SelectItem>
                  <SelectItem value="中級者向け">中級者向け</SelectItem>
                  <SelectItem value="上級者向け">上級者向け</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="inline-flex bg-secondary/30 border border-border/50 rounded-lg p-1">
            <button onClick={() => setHostFilter("all")} className={`px-4 py-2 rounded-md text-sm transition-colors ${hostFilter === "all" ? "bg-primary/20 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>すべて</button>
            <button onClick={() => setHostFilter("host")} className={`px-4 py-2 rounded-md text-sm transition-colors ${hostFilter === "host" ? "bg-primary/20 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>主催</button>
            <button onClick={() => setHostFilter("partner")} className={`px-4 py-2 rounded-md text-sm transition-colors ${hostFilter === "partner" ? "bg-accent/20 text-accent font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>パートナー</button>
            <button onClick={() => setHostFilter("external")} className={`px-4 py-2 rounded-md text-sm transition-colors ${hostFilter === "external" ? "bg-secondary text-foreground font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>外部</button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={previousMonth} variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><ChevronLeft className="h-6 w-6" /></Button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</h2>
          <Button onClick={nextMonth} variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><ChevronRight className="h-6 w-6" /></Button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {weekDays.map((day, index) => (
            <div key={day} className={`text-center py-2 text-xs sm:text-sm font-bold ${index === 0 ? "text-destructive" : index === 6 ? "text-blue-400" : "text-muted-foreground"}`}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, index) => {
            const { dayLaunches, dayEvents } = getItemsForDay(day)
            const allItems = [...dayLaunches, ...dayEvents] 
            const isToday = day && today && day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()
            const displayItems = allItems.slice(0, MAX_EVENTS_PER_DAY);
            const hasMore = allItems.length > MAX_EVENTS_PER_DAY;

            return (
              <div
                key={index}
                className={`min-h-[90px] sm:min-h-[130px] p-1 sm:p-2 rounded-lg border flex flex-col transition-colors ${
                  day ? (isToday ? "bg-primary/10 border-primary/50" : "bg-secondary/20 border-border/40 hover:border-primary/30") : "bg-transparent border-transparent"
                }`}
              >
                {day && (
                  <>
                    <div className={`text-right mb-1 text-xs sm:text-sm font-medium ${index % 7 === 0 ? "text-destructive" : index % 7 === 6 ? "text-blue-400" : "text-foreground"}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1 flex-grow overflow-hidden flex flex-col justify-between">
                      <div className="space-y-1">
                        {displayItems.map((item) => {
                          if (isLaunch(item)) {
                            return (
                              <button
                                key={item.id}
                                onClick={() => setSelectedEvent(item)}
                                className="w-full text-left text-[10px] sm:text-xs p-1 sm:p-1.5 rounded truncate bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-l-2 border-orange-500 transition-colors block"
                                title={item.title}
                              >
                                🚀 {item.title}
                              </button>
                            );
                          }

                          const event = item as ParsedSpaceEvent;
                          const isHostEvent = event.organizer && (event.organizer.includes("Cosmo Base") || event.organizer.includes("CosmoBase"));
                          const isPartnerEvent = event.isPartner === true || String(event.isPartner).toUpperCase() === "TRUE";
                          
                          let buttonClass = "bg-secondary/50 hover:bg-secondary border-l-2 border-muted-foreground text-foreground"; 
                          if (isHostEvent) {
                            buttonClass = "bg-primary/10 hover:bg-primary/20 border-l-2 border-primary text-primary-foreground"; 
                          } else if (isPartnerEvent) {
                            buttonClass = "bg-accent/10 hover:bg-accent/20 border-l-2 border-accent text-accent-foreground"; 
                        }
                        
                        return (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event as CalendarItem)}
                            className={`w-full text-left text-[10px] sm:text-xs p-1 sm:p-1.5 rounded truncate transition-colors block ${buttonClass}`}
                            title={event.title}
                          >
                            {event.title}
                          </button>
                        );
                      })}
                      </div>

                      {/* ★ 修正: 埋もれていたイベントをすべて見るための「＋他〇件」表示ボタン */}
                      {hasMore && (
                        <button 
                          onClick={() => setSelectedDayItems({ date: day, items: allItems })}
                          className="w-full text-center text-[10px] sm:text-xs font-bold py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors mt-1 block shrink-0"
                        >
                          ＋他{allItems.length - MAX_EVENTS_PER_DAY}件
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* 長期イベント */}
      {currentMonthLongTermEvents.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            今月の長期開催イベント（展示・企画など）
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {currentMonthLongTermEvents.map((event) => {
              const isHostEvent = event.organizer && (event.organizer.includes("Cosmo Base") || event.organizer.includes("CosmoBase"));
              const isPartnerEvent = event.isPartner === true || String(event.isPartner).toUpperCase() === "TRUE";
              
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event as CalendarItem)}
                  className="text-left p-0 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
                >
                  <GlassCard className={`h-full flex flex-col gap-2 ${isHostEvent ? 'border-primary/40 bg-primary/5' : isPartnerEvent ? 'border-accent/40 bg-accent/5' : 'hover:bg-secondary/40'}`}>
                    <div className="flex flex-wrap gap-2">
                      {isHostEvent ? (
                        <TagBadge variant="primary">主催イベント</TagBadge>
                      ) : isPartnerEvent ? (
                        <TagBadge variant="accent">パートナー</TagBadge>
                      ) : null}
                      <TagBadge>{event.type}</TagBadge>
                    </div>
                    <h4 className="text-foreground font-bold leading-tight mt-1">{event.title}</h4>
                    <div className="text-muted-foreground text-xs flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                        {event.date.getMonth() + 1}/{event.date.getDate()} 〜 {event.endDate!.getMonth() + 1}/{event.endDate!.getDate()}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </GlassCard>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ★ 新設: 「＋他〇件」を押したときに開くその日の全イベント一覧リストモーダル */}
      {selectedDayItems && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-secondary/30 backdrop-blur-xl border border-border/50 rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 flex flex-col h-full min-h-0">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {selectedDayItems.date.getMonth() + 1}月{selectedDayItems.date.getDate()}日のイベント一覧 ({selectedDayItems.items.length}件)
                </h3>
                <Button onClick={() => setSelectedDayItems(null)} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {selectedDayItems.items.map((item) => {
                  const isRocket = isLaunch(item);
                  let badgeText = "外部イベント";
                  let badgeVariant: "primary" | "accent" | "default" = "default";
                  
                  if (isRocket) {
                    badgeText = "ロケット打ち上げ";
                  } else {
                    const isHost = item.organizer && (item.organizer.includes("Cosmo Base") || item.organizer.includes("CosmoBase"));
                    const isPartner = item.isPartner === true || String(item.isPartner).toUpperCase() === "TRUE";
                    if (isHost) {
                      badgeText = "主催イベント";
                      badgeVariant = "primary";
                    } else if (isPartner) {
                      badgeText = "パートナー";
                      badgeVariant = "accent";
                    }
                  }

                  return (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setSelectedEvent(item);
                        setSelectedDayItems(null); // 一覧モーダルは閉じて詳細を開く
                      }}
                      className="p-3 rounded-xl border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer bg-background/40 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2">
                        {isRocket ? (
                          <TagBadge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px]">🚀 {badgeText}</TagBadge>
                        ) : (
                          <TagBadge variant={badgeVariant}>{badgeText}</TagBadge>
                        )}
                        {item.time && <TagBadge className="bg-secondary/80 text-[10px] text-muted-foreground">{item.time}</TagBadge>}
                      </div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-2 mt-0.5">{item.title}</h4>
                      {item.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-primary shrink-0" /> {item.location}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* イベント詳細・ロケット詳細モーダル */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-secondary/30 backdrop-blur-xl border border-border/50 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {isLaunch(selectedEvent) ? (
                      <TagBadge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">ロケット打ち上げ</TagBadge>
                    ) : (
                      <>
                        {selectedEvent.organizer && (selectedEvent.organizer.includes("Cosmo Base") || selectedEvent.organizer.includes("CosmoBase")) ? (
                          <TagBadge variant="primary">主催イベント</TagBadge>
                        ) : selectedEvent.isPartner === true || String(selectedEvent.isPartner).toUpperCase() === "TRUE" ? (
                          <TagBadge variant="accent">パートナーイベント</TagBadge>
                        ) : null}
                        <TagBadge>{selectedEvent.type}</TagBadge>
                        <TagBadge className="bg-secondary/80">{selectedEvent.difficulty}</TagBadge>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground pr-8 leading-tight">{selectedEvent.title}</h2>
                </div>
                <Button onClick={() => setSelectedEvent(null)} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 shrink-0 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4 mb-8 bg-background/40 p-4 rounded-xl border border-border/30">
                <div className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary/20 rounded-lg shrink-0"><Calendar className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium text-sm sm:text-base">
                    {getSafeDate(selectedEvent.date).getFullYear()}年
                    {getSafeDate(selectedEvent.date).getMonth() + 1}月
                    {getSafeDate(selectedEvent.date).getDate()}日
                    
                    {!isLaunch(selectedEvent) && selectedEvent.endDate && (
                      getSafeDate(selectedEvent.endDate).getTime() !== getSafeDate(selectedEvent.date).getTime()
                    ) && (
                      <> 〜 {getSafeDate(selectedEvent.endDate).getFullYear()}年
                           {getSafeDate(selectedEvent.endDate).getMonth() + 1}月
                           {getSafeDate(selectedEvent.endDate).getDate()}日</>
                    )}
                    {" "}{selectedEvent.time}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary/20 rounded-lg shrink-0"><MapPin className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium text-sm sm:text-base">{selectedEvent.location}</span>
                </div>

                {isLaunch(selectedEvent) ? (
                  <>
                    {selectedEvent.rocket && (
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-orange-500/20 rounded-lg shrink-0"><Rocket className="h-4 w-4 text-orange-400" /></div>
                        <span className="font-medium text-sm sm:text-base">機体: {selectedEvent.rocket}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {Number(selectedEvent.capacity) > 0 && (
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-primary/20 rounded-lg shrink-0"><Users className="h-4 w-4 text-primary" /></div>
                        <span className="font-medium text-sm sm:text-base">定員: {selectedEvent.capacity}名</span>
                      </div>
                    )}

                    {selectedEvent.speaker && (
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 bg-primary/20 rounded-lg shrink-0"><Award className="h-4 w-4 text-primary" /></div>
                        <span className="font-medium text-sm sm:text-base">講師: {selectedEvent.speaker}</span>
                      </div>
                    )}

                    {selectedEvent.organizer && (
                      <div className="text-muted-foreground text-sm pt-2 border-t border-border/30 mt-2">
                        主催: {selectedEvent.organizer}
                      </div>
                    )}
                  </>
                )}
              </div>

              {selectedEvent.description && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">イベント詳細</h3>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/50 bg-background/50 rounded-b-2xl flex gap-3">
              {isLaunch(selectedEvent) ? (
                <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-12">
                  <a href={selectedEvent.link || "#"} target="_blank" rel="noopener noreferrer">
                    打ち上げ詳細を見る <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              ) : (
                <Link href={`/CBED/${selectedEvent.id}`} className="flex-1" onClick={() => setSelectedEvent(null)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 glow">
                    このイベントの詳細ページへ
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}