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

    body.innerHTML = stocks.map(stock => {
      const isPositive =
        Number(stock.changePercent) >= 0;

      const changeClass =
        isPositive ? "positive" : "negative";

      const sign =
        isPositive ? "+" : "";

      const volumeRatio =
        Number(stock.volumeRatio || 0);

      const volumeDisplay =
        volumeRatio > 0
          ? `${volumeRatio.toFixed(2)}× Avg`
          : Number(stock.volume || 0).toLocaleString();

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
            ${sign}${Number(stock.changePercent).toFixed(2)}%
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

    if (updated) {
      updated.textContent =
        "Market data updated automatically";
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

  const radarTabs =
    document.querySelectorAll(".radar-tab");

  radarTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      radarTabs.forEach(item =>
        item.classList.remove("active")
      );

      tab.classList.add("active");
    });
  });
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
