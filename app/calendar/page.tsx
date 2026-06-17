// app/CBED/calendar/page.tsx
import { ContentPageLayout } from "@/components/content-page-layout"
import { fetchEventsData } from "@/data/CBED"
import { fetchLaunchesData } from "@/data/launches"
import EventCalendar from "./event-calendar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "イベントカレンダー | Cosmo Base Event Database", 
  description: "宇宙イベントをカレンダー形式でご確認いただけます。",
  openGraph: {
    title: "イベントカレンダー | Cosmo Base",
    description: "宇宙イベントをカレンダー形式でご確認いただけます。",
  },
}

export default async function EventsPage() {
  const [events, launches] = await Promise.all([
    fetchEventsData(),
    fetchLaunchesData().catch(() => []) 
  ]);

  return (
    <ContentPageLayout
      title="Cosmo Base Event Database"
      level={3}
      levelTitle=""
      logo="CBED"
    >
      <div className="min-h-screen relative">
        <main className="relative z-10 pt-8 pb-12 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">イベントカレンダー</h1>
            <p className="text-muted-foreground">全国の宇宙イベントやロケット打ち上げ日程を月別に確認できます</p>
          </div>
          <EventCalendar events={events} launches={launches} />
        </main>
      </div>
    </ContentPageLayout>
  )
}