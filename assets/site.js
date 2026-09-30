const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const root=document.documentElement;
const body=document.body;
const year=$('[data-year]');
if(year) year.textContent=new Date().getFullYear();

const savedTheme=localStorage.getItem('zb-theme');
if(savedTheme) root.dataset.theme=savedTheme;
$('#themeToggle')?.addEventListener('click',()=>{
  const next=root.dataset.theme==='dark'?'light':'dark';
  root.dataset.theme=next;
  localStorage.setItem('zb-theme',next);
});

const header=$('.header');
const onScroll=()=>header?.classList.toggle('scrolled',scrollY>24);
onScroll();
addEventListener('scroll',onScroll,{passive:true});

const drawer=$('#drawer');
$('#menuToggle')?.addEventListener('click',()=>{
  const open=drawer?.classList.toggle('open');
  body.classList.toggle('lock',!!open);
});
$$('#drawer a').forEach(a=>a.addEventListener('click',()=>{
  drawer?.classList.remove('open');body.classList.remove('lock');
}));

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.reveal').forEach(el=>io.observe(el));

const card=$('.hero-card');
const stage=$('.hero-stage');
if(card&&stage&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  stage.addEventListener('pointermove',e=>{
    const r=stage.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`rotateX(${-y*7}deg) rotateY(${x*9}deg) rotateZ(-4deg)`;
  });
  stage.addEventListener('pointerleave',()=>card.style.transform='rotate(-4deg)');
}

const projectData={
  layegh:{
    title:'Layegh Music — Digital Exhibition',
    lead:'A live creative platform reframed as an immersive digital exhibition rather than a conventional portfolio.',
    challenge:'Organize works, performance, film and editorial material inside a premium experience while preserving navigation clarity and responsive media behavior.',
    approach:'Built a curated-room information model, cinematic media treatment, responsive interaction rules and reusable visual structures for works, biography, press and news.',
    focus:'Creative direction · Front-end systems · Responsive media · Content architecture',
    url:'https://layeghmusic.com/'
  },
  tehran:{
    title:'Tehran Arrhythmia Center',
    lead:'A live multilingual medical platform for specialist cardiac electrophysiology information and patient-facing service discovery.',
    challenge:'Translate complex clinical services into clear digital journeys across multiple languages while protecting credibility, performance and technical discoverability.',
    approach:'Structured service architecture, multilingual UX, clinical content hierarchy, technical SEO and scalable landing-page patterns around real patient and physician intents.',
    focus:'HealthTech web · Multilingual architecture · Technical SEO · Clinical UX',
    url:'https://tehranep.center/'
  },
  clinical:{
    title:'Clinical Intelligence & Reporting System',
    lead:'A healthcare product concept for structured cardiovascular and neurointerventional reporting with longitudinal retrieval and clinician-oriented outputs.',
    challenge:'Reduce fragmented manual reporting and make prior procedure information easier to retrieve across repeated patient encounters.',
    approach:'Mapped clinical workflow, structured report modules, document outputs, identity-based retrieval and offline-first operating constraints into a coherent product architecture.',
    focus:'Clinical workflow · Structured reporting · Offline-first design · Product architecture',
    url:''
  },
  automation:{
    title:'AI & Automation Systems',
    lead:'Consulting and implementation patterns that connect AI, APIs and operational rules to reduce repetitive work while preserving human oversight.',
    challenge:'Automate high-friction tasks without creating opaque systems, uncontrolled responses or fragile dependencies.',
    approach:'Identify high-value trigger points, define approvals, connect services through APIs, keep auditability visible and introduce AI only where it materially improves the workflow.',
    focus:'AI agents · API integrations · Human-in-the-loop · Workflow design',
    url:''
  }
};

const modal=$('#caseModal');
$$('[data-case]').forEach(cardEl=>{
  const openCase=e=>{
    if(e.target.closest('a')) return;
    const d=projectData[cardEl.dataset.case];
    if(!d||!modal) return;
    $('#caseTitle').textContent=d.title;
    $('#caseLead').textContent=d.lead;
    $('#caseChallenge').textContent=d.challenge;
    $('#caseApproach').textContent=d.approach;
    $('#caseFocus').textContent=d.focus;
    const link=$('#caseLink');
    if(d.url){link.hidden=false;link.href=d.url}else{link.hidden=true;link.removeAttribute('href')}
    modal.showModal();
  };
  cardEl.addEventListener('click',openCase);
  cardEl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(e)}});
});
$('#caseClose')?.addEventListener('click',()=>modal?.close());
modal?.addEventListener('click',e=>{if(e.target===modal)modal.close()});

const briefState={
  type:'Website / Digital Experience',
  stage:'Early discovery',
  priority:'Premium experience and differentiation',
  model:'Project delivery'
};
const fields={
  name:$('#briefName'),
  company:$('#briefCompany'),
  summary:$('#briefSummary'),
  constraints:$('#briefConstraints')
};
function briefText(){
  const name=fields.name?.value.trim()||'Not specified';
  const company=fields.company?.value.trim()||'Not specified';
  const summary=fields.summary?.value.trim()||'Project context to be clarified during discovery.';
  const constraints=fields.constraints?.value.trim()||'No constraints supplied yet.';
  return [
    'PROJECT INTRODUCTION BRIEF',
    '',
    `Contact: ${name}`,
    `Company / initiative: ${company}`,
    `Project type: ${briefState.type}`,
    `Current stage: ${briefState.stage}`,
    `Primary priority: ${briefState.priority}`,
    `Preferred engagement: ${briefState.model}`,
    '',
    'PROJECT CONTEXT',
    summary,
    '',
    'CONSTRAINTS / REQUIREMENTS',
    constraints,
    '',
    'PROPOSED FIRST STEP',
    'A focused discovery review covering goals, users, current systems, technical constraints, delivery risks and the highest-value route to launch or scale.',
    '',
    'Prepared via Zohreh Barmaki — Digital Systems & Product Studio'
  ].join('\n');
}
function renderBrief(){
  const out=$('#briefOutput');
  if(out) out.textContent=briefText();
}
$$('.choice').forEach(btn=>btn.addEventListener('click',e=>{
  e.preventDefault();
  const group=btn.closest('[data-brief-group]');
  if(!group) return;
  $$('.choice',group).forEach(x=>x.classList.remove('on'));
  btn.classList.add('on');
  briefState[group.dataset.briefGroup]=btn.dataset.value;
  renderBrief();
}));
Object.values(fields).forEach(f=>f?.addEventListener('input',renderBrief));
renderBrief();

$('#copyBrief')?.addEventListener('click',async()=>{
  const btn=$('#copyBrief');
  try{
    await navigator.clipboard.writeText(briefText());
    btn.textContent='Copied';
    setTimeout(()=>btn.textContent='Copy brief',1300);
  }catch{
    const out=$('#briefOutput');
    const range=document.createRange();range.selectNodeContents(out);
    const sel=getSelection();sel.removeAllRanges();sel.addRange(range);
  }
});
$('#downloadBrief')?.addEventListener('click',()=>{
  const blob=new Blob([briefText()],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='project-introduction-brief.txt';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
});
$('#printProfile')?.addEventListener('click',()=>{
  if(location.pathname.endsWith('/profile.html')||location.pathname.endsWith('profile.html')) print();
  else location.href='profile.html?print=1';
});
if((location.pathname.endsWith('/profile.html')||location.pathname.endsWith('profile.html'))&&new URLSearchParams(location.search).get('print')==='1') setTimeout(()=>print(),450);

const currentPath=location.pathname.replace(/\/+$/,'');
$$('a[data-nav]').forEach(a=>{
  const href=a.getAttribute('href')?.replace(/\/+$/,'');
  if(href===currentPath) a.setAttribute('aria-current','page');
});
