import fetch from "node-fetch";

// Discordにデータを投稿
async function postToDiscord(pages, discordWebhookUrl) {
  const formattedResult = pages
    .map((page) => {
      return `**${page.title}** - ${page.path}`;
    })
    .join("\n");

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

export default postToDiscord;
