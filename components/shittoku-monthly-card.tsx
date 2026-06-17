// components/shittoku-monthly-card.tsx
import { fetchShittokuData } from "@/data/shittoku"
import { Calendar, Sparkles } from "lucide-react"

export async function ShittokuMonthlyCard() {
  const allEvents = await fetchShittokuData();

  // 日本時間での現在時刻を取得して「今月」を判定
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 今月のイベントかつ、テーマが空欄でないものを抽出
  const thisMonthEvents = allEvents
    .filter(event => 
      event.parsedDate.getFullYear() === currentYear && 
      event.parsedDate.getMonth() === currentMonth &&
      event.theme.trim() !== ""
    )
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  // 今月の予定が1つもない場合は何も表示しない（または代替テキスト）
  if (thisMonthEvents.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* 白背景のカード（ダークテーマの中で目立つように設定） */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,255,255,0.15)] relative overflow-hidden border border-white/20">
        
        {/* 背景の淡い装飾グロウ */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* キャッチコピー */}
          <h3 className="text-center font-extrabold text-lg sm:text-xl text-slate-800 mb-6 tracking-tight flex items-center justify-center gap-2">
            <span className="text-2xl">🚀</span>
            毎週水曜日はCosmo Baseに集合
            <span className="text-2xl">🌠</span>
          </h3>
          
          {/* 今月のスケジュールリスト */}
          <div className="w-full bg-slate-50/80 backdrop-blur-sm rounded-2xl p-5 sm:p-7 border border-slate-200/60 shadow-inner">
            <div className="flex items-center gap-2 mb-5 text-slate-800 font-bold border-b border-slate-200 pb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-lg">{currentMonth + 1}月のテーマ</span>
              <Sparkles className="w-4 h-4 text-accent ml-auto animate-pulse" />
            </div>
            
            <ul className="space-y-4">
              {thisMonthEvents.map((event, index) => (
                <li key={index} className="flex items-start gap-4 sm:gap-6 group">
                  <div className="font-bold text-primary shrink-0 w-12 sm:w-14 text-right pt-0.5 text-lg">
                    {event.month}/{event.day}
                  </div>
                  <div className="text-slate-700 font-bold text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">
                    {event.theme}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}