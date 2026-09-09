function renderWatchlist() {
  const body = document.getElementById("watchlistBody");
  if (!body) return;

  const stocks = window.watchlistStocks || [];

  body.innerHTML = stocks.map(stock => `
    <tr>
      <td>${stock.ticker}</td>
      <td>${stock.company}</td>
      <td>${stock.theme}</td>
      <td><span class="pill">${stock.status}</span></td>
      <td>${stock.view}</td>
    </tr>
  `).join("");
}

document.getElementById('year').textContent = new Date().getFullYear();
renderWatchlist();

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
