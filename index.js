import { config } from "dotenv";
config();
import fetchPages from "./src/fetchPages.js";
import postToDiscord from "./src/postToDiscord.js";

const endpoint = process.env.ENDPOINT;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const token = process.env.BEARER_TOKEN;

// メインの関数
async function main() {
  // 実行時引数を取得（日数）。引数がない場合は1をセット
  const argument = process.argv[2] || "1";

  const daysAgo = parseInt(argument, 10);

  console.log(`Fetching pages updated in the last ${daysAgo} days...`);

  // 現在の日付から引数で指定された日数を引く
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  console.log(`Fetching pages updated since ${date.toLocaleDateString()}...`);

  // 日付をISO形式に変換
  const fetchPagesFrom = date.toISOString();
  const pages = await fetchPages(fetchPagesFrom, endpoint, token);

  // pagesが空であればプログラムを終了
  if (pages.length === 0) {
    console.log("No pages to post. Exiting...");
    process.exit(0);
  }

  await postToDiscord(pages, discordWebhookUrl);
}

// メイン関数を呼び出す
main().catch((error) => console.error(`Error: ${error}`));
