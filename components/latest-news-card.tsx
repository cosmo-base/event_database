// components/latest-news-card.tsx
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// CBLのデータスプレッドシートURL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiWVQ_iCVoOVIzzsR28wnfaWqniBFolkDs3uOn_kMcquNmiVqg1ZVV_BGjlIfsyCQlRemOXeoL4Mhw/pub?gid=0&single=true&output=csv';
const BUILD_TIMESTAMP = Date.now();

interface CBLDocument {
  id: string;
  title: string;
  image: string;
  date: string;
  summary: string;
  url: string;
  parsedDate: Date;
}

// サーバー側でCSVを取得・解析する関数
async function fetchLatestNews(): Promise<CBLDocument | null> {
  try {
    const res = await fetch(`${CSV_URL}&_t=${BUILD_TIMESTAMP}`);
    if (!res.ok) return null;
    
    const csvText = await res.text();
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const docs: CBLDocument[] = [];

    // 2行目以降のデータを処理
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const currentline = [];
      let currentVal = '';
      let insideQuotes = false;

      for (const char of lines[i]) {
        if (char === '"' && !insideQuotes) {
          insideQuotes = true;
        } else if (char === '"' && insideQuotes) {
          insideQuotes = false;
        } else if (char === ',' && !insideQuotes) {
          currentline.push(currentVal);
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      currentline.push(currentVal);

      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j] ? currentline[j].trim() : "";
      }
      
      if (!obj.id && !obj.title) continue;
      if (obj.type !== '週刊ニュース') continue;

      docs.push({
        id: obj.id,
        title: obj.title,
        image: obj.image,
        date: obj.date,
        summary: obj.summary,
        url: obj.url,
        parsedDate: new Date(obj.date)
      });
    }

    // 日付の新しい順（降順）にソート
    docs.sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

    // 一番最新のものを返す
    return docs.length > 0 ? docs[0] : null;

  } catch (error) {
    console.error("Latest news fetch error:", error);
    return null;
  }
}

export async function LatestNewsCard() {
  const news = await fetchLatestNews();
  
  if (!news) return null; 

  const imageUrl = news.image 
    ? `https://cosmo-base.github.io/library/img/${news.image}` 
    : 'https://cosmo-base.github.io/library/img/CBnews.png';

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-8 group border border-primary/30 shadow-lg shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col">
        {/* 画像エリア：フル幅で比率を完全に維持し、切り取られないように表示 */}
        <div className="w-full relative aspect-video overflow-hidden bg-[#090a0f] border-b border-border/50">
          <img 
            src={imageUrl} 
            alt={news.title}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
          {/* 画像下部のフェードグラデーションでテキストエリアと自然に馴染ませる */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
        
        {/* コンテンツエリア */}
        <div className="p-6 md:p-8 flex flex-col relative z-10 -mt-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold tracking-wider rounded-full bg-primary/20 text-primary border border-primary/30 glow-sm backdrop-blur-md">
              LATEST ISSUE
            </span>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md backdrop-blur-md">
              <Calendar className="w-4 h-4 text-primary/70" />
              {news.date} 発行
            </span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          
          <p className="text-muted-foreground mb-6 line-clamp-3 text-sm md:text-base leading-relaxed">
            {news.summary}
          </p>
          
          <div>
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow group/btn h-12 px-8 rounded-full font-bold w-full sm:w-auto">
                最新ニュースを読む
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}