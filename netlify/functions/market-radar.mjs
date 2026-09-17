export default async () => {
  const apiKey = process.env.MARKETSTACK_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Marketstack API key is not configured." },
      { status: 500 }
    );
  }

  const stock = {
    symbol: "BIOCON.NS",
    ticker: "BIOCON",
    name: "Biocon Ltd"
  };

  try {
    const url =
      `https://api.marketstack.com/v2/eod` +
      `?access_key=${encodeURIComponent(apiKey)}` +
      `&symbols=${encodeURIComponent(stock.symbol)}` +
      `&limit=21`;

    const response = await fetch(url);
    const data = await response.json();

    if (
      !response.ok ||
      data.error ||
      !Array.isArray(data.data) ||
      data.data.length < 2
    ) {
      return Response.json(
        {
          error:
            data.error?.message ||
            "Market data unavailable.",
          raw: data
        },
        { status: 500 }
      );
    }

    const values = [...data.data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

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
        ? olderVolumes.reduce(
            (sum, value) => sum + value,
            0
          ) / olderVolumes.length
        : 0;

    const changePercent =
      previousClose > 0
        ? ((price - previousClose) /
            previousClose) *
          100
        : 0;

    const volumeRatio =
      averageVolume > 0
        ? volume / averageVolume
        : 0;

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

    return Response.json({
      updatedAt: new Date().toISOString(),
      market: "NSE",
      stocks: [
        {
          symbol: stock.ticker,
          apiSymbol: stock.symbol,
          name: stock.name,
          price,
          changePercent,
          volume,
          averageVolume,
          volumeRatio,
          signal,
          date: latest.date
        }
      ]
    });

  } catch (error) {
    console.error(
      "Bullnexa Market Radar error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to load Bullnexa Market Radar."
      },
      { status: 500 }
    );
  }
};
