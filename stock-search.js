const stockSearchForm = document.getElementById("stockSearchForm");
const stockSearchInput = document.getElementById("stockSearchInput");
const stockSearchStatus = document.getElementById("stockSearchStatus");
const stockSearchResults = document.getElementById("stockSearchResults");

stockSearchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const query = stockSearchInput.value.trim();

  if (query.length < 2) {
    stockSearchStatus.textContent = "Please enter at least 2 characters.";
    stockSearchResults.innerHTML = "";
    return;
  }

  stockSearchStatus.textContent = "Searching...";
  stockSearchResults.innerHTML = "";

  try {
    const response = await fetch(
      `/api/search-stock?q=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Search failed.");
    }

    if (!data.matches || data.matches.length === 0) {
      stockSearchStatus.textContent = "No matching stocks found.";
      return;
    }

   const preferredMatches = data.matches
  .filter(stock => {
    const symbol = (stock.symbol || "").toUpperCase();
    const region = (stock.region || "").toUpperCase();

    const isIndian =
      region.includes("INDIA") ||
      symbol.endsWith(".NSE") ||
      symbol.endsWith(".BSE");

    if (isIndian) {
      return symbol.endsWith(".NSE") || symbol.endsWith(".BSE");
    }

    return true;
  })
  .sort((a, b) => {
    const symbolA = (a.symbol || "").toUpperCase();
    const symbolB = (b.symbol || "").toUpperCase();

    if (symbolA.endsWith(".NSE") && !symbolB.endsWith(".NSE")) {
      return -1;
    }

    if (!symbolA.endsWith(".NSE") && symbolB.endsWith(".NSE")) {
      return 1;
    }

    if (symbolA.endsWith(".BSE") && !symbolB.endsWith(".BSE")) {
      return -1;
    }

    if (!symbolA.endsWith(".BSE") && symbolB.endsWith(".BSE")) {
      return 1;
    }

    return 0;
  });

stockSearchStatus.textContent =
  `${preferredMatches.length} matching stocks found`;

stockSearchResults.innerHTML = preferredMatches
  .map(stock => {

    const stockUrl =
      `stock.html?symbol=${encodeURIComponent(stock.symbol || "")}` +
      `&name=${encodeURIComponent(stock.name || "")}` +
      `&region=${encodeURIComponent(stock.region || "")}` +
      `&currency=${encodeURIComponent(stock.currency || "")}` +
      `&type=${encodeURIComponent(stock.type || "")}`;

    return `
  <a
    class="stock-search-result"
    href="${stockUrl}"
  >

    <div>
      <div class="stock-search-symbol">
        ${escapeHTML(stock.symbol)}
      </div>

      <div class="stock-search-name">
        ${escapeHTML(stock.name)}
      </div>

      <div class="stock-search-meta">
        ${
          (stock.symbol || "").toUpperCase().endsWith(".NSE")
            ? "India / NSE"
            : (stock.symbol || "").toUpperCase().endsWith(".BSE")
            ? "India / BSE"
            : escapeHTML(stock.region || "")
        }
        ${stock.currency ? " • " + escapeHTML(stock.currency) : ""}
        ${stock.type ? " • " + escapeHTML(stock.type) : ""}
      </div>
    </div>

    <div class="stock-result-arrow">
      View Stock →
    </div>

  </a>
`;
  })
  .join("");

  } catch (error) {
    console.error("Stock search error:", error);

    stockSearchStatus.textContent =
      "Unable to search right now. Please try again.";
  }
});

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
