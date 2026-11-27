// scripts/fetch-build-data.mjs
//
// next build は generateStaticParams・generateMetadata・ページ本体をそれぞれ
// 別プロセス（データ収集フェーズ／ページ生成フェーズ）で実行するため、
// data/CBED.ts 側で1プロセス内だけメモ化しても、フェーズをまたいで公開CSVを
// 取得し直すと「取得のたびに件数が変わる」レースが起こり得る
// （公開CSVには反映まで約5分のラグがあるため）。
//
// そこで next build の前に一度だけCSVを取得してファイルに保存し、
// ビルド中はそのスナップショットだけを読むことで、プロセスをまたいでも
// 1ビルド＝1スナップショットを保証する。
//
// 失敗した場合はファイルを作らず、data/CBED.ts 側の従来のフォールバック
// （ビルド用URL→公開CSVをその場で取得）に任せる。
//
// 「取得できた」かどうかは、生のCSV行数ではなく実際に使うパーサー
// （parseCSV / parseLaunchesCsv）でパースした結果の件数で判定する。
// ビルド用URL（管理画面のGAS）が意図と違うシート・形式のCSVを返して
// きた場合（列名が id/title を含まない等）、行数はあってもパース結果が
// 0件になるので、それを「失敗」として扱い公開CSVにフォールバックする。
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseCSV } from "../data/CBED.ts";
import { parseLaunchesCsv } from "../data/launches.ts";

const OUT_DIR = path.join(process.cwd(), ".build-cache");

async function fetchCsv(urls, parse) {
  for (const url of urls) {
    if (!url) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parse(text);
      if (parsed.length === 0) throw new Error("パース結果が0件でした（想定と異なるCSV形式の可能性があります）");
      return { text, count: parsed.length };
    } catch (error) {
      console.error(`fetch-build-data: 取得失敗 (${url}):`, error.message ?? error);
    }
  }
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const cbed = await fetchCsv(
    [process.env.CBED_BUILD_CSV_URL, process.env.NEXT_PUBLIC_CBED_CSV_URL],
    parseCSV,
  );
  if (cbed) {
    writeFileSync(path.join(OUT_DIR, "cbed.csv"), cbed.text, "utf-8");
    console.log(`fetch-build-data: CBEDスナップショットを保存しました（${cbed.count} 件）`);
  } else {
    console.error("fetch-build-data: CBEDスナップショットの取得に失敗しました（ビルド時はその場で取得し直します）");
  }

  const launches = await fetchCsv(
    [process.env.LAUNCHES_BUILD_CSV_URL, process.env.NEXT_PUBLIC_LAUNCHES_CSV_URL],
    parseLaunchesCsv,
  );
  if (launches) {
    writeFileSync(path.join(OUT_DIR, "launches.csv"), launches.text, "utf-8");
    console.log(`fetch-build-data: 打ち上げスナップショットを保存しました（${launches.count} 件）`);
  } else {
    console.error("fetch-build-data: 打ち上げスナップショットの取得に失敗しました（ビルド時はその場で取得し直します）");
  }
}

main();
