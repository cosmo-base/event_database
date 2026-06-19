// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. イベントデータの型定義
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface SpaceEvent {
  id: string | number;
  title?: string;
  date?: string;
  endDate?: string;
  time?: string;
  location?: string;
  type?: string;
  difficulty?: string;
  organizer?: string;
  isPartner?: boolean | string; 
  capacity?: string | number;
  speaker?: string;
  description?: string;
  link?: string;
  lat?: number;
  lng?: number;
  isRecommend?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2. データの取得先URLの設定（ハードコード）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CBED_SPREADSHEET_BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJU_Qq6TICMIAhDidiH2BYlBcZBvS_Uwy4wth9tT-02RYWkVP_AufdGo0PMAbAyrHKeZrE1x0laETY/pub?gid=0&single=true&output=csv";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. 最強のCSVパーサー（空行スキップ・セル内改行対応）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function parseCSV(csvText: string): SpaceEvent[] {
  const arr: string[][] = [];
  let quote = false;
  let col = 0, row = 0;

  for (let c = 0; c < csvText.length; c++) {
    let cc = csvText[c], nc = csvText[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc; ++c; continue;
    }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { ++col; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc === '\n' && !quote) { ++row; col = 0; continue; }
    if (cc === '\r' && !quote) { ++row; col = 0; continue; }
    arr[row][col] += cc;
  }

  if (arr.length < 2) return [];
  const headers = arr[0].map(h => h.trim());
  const events: SpaceEvent[] = [];

  for (let r = 1; r < arr.length; r++) {
    const rowData = arr[r];
    if (!rowData.some(val => val.trim() !== "")) continue;

    const event: any = {};
    headers.forEach((header, index) => {
      let value = rowData[index] || "";
      value = value.trim();
      
      if (header === "lat" || header === "lng") {
        event[header] = value ? parseFloat(value) : undefined;
      } else if (header === "isRecommend") {
        event[header] = value.toUpperCase() === "TRUE" || value === "1";
      } else if (header === "isPartner") {
        event[header] = value.toUpperCase() === "TRUE" || value === "1" || value;
      } else {
        event[header] = value;
      }
    });

    if (!event.id && !event.title) continue;
    if (!event.id) event.id = `fallback-${r}`;
    event.id = String(event.id).trim();
    events.push(event as SpaceEvent);
  }
  return events;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 4. データの取得処理（1日1回更新の最適化版）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function fetchEventsData(): Promise<SpaceEvent[]> {
  try {
    // ★ next.revalidate を効かせるため、URLは末尾にタイムスタンプを付けず固定します
    const res = await fetch(CBED_SPREADSHEET_BASE_URL, {
      // ★ 86400秒（＝24時間）キャッシュを保持する設定
      next: { revalidate: 86400 } 
    });
    
    if (!res.ok) {
      throw new Error(`CBEDデータ取得失敗: HTTP ${res.status}`);
    }

    const text = await res.text();
    const parsedEvents = parseCSV(text);

    console.log(`✅ CBED.ts: 24時間キャッシュを適用中（取得件数: ${parsedEvents.length} 件）`);
    return parsedEvents;
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return [];
  }
}
