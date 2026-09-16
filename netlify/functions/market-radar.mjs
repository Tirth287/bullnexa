export default async () => {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Market data API key is not configured." },
      { status: 500 }
    );
  }

  const stocks = [
    { symbol: "BIOCON:NSE", name: "Biocon" },
    { symbol: "CONCOR:NSE", name: "Container Corporation of India" },
    { symbol: "HINDCOPPER:NSE", name: "Hindustan Copper" },
    { symbol: "NTPCGREEN:NSE", name: "NTPC Green Energy" },
    { symbol: "DCXINDIA:NSE", name: "DCX Systems" }
  ];

  try {
    const results = await Promise.all(
      stocks.map(async (stock) => {
        const url =
          `https://api.twelvedata.com/time_series` +
          `?symbol=${encodeURIComponent(stock.symbol)}` +
          `&interval=1day` +
          `&outputsize=21` +
          `&apikey=${encodeURIComponent(apiKey)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.status === "error" || !data.values) {
          return {
            symbol: stock.symbol,
            name: stock.name,
            error: data.message || "Data unavailable"
          };
        }

        const values = data.values;

        const latest = values[0];
        const previous = values[1];

        const price = Number(latest.close);
        const previousClose = Number(previous.close);
        const volume = Number(latest.volume || 0);

        const olderVolumes = values
          .slice(1, 21)
          .map(item => Number(item.volume || 0))
          .filter(value => value > 0);

        const averageVolume =
          olderVolumes.length > 0
            ? olderVolumes.reduce((sum, value) => sum + value, 0) /
              olderVolumes.length
            : 0;

        const changePercent =
          previousClose > 0
            ? ((price - previousClose) / previousClose) * 100
            : 0;

        const volumeRatio =
          averageVolume > 0 ? volume / averageVolume : 0;

        let signal = "Normal Activity";

        if (volumeRatio >= 2) {
          signal = "Unusual Volume";
        } else if (changePercent >= 3) {
          signal = "Strong Move";
        } else if (changePercent <= -3) {
          signal = "Sharp Move";
        } else if (volumeRatio >= 1.5) {
          signal = "High Activity";
        }

        return {
          symbol: data.meta?.symbol || stock.symbol,
          name: stock.name,
          price,
          changePercent,
          volume,
          averageVolume,
          volumeRatio,
          signal,
          date: latest.datetime
        };
      })
    );

    return Response.json({
      updatedAt: new Date().toISOString(),
      stocks: results
    });

  } catch (error) {
    console.error("Market Radar error:", error);

    return Response.json(
      { error: "Unable to load market data." },
      { status: 500 }
    );
  }
};
