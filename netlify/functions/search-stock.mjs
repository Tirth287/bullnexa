export default async (request) => {
  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") || "").trim();

    if (query.length < 2) {
      return Response.json({ matches: [] });
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Stock search API is not configured." },
        { status: 500 }
      );
    }

    const apiUrl = new URL("https://www.alphavantage.co/query");
    apiUrl.searchParams.set("function", "SYMBOL_SEARCH");
    apiUrl.searchParams.set("keywords", query);
    apiUrl.searchParams.set("apikey", apiKey);

    const response = await fetch(apiUrl);
    const data = await response.json();

    const matches = (data.bestMatches || []).slice(0, 8).map((stock) => ({
      symbol: stock["1. symbol"],
      name: stock["2. name"],
      type: stock["3. type"],
      region: stock["4. region"],
      currency: stock["8. currency"]
    }));

    return Response.json({ matches });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to search stocks right now." },
      { status: 500 }
    );
  }
};

export const config = {
  path: "/api/search-stock"
};
