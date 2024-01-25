import fetch from "node-fetch";

// GraphQLからデータを取得
async function fetchPages(fetchFrom, endpoint, token) {
  const query = `
  query {
    pages {
      list (orderBy: ID) {
        id
        path
        title
        createdAt
        updatedAt
      }
    }
  }
`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: query,
    }),
  });

  const result = await response.json();

  // Filter the data to only include pages with an updatedAt timestamp later than the provided argument
  const filteredData = result.data.pages.list.filter(
    (page) => new Date(page.updatedAt) > new Date(fetchFrom)
  );

  return filteredData;
}

export default fetchPages;
