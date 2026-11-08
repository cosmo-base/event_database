// data/launches.ts
import { parse } from 'csv-parse/sync';

export interface LaunchEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  rocket: string;
  description: string;
  link?: string;
  isLaunch: boolean;
}

export async function fetchLaunchesData(): Promise<LaunchEvent[]> {
  const PUBLIC_CSV_URL = process.env.NEXT_PUBLIC_LAUNCHES_CSV_URL ?? '';
  // ビルド時だけ使う最新データの取得先（data/CBED.ts と同じ考え方）
  const BUILD_CSV_URL = typeof window === 'undefined' ? process.env.LAUNCHES_BUILD_CSV_URL ?? '' : '';
  const BUILD_TIMESTAMP = process.env.GITHUB_RUN_ID || String(Date.now());
  
  try {
    const fetchCsv = async (url: string) => {
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_t=${BUILD_TIMESTAMP}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    };

    let fileContent: string;
    try {
      fileContent = await fetchCsv(BUILD_CSV_URL || PUBLIC_CSV_URL);
    } catch (error) {
      if (!BUILD_CSV_URL) {
        console.error('ロケット打ち上げCSVの取得に失敗しました');
        return [];
      }
      console.error('ロケット打ち上げのビルド用URLから取得できませんでした（公開CSVに切り替えます）:', error);
      fileContent = await fetchCsv(PUBLIC_CSV_URL);
    }
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record: any, index: number) => ({
      id: `launch-${index}`,
      title: record.title || '',
      date: new Date(record.date),
      time: record.time || '',
      location: record.location || '',
      rocket: record.rocket || '',
      description: record.description || '',
      link: record.link || '',
      isLaunch: true, 
    }));
  } catch (error) {
    console.error('CSVパースエラー:', error);
    return [];
  }
}