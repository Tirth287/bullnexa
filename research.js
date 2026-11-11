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
 for(const c of matches){const article=document.createElement('article'); article.className='research-card'; const tag=document.createElement('span');tag.className='section-label';tag.textContent=c.sector;const title=document.createElement('h3');title.textContent=c.name;const status=document.createElement('p');status.className='research-status';status.textContent='● On our watchlist';const text=document.createElement('p');text.textContent='Research focus: business performance, valuation, catalysts, and risks.';const note=document.createElement('span');note.className='microcopy';note.textContent='Full report not yet published';article.append(tag,title,status,text,note);cards.append(article);}
 if(!matches.length){const empty=document.createElement('p');empty.className='empty-state';empty.textContent='No tracked companies match. Try another name or choose All themes.';cards.append(empty);}
}
search.addEventListener('input',renderResearch);sector.addEventListener('change',renderResearch);renderResearch();
