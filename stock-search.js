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

    stockSearchStatus.textContent =
      `${data.matches.length} matching stocks found`;

stockSearchResults.innerHTML = data.matches
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
            ${escapeHTML(stock.region || "")}
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
