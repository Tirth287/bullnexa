// Topics to investigate, not findings or investment recommendations.
const companyFocus = {
  "Bliss GVS Pharma Ltd": "Export demand, operating margins, and working capital.",
  "Hindustan Copper Ltd": "Copper prices, production volumes, and expansion execution.",
  "Biocon Ltd": "Biosimilars growth, profitability, and debt reduction.",
  "Indosolar Ltd": "Manufacturing utilization, sales growth, and cash flow.",
  "Morepen Laboratories Ltd": "Product mix, segment profitability, and working capital.",
  "CESC Ltd": "Power demand, regulatory developments, and project execution.",
  "NMDC Ltd": "Iron ore prices, sales volumes, and production costs.",
  "Ashok Leyland Ltd": "Commercial vehicle demand, market share, and margins.",
  "Apollo Micro Systems Ltd": "Order conversion, delivery timelines, and cash collection.",
  "Finolex Industries Ltd": "PVC price trends, pipe demand, and operating margins.",
  "Bhagyanagar India Ltd": "Copper input costs, segment performance, and capital allocation.",
  "Himadri Speciality Chemical Ltd": "Product mix, capacity investments, and returns on capital."
};

const cards = document.getElementById('researchCards');
const search = document.getElementById('researchSearch');
const sector = document.getElementById('sectorFilter');
const count = document.getElementById('researchCount');
[...new Set(researchCompanies.map(c => c.sector))].sort().forEach(s => { const option = document.createElement('option'); option.value=s; option.textContent=s; sector.append(option); });
function renderResearch(){
 const query=search.value.trim().toLowerCase();
 const matches=researchCompanies.filter(c => (c.name+' '+c.sector).toLowerCase().includes(query) && (!sector.value || c.sector===sector.value));
 cards.replaceChildren();
 count.textContent=matches.length+' '+(matches.length===1?'company':'companies')+' in the watchlist';
 for(const c of matches){const article=document.createElement('article'); article.className='research-card'; const tag=document.createElement('span');tag.className='section-label';tag.textContent=c.sector;const title=document.createElement('h3');title.textContent=c.name;const status=document.createElement('p');status.className='research-status';status.textContent='● On our watchlist';const text=document.createElement('p');text.textContent='What to track: '+(companyFocus[c.name] || 'Business performance, valuation, and company-specific risks.');article.append(tag,title,status,text);cards.append(article);}
 if(!matches.length){const empty=document.createElement('p');empty.className='empty-state';empty.textContent='No tracked companies match. Try another name or choose All sectors.';cards.append(empty);}
}
search.addEventListener('input',renderResearch);sector.addEventListener('change',renderResearch);document.getElementById('resetFilters').addEventListener('click',()=>{search.value='';sector.value='';renderResearch();search.focus();});renderResearch();
