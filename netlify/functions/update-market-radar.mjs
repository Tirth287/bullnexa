import { getStore } from "@netlify/blobs";

const stocks = [
  {
    symbol: "ANANTRAJ.NS",
    ticker: "ANANTRAJ",
    name: "Anant Raj Ltd"
  },
  {
    symbol: "EXIDEIND.NS",
    ticker: "EXIDEIND",
    name: "Exide Industries Ltd"
  },
  {
    symbol: "NTPCGREEN.NS",
    ticker: "NTPCGREEN",
    name: "NTPC Green Energy Ltd"
  },
  {
    symbol: "GMDCLTD.NS",
    ticker: "GMDCLTD",
    name: "GMDC Ltd"
  }
];

async function loadStock(stock, apiKey, dateFrom, dateTo) {
  try {
    const url =
      `https://api.marketstack.com/v2/eod` +
      `?access_key=${encodeURIComponent(apiKey)}` +
      `&symbols=${encodeURIComponent(stock.symbol)}` +
      `&date_from=${dateFrom}` +
      `&date_to=${dateTo}` +
      `&limit=1000`;

    const response = await fetch(url);
    const data = await response.json();

    if (
      !response.ok ||
      data.error ||
      !Array.isArray(data.data)
    ) {
      console.error(
        `Marketstack error for ${stock.ticker}:`,
        data.error || data
      );

      return null;
    }

    const values = data.data
      .filter(item => {
        const itemSymbol =
          String(item.symbol || "").toUpperCase();

        const ticker =
          stock.ticker.toUpperCase();

        const apiSymbol =
          stock.symbol.toUpperCase();

        return (
          itemSymbol === apiSymbol ||
          itemSymbol === ticker ||
          itemSymbol.startsWith(`${ticker}.`)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );

    if (values.length < 2) {
      console.error(
        `Not enough data for ${stock.ticker}`
      );

      return null;
    }

    const latest = values[0];
    const previous = values[1];

    const price =
      Number(latest.close || 0);

    const previousClose =
      Number(previous.close || 0);

    const volume =
      Number(latest.volume || 0);

    const olderVolumes = values
      .slice(1, 21)
      .map(item =>
        Number(item.volume || 0)
      )
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
        ? (
            (price - previousClose) /
            previousClose
          ) * 100
        : 0;

    const volumeRatio =
      averageVolume > 0
        ? volume / averageVolume
        : 0;

    const highValues = values
      .map(item =>
        Number(item.high || 0)
      )
      .filter(value => value > 0);

    const fiftyTwoWeekHigh =
      highValues.length > 0
        ? Math.max(...highValues)
        : null;

    const distanceFromHigh =
      fiftyTwoWeekHigh &&
      fiftyTwoWeekHigh > 0
        ? (
            (fiftyTwoWeekHigh - price) /
            fiftyTwoWeekHigh
          ) * 100
        : null;

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
      symbol: stock.ticker,
      apiSymbol: stock.symbol,
      name: stock.name,
      price,
      changePercent,
      volume,
      averageVolume,
      volumeRatio,
      fiftyTwoWeekHigh,
      distanceFromHigh,
      signal,
      date: latest.date
    };

  } catch (error) {
    console.error(
      `Error loading ${stock.ticker}:`,
      error
    );

    return null;
  }
}

export default async () => {
  const apiKey =
    process.env.MARKETSTACK_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Marketstack API key is not configured."
      },
      { status: 500 }
    );
  }

  try {
    const todayDate = new Date();

    const oneYearAgo =
      new Date(todayDate);

    oneYearAgo.setFullYear(
      oneYearAgo.getFullYear() - 1
    );

    const dateFrom =
      oneYearAgo
        .toISOString()
        .split("T")[0];

    const dateTo =
      todayDate
        .toISOString()
        .split("T")[0];

    const results =
      await Promise.all(
        stocks.map(stock =>
          loadStock(
            stock,
            apiKey,
            dateFrom,
            dateTo
          )
        )
      );

    const validResults =
      results.filter(Boolean);

    // Important:
    // Do not overwrite saved data unless
    // all 4 stocks loaded successfully.
    if (
      validResults.length !==
      stocks.length
    ) {
      console.error(
        `Only ${validResults.length} of ${stocks.length} stocks loaded.`
      );

      return Response.json(
        {
          error:
            "Not all stocks updated. Previous saved data was preserved."
        },
        { status: 502 }
      );
    }

    const payload = {
      updatedAt:
        new Date().toISOString(),
      market: "NSE",
      stocks: validResults
    };

    const store =
      getStore(
        "bullnexa-market-radar"
      );

    await store.setJSON(
      "latest",
      payload
    );

    console.log(
      "Bullnexa Market Radar updated:",
      payload.updatedAt
    );

    return Response.json({
      success: true,
      updatedAt:
        payload.updatedAt,
      stocksUpdated:
        validResults.length
    });

  } catch (error) {
    console.error(
      "Bullnexa scheduled update error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to update Bullnexa Market Radar."
      },
      { status: 500 }
    );
  }
};

export const config = {
  schedule: "30 3 * * 2-6"
};
