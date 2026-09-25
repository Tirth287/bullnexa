<script>
  const params =
    new URLSearchParams(window.location.search);

  const symbol =
    params.get("symbol") || "Stock";

  const name =
    params.get("name") || "Company";

  const region =
    params.get("region") || "";

  const currency =
    params.get("currency") || "";

  const type =
    params.get("type") || "";


  document.getElementById("stockSymbol")
    .textContent = symbol;

  document.getElementById("stockName")
    .textContent = name;


  const meta =
    [region, currency, type]
      .filter(Boolean)
      .join(" • ");


  document.getElementById("stockMeta")
    .textContent = meta;


  document.title =
    `${name} | Bullnexa Research`;


  // ----------------------------
  // Bullnexa Research Coverage
  // ----------------------------

  const coveredCompanies = [
    "bliss gvs",
    "hindustan copper",
    "biocon",
    "indosolar",
    "morepen",
    "cesc",
    "nmdc",
    "ashok leyland",
    "apollo micro",
    "finolex industries",
    "bhagyanagar india",
    "himadri"
  ];

  const normalizedName =
    name.toLowerCase();

  const isCovered =
    coveredCompanies.some(company =>
      normalizedName.includes(company)
    );


  const researchStatus =
    document.getElementById("researchStatus");

  const researchStatusText =
    document.getElementById("researchStatusText");


  if (isCovered) {
    researchStatus.textContent =
      "In Research";

    researchStatusText.textContent =
      "This company is currently part of the Bullnexa Research Watchlist.";
  } else {
    researchStatus.textContent =
      "Not Currently Covered";

    researchStatusText.textContent =
      "Market information is available, but a Bullnexa research note has not yet been published for this company.";
  }


  // ----------------------------
  // Stock Market Data
  // ----------------------------

  async function loadStockQuote() {
    const stockPrice =
      document.getElementById("stockPrice");

    const stockChange =
      document.getElementById("stockChange");

    const stockVolume =
      document.getElementById("stockVolume");

    try {
      const response = await fetch(
        `/api/stock-quote?symbol=${encodeURIComponent(symbol)}`
      );

      const data =
        await response.json();


      if (!response.ok || data.error) {
        throw new Error(
          data.error ||
          "Market data is unavailable."
        );
      }


      const price =
        Number(data.price);

      if (Number.isFinite(price)) {
        stockPrice.textContent =
          currency
            ? `${currency} ${price.toFixed(2)}`
            : price.toFixed(2);
      } else {
        stockPrice.textContent =
          "Data unavailable";
      }


      const changePercent =
        parseFloat(
          String(
            data.changePercent || "0"
          ).replace("%", "")
        );

      const change =
        Number(data.change || 0);


      if (
        Number.isFinite(changePercent) &&
        Number.isFinite(change)
      ) {
        const sign =
          change >= 0 ? "+" : "";

        stockChange.textContent =
          `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)` +
          (
            data.latestTradingDay
              ? ` • As of ${data.latestTradingDay}`
              : ""
          );
      } else {
        stockChange.textContent =
          data.latestTradingDay
            ? `As of ${data.latestTradingDay}`
            : "Latest available market data";
      }


      const volume =
        Number(data.volume);

      stockVolume.textContent =
        Number.isFinite(volume) &&
        volume > 0
          ? volume.toLocaleString()
          : "Data unavailable";


    } catch (error) {
      console.error(
        "Bullnexa stock quote:",
        error
      );

      stockPrice.textContent =
        "Data unavailable";

      stockVolume.textContent =
        "Data unavailable";

      stockChange.textContent =
        error.message ||
        "Latest market data is currently unavailable.";
    }
  }


  loadStockQuote();
</script>
