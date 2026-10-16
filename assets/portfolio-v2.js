const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const body=document.body;
const header=$('.site-header');
const menuButton=$('#menuToggle');
const mobileMenu=$('#mobileMenu');
const year=$('[data-year]');
if(year) year.textContent=new Date().getFullYear();

const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>18);
updateHeader();
addEventListener('scroll',updateHeader,{passive:true});

function setMenu(open){
  if(!menuButton||!mobileMenu)return;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  mobileMenu.classList.toggle('open',open);
  mobileMenu.setAttribute('aria-hidden',String(!open));
  body.classList.toggle('menu-open',open);
}
menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -7% 0px'});
  $$('.reveal').forEach(el=>observer.observe(el));
}else{
  $$('.reveal').forEach(el=>el.classList.add('in'));
}

const sectors={
  hospital:{
    kicker:'Hospitals / Clinical systems',
    title:'Make complex clinical operations easier to see, use and coordinate.',
    intro:'Hospital technology works best when it respects real clinical workflows. I map the process first, then design the interface, data structure and integration path around the people who actually use it.',
    items:[
      ['Clinical workflow systems','Structured tools for reporting, case coordination, internal workflows and specialist teams.'],
      ['Patient & physician portals','Role-based experiences for information, documents, communication and longitudinal access.'],
      ['HIS / PACS integration planning','Read-first discovery, interface architecture and safe connection planning around existing systems.'],
      ['AI-assisted operations','Review-controlled automation for repetitive documentation, routing, search and administrative work.']
    ],
    outcome:'A clearer operational layer between people, information and hospital systems.'
  },
  physician:{
    kicker:'Physicians / Digital practice',
    title:'Build a professional digital practice around trust, expertise and continuity of care.',
    intro:'A physician website should do more than display a biography. It should explain expertise clearly, guide the right patients, support communication and create a professional digital layer around the practice.',
    items:[
      ['Professional website & authority','Specialist positioning, services, clinical content, publications, media and a credible search presence.'],
      ['Patient portal & follow-up','Role-based access to documents, requests, instructions, follow-up and practice communication.'],
      ['Referral & international journeys','Structured pathways for referring physicians, complex cases and international patient enquiries.'],
      ['Clinical productivity tools','Reporting, document preparation, search and workflow automation designed around physician review.']
    ],
    outcome:'A stronger professional presence connected to a more efficient day-to-day practice.'
  },
  clinic:{
    kicker:'Clinics / Patient experience',
    title:'Connect discovery, enquiry, booking and follow-up into one coherent patient journey.',
    intro:'Clinic growth and clinic operations should not live in separate systems. The website, intake flow, communication and internal process can be designed as one connected experience.',
    items:[
      ['Conversion-focused website','Clear service architecture, trust signals, mobile-first journeys, multilingual content and search visibility.'],
      ['Booking & digital intake','Appointment pathways, pre-visit forms, document collection and structured patient requests.'],
      ['CRM & communication workflow','Lead routing, status tracking, reminders, follow-up and operational visibility for staff.'],
      ['Automation & analytics','Reduce repetitive administrative work and surface the data needed to improve service delivery.']
    ],
    outcome:'A smoother patient journey and a more manageable operational workflow for the clinic team.'
  },
  artist:{
    kicker:'Artists / Cultural practices',
    title:'Create a digital presence with the depth of an exhibition, archive or publication.',
    intro:'For artists and cultural projects, a conventional portfolio template can flatten the work. I design systems where typography, movement, media and information architecture support the artistic identity.',
    items:[
      ['Portfolio & digital exhibition','Immersive presentations for works, series, performances, installations and multidisciplinary practice.'],
      ['Media-rich architecture','Fast, responsive handling of video, audio, imagery, interviews, texts and archival material.'],
      ['Press & professional materials','Press kits, biographies, selected works, downloadable resources and clear professional contact routes.'],
      ['Interactive storytelling','Curatorial navigation, cinematic transitions and distinctive responsive experiences without sacrificing usability.']
    ],
    outcome:'A digital identity that feels authored, internationally legible and faithful to the work itself.'
  }
};

const panel=$('#sectorPanel');
function renderSector(key){
  const data=sectors[key];
  if(!data||!panel)return;
  panel.classList.add('is-changing');
  setTimeout(()=>{
    $('#sectorKicker').textContent=data.kicker;
    $('#sectorTitle').textContent=data.title;
    $('#sectorIntro').textContent=data.intro;
    $('#sectorGrid').innerHTML=data.items.map((item,i)=>`
      <div>
        <span>0${i+1}</span>
        <b>${item[0]}</b>
        <p>${item[1]}</p>
      </div>`).join('');
    $('#sectorOutcome').innerHTML=`<span>Outcome</span> ${data.outcome}`;
    panel.classList.remove('is-changing');
  },120);
}
$$('.sector-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    $$('.sector-tab').forEach(t=>{
      const active=t===tab;
      t.classList.toggle('active',active);
      t.setAttribute('aria-selected',String(active));
    });
    renderSector(tab.dataset.sector);
  });
});

const briefState={type:'Hospital / Clinical Systems'};
$$('.choice').forEach(button=>{
  button.addEventListener('click',()=>{
    const group=button.closest('[data-brief-group]');
    if(!group)return;
    $$('.choice',group).forEach(item=>item.classList.remove('on'));
    button.classList.add('on');
    if(group.dataset.briefGroup==='type')briefState.type=button.dataset.value;
  });
});

const enquiryEndpoint='https://yafkgsczvmsltyoilagt.supabase.co/functions/v1/submit-enquiry';
const form=$('#projectForm');
const status=$('#submitStatus');
const submit=$('#submitBrief');

form?.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=$('#briefName')?.value.trim()||'';
  const email=$('#briefEmail')?.value.trim()||'';
  const company=$('#briefCompany')?.value.trim()||'';
  const summary=$('#briefSummary')?.value.trim()||'';
  const constraints=$('#briefConstraints')?.value.trim()||'';
  const website=$('#briefWebsite')?.value||'';

  if(name.length<2){
    status.textContent='Please enter your name.';
    $('#briefName')?.focus();
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    status.textContent='Please enter a valid email address.';
    $('#briefEmail')?.focus();
    return;
  }
  if(summary.length<20){
    status.textContent='Please add a little more project context.';
    $('#briefSummary')?.focus();
    return;
  }

  submit.disabled=true;
  submit.textContent='Sending…';
  status.textContent='Submitting securely…';

  try{
    const response=await fetch(enquiryEndpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        name,
        company,
        contact_email:email,
        project_type:briefState.type,
        project_stage:'To be discussed',
        priority:'To be defined during discovery',
        engagement_model:'Recommend the appropriate model',
        summary,
        constraints,
        website
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'Unable to submit the enquiry.');
    status.textContent=`Received — reference ${data.reference}.`;
    submit.textContent='Enquiry sent';
    form.reset();
    briefState.type='Hospital / Clinical Systems';
    $$('.choice').forEach((button,index)=>button.classList.toggle('on',index===0));
  }catch(error){
    status.textContent=error?.message||'Unable to submit right now. Please try again.';
    submit.textContent='Send project enquiry';
  }finally{
    submit.disabled=false;
  }
});

if(matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches){
  $$('.project-link:not(.static)').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${-y*1.4}deg) rotateY(${x*1.8}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}