// app/CBED/map/page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Map as MapIcon, Loader2, ChevronRight } from "lucide-react"
import { fetchEventsData, SpaceEvent } from "@/data/CBED"

const IMPERIAL_PALACE: [number, number] = [35.6852, 139.7528]

// 距離計算の関数
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 過去のイベントかどうかを判定する関数
function isPastEvent(dateStr?: string, endDateStr?: string): boolean {
  // endDateがあればそれを、なければdateを使用
  const targetStr = endDateStr || dateStr;
  if (!targetStr) return false; // 日付情報がないものは念のため表示する

  // YYYY/MM/DD, YYYY-MM-DD, YYYY年MM月DD日 などのフォーマットから年月日を抽出
  const match = targetStr.match(/(\d{4})[-/年\.]\s*(\d{1,2})[-/月\.]\s*(\d{1,2})/);
  if (!match) return false; // パースできない形式も念のため表示する

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JSのDateの月は0始まり
  const day = parseInt(match[3], 10);

  const eventDate = new Date(year, month, day);

  // 今日の日付を取得し、時間を0時0分0秒にリセット
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // イベントの日付が今日より前なら過去と判定
  return eventDate < today;
}

const DynamicMap = dynamic(() => import("@/components/event-map"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-secondary/30 text-muted-foreground min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
      <p>地図を読み込み中...</p>
    </div>
  ),
})

export default function MapSearchPage() {
  const [center, setCenter] = useState<[number, number]>(IMPERIAL_PALACE)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapBounds, setMapBounds] = useState<{ n: number, s: number, e: number, w: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [events, setEvents] = useState<SpaceEvent[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)

  const handleGetLocation = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(loc)
          setCenter(loc)
          setIsLocating(false)
        },
        (error) => {
          alert("現在地を取得できませんでした。ブラウザの位置情報許可を確認してください。")
          setIsLocating(false)
        }
      )
    } else {
      alert("お使いのブラウザは位置情報に対応していません。")
      setIsLocating(false)
    }
  }

  useEffect(() => {
    async function loadEvents() {
      setIsLoadingEvents(true)
      const data = await fetchEventsData()
      // ★ 緯度経度が設定されており、かつ「過去のイベントではない」ものだけを抽出
      const mapEvents = data.filter(
        e => typeof e.lat === 'number' && typeof e.lng === 'number' && !isPastEvent(e.date, e.endDate)
      )
      setEvents(mapEvents)
      setIsLoadingEvents(false)
    }
    loadEvents()
  }, [])

  const visibleEvents = useMemo(() => {
    let filtered = events
    if (mapBounds) {
      filtered = filtered.filter(e =>
        e.lat! <= mapBounds.n && e.lat! >= mapBounds.s &&
        e.lng! <= mapBounds.e && e.lng! >= mapBounds.w
      )
    }
    const referencePoint = userLocation || center
    return filtered.map(event => {
      const distanceKm = calculateDistance(referencePoint[0], referencePoint[1], event.lat!, event.lng!)
      const distanceStr = distanceKm < 1
        ? `${Math.round(distanceKm * 1000)}m`
        : `${distanceKm.toFixed(1)}km`
      return { ...event, distanceKm, distanceStr }
    }).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [events, mapBounds, userLocation, center])

  return (
    <ContentPageLayout title="地図で探す" level={3} levelTitle="" logo="CBED">
      <div className="flex flex-col lg:flex-row gap-6 relative z-20">

        <div className="flex-1 glass-card rounded-xl overflow-hidden flex flex-col h-[450px] md:h-[600px] relative border border-border/50 z-30">
          <div className="absolute top-4 left-4 right-4 z-40 flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-3 pointer-events-none">
            <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-lg border border-border/50 pointer-events-auto shadow-lg w-fit">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <MapIcon className="w-4 h-4 text-primary" />
                全国のイベントマップ
              </h3>
            </div>
            <Button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="pointer-events-auto bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg backdrop-blur-md w-fit"
            >
              <Navigation className={`w-4 h-4 mr-2 ${isLocating ? "animate-pulse" : ""}`} />
              現在地から探す
            </Button>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[400px] z-0">
            {!isLoadingEvents && (
              <DynamicMap
                events={events}
                center={center}
                onBoundsChange={setMapBounds}
              />
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4 z-20">
          <div className="glass-card rounded-xl p-5 h-[500px] md:h-[600px] flex flex-col border border-border/50">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              表示中のイベント ({visibleEvents.length}件)
            </h3>

            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
              {isLoadingEvents ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : visibleEvents.length > 0 ? (
                visibleEvents.map(event => (
                  <Link href={`/CBED/${event.id}`} key={event.id} className="block group">
                    <div className="p-3 rounded-lg border border-border/50 hover:bg-primary/10 transition-colors cursor-pointer relative">
                      <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors pr-5">
                        {event.title}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-muted-foreground absolute right-3 top-3 group-hover:text-primary transition-colors" />

                      <div className="flex flex-col gap-1 text-[11px] text-muted-foreground mt-2">
                        {event.location && (
                          <div className="flex items-center justify-between">
                            <span className="line-clamp-1 mr-2">{event.location}</span>
                            <span className="text-accent font-medium shrink-0">{event.distanceStr}</span>
                          </div>
                        )}
                        {(event.date || event.time) && (
                          <div className="bg-secondary/50 w-fit px-2 py-1 rounded">
                            {event.date} {event.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center mt-10">
                  このエリアにはイベントがありません。<br />地図を移動するか縮小してみてください。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}
