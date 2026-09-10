export default async (request) => {
  try {
    const url = new URL(request.url);
    const symbol = (url.searchParams.get("symbol") || "").trim();

    if (!symbol) {
      return Response.json(
        { error: "Stock symbol is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Stock API is not configured." },
        { status: 500 }
      );
    }

    const apiUrl = new URL("https://www.alphavantage.co/query");

    apiUrl.searchParams.set("function", "GLOBAL_QUOTE");
    apiUrl.searchParams.set("symbol", symbol);
    apiUrl.searchParams.set("apikey", apiKey);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.Note || data.Information) {
      return Response.json(
        {
          error:
            data.Note ||
            data.Information ||
            "Stock data request limit reached."
        },
        { status: 429 }
      );
    }

    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return Response.json(
        { error: "Price data is not available for this stock." },
        { status: 404 }
      );
    }

    return Response.json({
      symbol: quote["01. symbol"],
      open: quote["02. open"],
      high: quote["03. high"],
      low: quote["04. low"],
      price: quote["05. price"],
      volume: quote["06. volume"],
      latestTradingDay: quote["07. latest trading day"],
      previousClose: quote["08. previous close"],
      change: quote["09. change"],
      changePercent: quote["10. change percent"]
    });

  } catch (error) {
    console.error("Stock quote error:", error);

    return Response.json(
      { error: "Unable to load stock price right now." },
      { status: 500 }
    );
  }
};

export const config = {
  path: "/api/stock-quote"
};
