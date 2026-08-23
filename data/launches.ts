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
  const CSV_URL = process.env.NEXT_PUBLIC_LAUNCHES_CSV_URL ?? '';
  const BUILD_TIMESTAMP = Date.now();
  
  try {
    const cacheBusterUrl = `${CSV_URL}&_t=${BUILD_TIMESTAMP}`;
    const res = await fetch(cacheBusterUrl);
    
    if (!res.ok) {
      console.error('ロケット打ち上げCSVの取得に失敗しました');
      return [];
    }

    const fileContent = await res.text();
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