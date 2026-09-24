async function initializeMarketRadar() {
  const body = document.getElementById("marketRadarBody");
  const updated = document.getElementById("radarUpdated");

  if (!body) return;

  body.innerHTML = `
    <tr class="radar-loading-row">
      <td colspan="5">
        Loading market data...
      </td>
    </tr>
  `;

  try {
    const response = await fetch(
      "/.netlify/functions/market-radar"
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        data.error || "Unable to load market data."
      );
    }

    const stocks = data.stocks || [];

    if (stocks.length === 0) {
      body.innerHTML = `
        <tr class="radar-loading-row">
          <td colspan="5">
            No market data available.
          </td>
        </tr>
      `;
      return;
    }

    function renderStocks(
      stockList,
      emptyMessage = "No stocks match this filter."
    ) {
      if (stockList.length === 0) {
        body.innerHTML = `
          <tr class="radar-loading-row">
            <td colspan="5">
              ${emptyMessage}
            </td>
          </tr>
        `;
        return;
      }

      body.innerHTML = stockList.map(stock => {
        const changePercent =
          Number(stock.changePercent || 0);

        const isPositive =
          changePercent >= 0;

        const changeClass =
          isPositive ? "positive" : "negative";

        const sign =
          isPositive ? "+" : "";

        const volumeRatio =
          Number(stock.volumeRatio || 0);

        const volumeDisplay =
          volumeRatio > 0
            ? `${volumeRatio.toFixed(2)}× Avg`
            : Number(
                stock.volume || 0
              ).toLocaleString();

        return `
          <tr>
            <td>
              <strong>${stock.symbol}</strong>
              <br>
              <span style="
                color: var(--muted);
                font-size: .8rem;
              ">
                ${stock.name}
              </span>
            </td>

            <td class="radar-price">
              ₹${Number(stock.price).toFixed(2)}
            </td>

            <td class="radar-change ${changeClass}">
              ${sign}${changePercent.toFixed(2)}%
            </td>

            <td>
              ${volumeDisplay}
            </td>

            <td>
              <span class="radar-signal">
                ${stock.signal}
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }

    function showTopMovers() {
      const sorted = [...stocks].sort(
        (a, b) =>
          Math.abs(Number(b.changePercent || 0)) -
          Math.abs(Number(a.changePercent || 0))
      );

      renderStocks(sorted);
    }

    function showUnusualVolume() {
      const filtered = [...stocks]
        .filter(
          stock =>
            Number(stock.volumeRatio || 0) >= 1.5
        )
        .sort(
          (a, b) =>
            Number(b.volumeRatio || 0) -
            Number(a.volumeRatio || 0)
        );

      renderStocks(
        filtered,
        "No unusual volume stocks right now."
      );
    }

    function showNearHighs() {
      const filtered = [...stocks]
        .filter(stock => {
          const distance =
  Number(stock.distanceFromHigh);

return (
  stock.distanceFromHigh != null &&
  Number.isFinite(distance) &&
  distance >= 0 &&
  distance <= 5
);
        })
        .sort(
          (a, b) =>
            Number(a.distanceFromHigh) -
            Number(b.distanceFromHigh)
        );

      renderStocks(
        filtered,
        "No stocks are currently within 5% of their 52-week high."
      );
    }

    function showMarketActivity() {
      const sorted = [...stocks].sort(
        (a, b) =>
          Number(b.volumeRatio || 0) -
          Number(a.volumeRatio || 0)
      );

      renderStocks(sorted);
    }

    const radarTabs =
      document.querySelectorAll(".radar-tab");

    radarTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        radarTabs.forEach(item =>
          item.classList.remove("active")
        );

        tab.classList.add("active");

        const tabName =
          tab.textContent.trim().toLowerCase();

        if (tabName === "top movers") {
          showTopMovers();
        } else if (
          tabName === "unusual volume"
        ) {
          showUnusualVolume();
        } else if (
          tabName === "near highs"
        ) {
          showNearHighs();
        } else if (
          tabName === "market activity"
        ) {
          showMarketActivity();
        }
      });
    });

    showTopMovers();

            if (updated) {
      const marketDate = stocks[0]?.date
        ? new Date(stocks[0].date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC"
            }
          )
        : "Latest available";

      updated.textContent =
        `Market data as of ${marketDate}`;
    }

  } catch (error) {
    console.error(
      "Bullnexa Market Radar:",
      error
    );

    body.innerHTML = `
      <tr class="radar-loading-row">
        <td colspan="5">
          Market data is temporarily unavailable.
        </td>
      </tr>
    `;

    if (updated) {
      updated.textContent =
        "Unable to update market data";
    }
  }
}

document.getElementById('year').textContent = new Date().getFullYear();
initializeMarketRadar();

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});
