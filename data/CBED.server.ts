// data/CBED.server.ts
//
// サーバー専用（"use client" なファイルから import しないこと）。node:fs を使うため、
// クライアントバンドルに混ざるとビルドエラーになる。
//
// next build は generateStaticParams・generateMetadata・ページ本体をそれぞれ別の
// プロセス（データ収集フェーズ／ページ生成フェーズ）で実行するため、data/CBED.ts
// 側のプロセス内メモ化だけではフェーズをまたいだ取得し直しを防げず、公開CSVの
// 反映ラグ（最大5分）と重なると呼び出しごとに件数が変わってしまう。
//
// scripts/fetch-build-data.mjs が next build の前に一度だけCSVを取得して
// .build-cache/cbed.csv に保存しておき、ビルド中はプロセスを問わずそのスナップ
// ショットだけを読むことで、1ビルド＝1スナップショットを保証する。
// スナップショットが無い場合（ローカル開発など）は従来通りその場で取得する。
import { readFileSync } from "node:fs";
import path from "node:path";
import { fetchEventsData, parseCSV, type SpaceEvent } from "./CBED";

const SNAPSHOT_PATH = path.join(process.cwd(), ".build-cache", "cbed.csv");

let cached: Promise<SpaceEvent[]> | null = null;

export function fetchEventsDataForBuild(): Promise<SpaceEvent[]> {
  if (!cached) {
    cached = (async () => {
      try {
        const text = readFileSync(SNAPSHOT_PATH, "utf-8");
        const events = parseCSV(text);
        console.log(`✅ CBED.server.ts: ビルド前スナップショットを使用（取得件数: ${events.length} 件）`);
        return events;
      } catch {
        return fetchEventsData();
      }
    })();
  }
  return cached;
}
