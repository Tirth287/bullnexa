function initializeMarketRadar() {
  const body = document.getElementById("marketRadarBody");
  if (!body) return;

  body.innerHTML = `
    <tr class="radar-loading-row">
      <td colspan="5">
        Market data connection is being configured...
      </td>
    </tr>
  `;

  const radarTabs = document.querySelectorAll(".radar-tab");

  radarTabs.forEach(tab => {
    tab.addEventListener("click", () => {

      radarTabs.forEach(item => {
        item.classList.remove("active");
      });

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
