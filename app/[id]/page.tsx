// app/CBED/[id]/page.tsx
import { Metadata } from "next"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, ArrowLeft, ExternalLink, User, Users, Building, CalendarPlus } from "lucide-react"
import Link from "next/link"
import { fetchEventsData } from "@/data/CBED"
import { notFound } from "next/navigation"

export const dynamicParams = false;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. ページ生成の指示出し
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function generateStaticParams() {
  const events = await fetchEventsData();

  const uniqueIds = new Set<string>();
  const params: { id: string }[] = [];

  events.forEach(event => {
    const idStr = String(event.id).trim();
    if (idStr && !uniqueIds.has(idStr)) {
      uniqueIds.add(idStr);
      params.push({ id: idStr });
    }
  });

  console.log(`\n=========================================`);
  console.log(`🚀 generateStaticParams が ${params.length} ページ分の作成を指示しました！`);
  console.log(`=========================================\n`);

  return params;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2. メタデータ（タブのタイトル）の生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const eventId = decodeURIComponent(resolvedParams.id);

  const allEvents = await fetchEventsData();
  const event = allEvents.find(e => String(e.id).trim() === eventId);

  if (!event) {
    return { title: "イベントが見つかりません" }
  }

  const descriptionText = event.description
    ? event.description.slice(0, 100) + "..."
    : `${event.title}の詳細情報ページです。`;

  return {
    title: `${event.title} | CBED`,
    description: descriptionText,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ Googleカレンダー連携URLの生成ロジック
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getGoogleCalendarUrl(event: any) {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const title = encodeURIComponent(event.title || "宇宙イベント");
  const details = encodeURIComponent((event.description || "") + (event.link ? `\n\n🔗 詳細・申込: ${event.link}` : ""));
  const location = encodeURIComponent(event.location || "");

  let datesParam = "";

  try {
    // 日付の抽出 (YYYY/MM/DD, YYYY-MM-DD などに対応)
    const matchDate = event.date?.match(/(\d{4})[-/年\.]\s*(\d{1,2})[-/月\.]\s*(\d{1,2})/);
    if (matchDate) {
      const y = matchDate[1];
      const m = matchDate[2].padStart(2, '0');
      const d = matchDate[3].padStart(2, '0');
      let startDate = `${y}${m}${d}`;
      let endDate = startDate;

      const matchEndDate = event.endDate?.match(/(\d{4})[-/年\.]\s*(\d{1,2})[-/月\.]\s*(\d{1,2})/);
      if (matchEndDate) {
        const ey = matchEndDate[1];
        const em = matchEndDate[2].padStart(2, '0');
        const ed = matchEndDate[3].padStart(2, '0');
        endDate = `${ey}${em}${ed}`;
      }

      // 時間の抽出 (HH:MM を探し出す)
      const timeMatches = event.time?.match(/(\d{1,2}):(\d{2})/g);
      if (timeMatches && timeMatches.length >= 1) {
        const startT = timeMatches[0].replace(':', '').padStart(4, '0') + "00";
        startDate += `T${startT}`;

        if (timeMatches.length >= 2) {
          const endT = timeMatches[1].replace(':', '').padStart(4, '0') + "00";
          endDate += `T${endT}`;
        } else {
          // 終了時間が記載されていない場合は、仮で1時間後に設定
          const startHour = parseInt(timeMatches[0].split(':')[0], 10);
          const startMin = timeMatches[0].split(':')[1];
          const endHour = String((startHour + 1) % 24).padStart(2, '0');
          endDate += `T${endHour}${startMin}00`;
        }
        datesParam = `&dates=${startDate}/${endDate}&ctz=Asia/Tokyo`;
      } else {
        // 終日イベント処理 (Googleカレンダー仕様: 終了日を翌日にする)
        const endObj = new Date(`${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`);
        endObj.setDate(endObj.getDate() + 1);
        const nextDay = `${endObj.getFullYear()}${String(endObj.getMonth() + 1).padStart(2, '0')}${String(endObj.getDate()).padStart(2, '0')}`;
        datesParam = `&dates=${startDate}/${nextDay}`;
      }
    }
  } catch (e) {
    // パース失敗時でも、タイトルや詳細は引き継いでGoogleカレンダーを開かせる
  }

  return `${baseUrl}&text=${title}&details=${details}&location=${location}${datesParam}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. ページ本体の表示
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = decodeURIComponent(resolvedParams.id);

  const allEvents = await fetchEventsData()
  const event = allEvents.find(e => String(e.id).trim() === eventId)

  if (!event) {
    notFound()
  }

  const isCosmoBaseEvent = event.organizer
    ? String(event.organizer).replace(/\s+/g, "").toLowerCase().includes("cosmobase")
    : false
  const isPartnerEvent = Boolean(event.isPartner && String(event.isPartner).toUpperCase() === "TRUE")

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
    <ContentPageLayout title="イベント詳細" level={3} levelTitle="" logo="CBED">
      <div className="mb-6">
        <Link href="/CBED/search">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="glass-card rounded-xl p-6 md:p-8 max-w-3xl mx-auto border border-border/50">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${orgStyle}`}>
              {orgLabel}
            </span>

            {event.type && String(event.type).split(',').map((t, idx) => (
              <span key={idx} className="px-3 py-1 text-xs font-medium rounded-full bg-accent/20 text-accent border border-accent/30">
                {t.trim()}
              </span>
            ))}
            {event.difficulty && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary border border-border/50 text-foreground">
                {event.difficulty}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
            {event.title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-foreground bg-secondary/30 p-5 rounded-lg border border-border/50">
            {event.date && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <span>{event.endDate ? `${event.date} 〜 ${event.endDate}` : event.date}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="whitespace-pre-wrap leading-relaxed">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>定員: {event.capacity}</span>
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>登壇: {event.speaker}</span>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>主催: {event.organizer}</span>
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none mb-10">
            <h3 className="text-lg font-semibold border-b border-border/50 pb-2 mb-4">イベントについて</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6 border-t border-border/50">
          {event.link && (
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex-1 sm:min-w-[200px]">
              <Button className="w-full bg-primary/80 hover:bg-primary/70 text-primary-foreground font-bold">
                詳細・申し込み
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          )}

          {event.date && (
            <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="flex-1 sm:min-w-[200px]">
              <Button variant="outline" className="w-full font-bold border-accent/50 text-accent hover:bg-accent/10">
                Googleカレンダーに追加
                <CalendarPlus className="w-4 h-4 ml-2" />
              </Button>
            </a>
          )}

          {event.location && (
            <a
              href={
                event.lat && event.lng
                  // 座標と施設名の両方がある場合: 座標付近で施設名検索
                  ? `https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&ll=${event.lat},${event.lng}&z=16`
                  // 施設名（住所）しかない場合: シンプルなテキスト検索
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:min-w-[200px]"
            >
              <Button variant="outline" className="w-full font-bold">
                Googleマップで開く
                <MapPin className="w-4 h-4 ml-2" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </ContentPageLayout>
  )
}