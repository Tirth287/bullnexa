import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore(
      "bullnexa-market-radar"
    );

    const data = await store.get(
      "latest",
      {
        type: "json",
        consistency: "strong"
      }
    );

    if (
      !data ||
      !Array.isArray(data.stocks) ||
      data.stocks.length === 0
    ) {
      return Response.json(
        {
          error:
            "Market Radar data has not been initialized yet."
        },
        { status: 503 }
      );
    }

    return Response.json(
      data,
      {
        headers: {
          "Cache-Control":
            "public, max-age=60",
          "Netlify-CDN-Cache-Control":
            "public, s-maxage=300"
        }
      }
    );

  } catch (error) {
    console.error(
      "Bullnexa Market Radar read error:",
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
