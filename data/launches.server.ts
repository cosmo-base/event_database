// data/launches.server.ts
//
// サーバー専用（"use client" なファイルから import しないこと）。node:fs を使うため、
// クライアントバンドルに混ざるとビルドエラーになる。考え方は data/CBED.server.ts と同じ。
import { readFileSync } from "node:fs";
import path from "node:path";
import { fetchLaunchesData, parseLaunchesCsv, type LaunchEvent } from "./launches";

const SNAPSHOT_PATH = path.join(process.cwd(), ".build-cache", "launches.csv");

let cached: Promise<LaunchEvent[]> | null = null;

export function fetchLaunchesDataForBuild(): Promise<LaunchEvent[]> {
  if (!cached) {
    cached = (async () => {
      try {
        const text = readFileSync(SNAPSHOT_PATH, "utf-8");
        const events = parseLaunchesCsv(text);
        console.log(`✅ launches.server.ts: ビルド前スナップショットを使用（取得件数: ${events.length} 件）`);
        return events;
      } catch {
        return fetchLaunchesData();
      }
    })();
  }
  return cached;
}
