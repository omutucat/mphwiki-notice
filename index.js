import fetch from "node-fetch";
import { config } from "dotenv";
config();

const endpoint = process.env.ENDPOINT;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

// TODO: 処理当日の前日にする
const yesterday = new Date("2024-01-09").toISOString();

const query = `
  query {
    pages {
      list (orderBy: ID, limit: 10) {
        id
        path
        title
        createdAt
        updatedAt
      }
    }
  }
`;

// GraphQLからデータを取得
async function fetchData(updatedAt) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  });

  const result = await response.json();

  // Filter the data to only include pages with an updatedAt timestamp later than the provided argument
  const filteredData = result.data.pages.list.filter(
    (page) => new Date(page.updatedAt) > new Date(updatedAt)
  );

  return filteredData;
}

// Discordにデータを投稿
async function postToDiscord(pages) {
  const formattedResult = formatApiResult(pages);

  const response = await fetch(discordWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `${formattedResult}`,
    }),
  });

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

function formatApiResult(pages) {
  return pages
    .map((page) => {
      return `**${page.title}** - ${page.path}`;
    })
    .join("\n");
}

// メインの関数
async function main() {
  const pages = await fetchData(yesterday);
  console.log(`${JSON.stringify(pages)}`);
  await postToDiscord(pages);
}

// メイン関数を呼び出す
main().catch((error) => console.error(`Failed to post to Discord: ${error}`));
