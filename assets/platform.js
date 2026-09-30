import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL="https://yafkgsczvmsltyoilagt.supabase.co";
const PUBLISHABLE_KEY="sb_publishable_DYOSbO7ZWHmumcHwG0lpiQ_f80EEMdr";
const API=SUPABASE_URL+"/functions/v1/platform-api";
const supabase=createClient(SUPABASE_URL,PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const fmt=d=>d?new Intl.DateTimeFormat("en",{dateStyle:"medium"}).format(new Date(d)):"—";
const money=(n,c="USD")=>n==null?"—":new Intl.NumberFormat("en",{style:"currency",currency:c}).format(Number(n));
const state={session:null,me:null,currentView:"dashboard",currentProject:null,enquiryFilter:"all",authMode:"login"};

function pill(v){const c=String(v||"").replace(/[^a-z0-9_]/gi,"_").toLowerCase();return `<span class="pill ${c}">${esc(v||"—")}</span>`}
function showNotice(msg,type=""){const n=$("#globalNotice");if(!n)return;n.textContent=msg;n.classList.toggle("hidden",!msg);n.dataset.type=type}
function setLoading(on){$("#appLoader")?.classList.toggle("hidden",!on)}

async function api(action,payload={}){
  const token=state.session?.access_token;
  if(!token) throw new Error("Please sign in again.");
  const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":PUBLISHABLE_KEY},body:JSON.stringify({action,...payload})});
  const data=await r.json().catch(()=>({}));
  if(r.status===401){await supabase.auth.signOut();throw new Error("Your session expired. Please sign in again.")}
  if(!r.ok) throw new Error(data.error||"Request failed");
  return data;
}

function showLogin(){
  $("#loginScreen").classList.remove("hidden");
  $("#platformApp").classList.add("hidden");
}
function showApp(){
  $("#loginScreen").classList.add("hidden");
  $("#platformApp").classList.remove("hidden");
}

async function restore(){
  const {data:{session}}=await supabase.auth.getSession();
  state.session=session;
  if(!session){showLogin();return}
  try{await loadIdentity()}catch(e){showNotice(e.message);showLogin()}
}
async function loadIdentity(){
  state.me=await api("session");
  if(state.me.role==="none") throw new Error("This account is authenticated but has not been granted access to a client project or studio workspace.");
  showApp();
  $("#signedInEmail").textContent=state.me.email;
  const staff=["owner","admin"].includes(state.me.role);
  $$("[data-staff-only]").forEach(x=>x.classList.toggle("hidden",!staff));
  $("#roleLabel").textContent=staff?"Studio "+state.me.role:"Client portal";
  if(staff){navigate("dashboard")}else{navigate("projects")}
}
async function login(e){
  e.preventDefault();
  const email=$("#authEmail").value.trim(),password=$("#authPassword").value;
  const btn=$("#authSubmit");btn.disabled=true;btn.textContent=state.authMode==="login"?"Signing in…":"Creating account…";
  $("#authNotice").textContent="";
  try{
    if(state.authMode==="login"){
      const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;state.session=data.session;await loadIdentity();
    }else{
      const {data,error}=await supabase.auth.signUp({email,password});if(error)throw error;
      if(data.session){state.session=data.session;await loadIdentity()}
      else $("#authNotice").textContent="Account created. Check your email if confirmation is required, then sign in.";
    }
  }catch(err){$("#authNotice").textContent=err.message||"Authentication failed"}
  finally{btn.disabled=false;btn.textContent=state.authMode==="login"?"Sign in":"Create account"}
}
$("#authForm")?.addEventListener("submit",login);
$("#authSwitch")?.addEventListener("click",()=>{
  state.authMode=state.authMode==="login"?"signup":"login";
  $("#authSubmit").textContent=state.authMode==="login"?"Sign in":"Create account";
  $("#authTitle").textContent=state.authMode==="login"?"Access the studio.":"Create your secure access.";
  $("#authSwitch").textContent=state.authMode==="login"?"Need an account? Create one":"Already registered? Sign in";
  $("#authNotice").textContent="";
});
$("#signOut")?.addEventListener("click",async()=>{await supabase.auth.signOut();state.session=null;state.me=null;showLogin()});

function navigate(view){
  state.currentView=view;
  $$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));
  $$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  if(view==="dashboard")loadDashboard();
  if(view==="leads")loadLeads();
  if(view==="projects")loadProjects();
  if(view==="clients")loadClients();
}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));

async function loadDashboard(){
  if(!["owner","admin"].includes(state.me.role))return;
  setLoading(true);
  try{
    const d=await api("dashboard");
    $("#mLeads").textContent=d.metrics.leads;$("#mProjects").textContent=d.metrics.projects;$("#mClients").textContent=d.metrics.clients;$("#mProposals").textContent=d.metrics.proposals;
    $("#dashLeads").innerHTML=d.enquiries.length?d.enquiries.map(x=>`<tr class="click-row" data-lead="${x.id}"><td><b>${esc(x.reference)}</b><br><small>${fmt(x.created_at)}</small></td><td>${esc(x.name)}<br><small>${esc(x.company||"")}</small></td><td>${esc(x.project_type)}</td><td>${pill(x.status)}</td></tr>`).join(""):`<tr><td colspan="4" class="empty">No active leads yet.</td></tr>`;
    $("#dashProjects").innerHTML=d.projects.length?d.projects.map(p=>`<div class="card" data-project="${p.id}"><div class="card-top"><span class="card-code">${esc(p.code)}</span>${pill(p.status)}</div><h3>${esc(p.title)}</h3><p>${esc(p.clients?.company||p.clients?.name||"Independent project")}</p></div>`).join(""):`<div class="empty">No projects yet.</div>`;
    $("#dashActivity").innerHTML=d.activity.length?d.activity.map(a=>`<div class="update"><b>${esc(a.action.replaceAll("_"," "))}</b><div class="meta">${esc(a.entity_type)} · ${fmt(a.created_at)}</div></div>`).join(""):`<div class="empty">Activity will appear here.</div>`;
    bindDynamic();
  }catch(e){showNotice(e.message)}finally{setLoading(false)}
}

async function loadLeads(){
  setLoading(true);
  try{
    const d=await api("list_enquiries",{status:state.enquiryFilter});
    $("#leadTable").innerHTML=d.enquiries.length?d.enquiries.map(x=>`<tr class="click-row" data-lead="${x.id}"><td><b>${esc(x.reference)}</b><br><small>${fmt(x.created_at)}</small></td><td>${esc(x.name)}<br><small>${esc(x.contact_email)}</small></td><td>${esc(x.company||"—")}</td><td>${esc(x.project_type)}<br><small>${esc(x.engagement_model)}</small></td><td>${pill(x.status)}</td><td><button class="btn small secondary" data-lead-edit="${x.id}">Review</button> <button class="btn small" data-convert="${x.id}">Convert</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty">No enquiries in this status.</td></tr>`;
    $("#leadData").dataset.items=JSON.stringify(d.enquiries);
    bindDynamic();
  }catch(e){showNotice(e.message)}finally{setLoading(false)}
}
$$("[data-lead-filter]").forEach(b=>b.addEventListener("click",()=>{
  $$("[data-lead-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.enquiryFilter=b.dataset.leadFilter;loadLeads();
}));

async function loadProjects(){
  setLoading(true);
  try{
    const d=await api("list_projects");
    const staff=["owner","admin"].includes(state.me.role);
    $("#projectsGrid").innerHTML=d.projects.length?d.projects.map(p=>`<article class="card" data-project="${p.id}"><div class="card-top"><span class="card-code">${esc(p.code)}</span><span>${pill(p.health)} ${pill(p.status)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.clients?.company||p.clients?.name||"Project")}</p><div class="meta">Target: ${fmt(p.target_date)}</div></article>`).join(""):`<div class="empty">No projects are available for this account yet.</div>`;
    $("#newProjectBtn")?.classList.toggle("hidden",!staff);
    bindDynamic();
  }catch(e){showNotice(e.message)}finally{setLoading(false)}
}

async function loadClients(){
  setLoading(true);
  try{
    const d=await api("list_clients");
    $("#clientTable").innerHTML=d.clients.length?d.clients.map(c=>`<tr><td><b>${esc(c.name)}</b><br><small>${esc(c.company||"")}</small></td><td>${esc(c.primary_email)}</td><td>${pill(c.status)}</td><td>${fmt(c.updated_at)}</td></tr>`).join(""):`<tr><td colspan="4" class="empty">Clients appear after a lead is converted or a project is created.</td></tr>`;
  }catch(e){showNotice(e.message)}finally{setLoading(false)}
}

async function openProject(id){
  setLoading(true);
  try{
    const d=await api("project_detail",{id});state.currentProject=d;
    $$(".view").forEach(v=>v.classList.remove("active"));$("#view-project").classList.add("active");$$("[data-view]").forEach(b=>b.classList.remove("active"));
    renderProject(d);
  }catch(e){showNotice(e.message)}finally{setLoading(false)}
}

function renderProject(d){
  const p=d.project,staff=["owner","admin"].includes(d.role);
  $("#projectTitle").textContent=p.title;$("#projectCode").textContent=p.code;$("#projectSummary").textContent=p.summary||"No project summary yet.";
  $("#projectState").innerHTML=`${pill(p.status)} ${pill(p.health)}`;
  $("#projectClient").textContent=p.clients?.company||p.clients?.name||"—";
  $("#projectDates").textContent=`${fmt(p.start_date)} → ${fmt(p.target_date)}`;
  $("#staffProjectActions").classList.toggle("hidden",!staff);
  const total=d.milestones.length,done=d.milestones.filter(x=>x.status==="done").length,progress=total?Math.round(done/total*100):0;
  $("#projectProgress").innerHTML=`<div class="progress"><i style="width:${progress}%"></i></div><div class="meta">${done} of ${total} milestones complete · ${progress}%</div>`;
  $("#milestones").innerHTML=d.milestones.length?d.milestones.map(m=>`<div class="milestone" ${staff?`data-milestone="${m.id}"`:""}><div><b>${esc(m.title)}</b><small>${esc(m.description||"")} ${m.due_date?"· Due "+fmt(m.due_date):""}</small></div>${pill(m.status)}</div>`).join(""):`<div class="empty">No milestones yet.</div>`;
  $("#updates").innerHTML=d.updates.length?d.updates.map(u=>`<article class="update"><h4>${esc(u.title)}</h4><p>${esc(u.body)}</p><div class="meta">${esc(u.visibility)} · ${fmt(u.created_at)}</div></article>`).join(""):`<div class="empty">No project updates yet.</div>`;
  $("#documents").innerHTML=d.documents.length?d.documents.map(x=>{const href=x.resolved_url||x.url||"#";const size=x.size_bytes?` · ${Math.round(Number(x.size_bytes)/1024)} KB`:"";return `<a class="update" href="${esc(href)}" target="_blank" rel="noreferrer" style="display:block"><b>${esc(x.title)}</b><div class="meta">${esc(x.kind)} · ${esc(x.visibility)}${size} · ${fmt(x.created_at)} ↗</div></a>`}).join(""):`<div class="empty">No shared documents yet.</div>`;
  $("#proposals").innerHTML=d.proposals.length?d.proposals.map(x=>`<div class="update"><b>${esc(x.title)}</b><div>${pill(x.status)} <span class="meta">${money(x.fee_amount,x.fee_currency)} · valid ${fmt(x.valid_until)}</span></div>${x.scope?`<p>${esc(x.scope)}</p>`:""}${!staff&&x.status==="sent"?`<button class="btn small" data-accept-proposal="${x.id}">Accept proposal</button>`:""}</div>`).join(""):`<div class="empty">No proposals yet.</div>`;
  $("#members").innerHTML=staff?(d.members.length?d.members.map(x=>`<div class="update"><b>${esc(x.display_name||x.email)}</b><div class="meta">${esc(x.email)} · ${esc(x.role)}</div></div>`).join(""):`<div class="empty">No members.</div>`):"";
  $("#messages").innerHTML=d.messages.length?d.messages.map(m=>{const who=staff?m.sender_email:(m.sender_role==="staff"?"Studio":"Client");return `<div class="msg ${m.sender_role==="staff"?"staff":""}">${esc(m.body)}<small>${esc(who)} · ${fmt(m.created_at)}</small></div>`}).join(""):`<div class="empty">No messages yet.</div>`;
  bindDynamic();
}
$("#backProjects")?.addEventListener("click",()=>navigate("projects"));
$("#sendMessage")?.addEventListener("click",async()=>{
  const text=$("#messageText").value.trim();if(!text||!state.currentProject)return;
  try{await api("post_message",{project_id:state.currentProject.project.id,body:text});$("#messageText").value="";await openProject(state.currentProject.project.id)}catch(e){showNotice(e.message)}
});

function openModal(title,html,onSubmit){
  $("#modalTitle").textContent=title;$("#modalBody").innerHTML=html;const dlg=$("#actionModal");dlg.showModal();
  const form=$("#modalBody form");if(form)form.addEventListener("submit",async e=>{e.preventDefault();const submit=form.querySelector("[type=submit]");if(submit)submit.disabled=true;try{await onSubmit(new FormData(form));dlg.close()}catch(err){$("#modalError").textContent=err.message||"Request failed"}finally{if(submit)submit.disabled=false}});
}
$("#modalClose")?.addEventListener("click",()=>$("#actionModal").close());
$("#actionModal")?.addEventListener("click",e=>{if(e.target===$("#actionModal"))$("#actionModal").close()});

function leadById(id){try{return JSON.parse($("#leadData").dataset.items||"[]").find(x=>x.id===id)}catch{return null}}
function bindDynamic(){
  $$("[data-project]").forEach(x=>x.onclick=()=>openProject(x.dataset.project));
  $$("[data-lead]").forEach(x=>x.onclick=e=>{if(e.target.closest("button"))return;editLead(x.dataset.lead)});
  $$("[data-lead-edit]").forEach(x=>x.onclick=e=>{e.stopPropagation();editLead(x.dataset.leadEdit)});
  $$("[data-convert]").forEach(x=>x.onclick=e=>{e.stopPropagation();convertLead(x.dataset.convert)});
  $("[data-milestone]").forEach(x=>x.onclick=()=>editMilestone(x.dataset.milestone));
  $("[data-accept-proposal]").forEach(x=>x.onclick=()=>acceptProposal(x.dataset.acceptProposal));
}
function editLead(id){
  const x=leadById(id);if(!x)return;
  openModal("Review lead",`<form class="form">
    <div class="field"><label>Reference</label><input value="${esc(x.reference)}" disabled></div>
    <div class="field"><label>Status</label><select name="status">${["new","reviewing","qualified","proposal","won","closed","spam"].map(v=>`<option ${x.status===v?"selected":""}>${v}</option>`).join("")}</select></div>
    <div class="field"><label>Internal notes</label><textarea name="internal_notes" rows="5">${esc(x.internal_notes||"")}</textarea></div>
    <div class="field"><label>Next action</label><input name="next_action_at" type="datetime-local" value="${x.next_action_at?new Date(x.next_action_at).toISOString().slice(0,16):""}"></div>
    <button class="btn" type="submit">Save review</button><div id="modalError" class="notice"></div>
  </form>`,async f=>{await api("update_enquiry",{id,status:f.get("status"),internal_notes:f.get("internal_notes"),next_action_at:f.get("next_action_at")?new Date(f.get("next_action_at")).toISOString():""});await loadLeads()});
}
function convertLead(id){
  const x=leadById(id);if(!x)return;
  openModal("Convert lead to client project",`<form class="form"><p>This creates a client, a project workspace and a client membership using the enquiry email.</p><div class="field"><label>Project title</label><input name="title" value="${esc(x.company||x.project_type)}" required></div><button class="btn" type="submit">Create project</button><div id="modalError" class="notice"></div></form>`,async f=>{const d=await api("convert_enquiry",{id,title:f.get("title")});navigate("projects");if(d.result?.project_id)setTimeout(()=>openProject(d.result.project_id),300)});
}
$("#newProjectBtn")?.addEventListener("click",()=>openModal("New project",`<form class="form"><div class="field"><label>Title</label><input name="title" required></div><div class="field"><label>Summary</label><textarea name="summary" rows="4"></textarea></div><div class="form two"><div class="field"><label>Status</label><select name="status"><option>discovery</option><option>proposal</option><option>active</option></select></div><div class="field"><label>Health</label><select name="health"><option>green</option><option>amber</option><option>red</option></select></div></div><button class="btn" type="submit">Create project</button><div id="modalError" class="notice"></div></form>`,async f=>{await api("create_project",{title:f.get("title"),summary:f.get("summary"),status:f.get("status"),health:f.get("health")});await loadProjects()}));

$("#editProject")?.addEventListener("click",()=>{
  const p=state.currentProject?.project;if(!p)return;
  openModal("Edit project",`<form class="form"><div class="field"><label>Title</label><input name="title" value="${esc(p.title)}"></div><div class="field"><label>Summary</label><textarea name="summary" rows="4">${esc(p.summary||"")}</textarea></div><div class="form two"><div class="field"><label>Status</label><select name="status">${["discovery","proposal","active","paused","completed","archived"].map(v=>`<option ${p.status===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="field"><label>Health</label><select name="health">${["green","amber","red"].map(v=>`<option ${p.health===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="field"><label>Start</label><input type="date" name="start_date" value="${p.start_date||""}"></div><div class="field"><label>Target</label><input type="date" name="target_date" value="${p.target_date||""}"></div></div><button class="btn" type="submit">Save project</button><div id="modalError" class="notice"></div></form>`,async f=>{await api("update_project",{id:p.id,title:f.get("title"),summary:f.get("summary"),status:f.get("status"),health:f.get("health"),start_date:f.get("start_date"),target_date:f.get("target_date")});await openProject(p.id)});
});
const openMilestoneForm=()=>projectForm("Add milestone",`<div class="field"><label>Title</label><input name="title" required></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="form two"><div class="field"><label>Status</label><select name="status"><option>planned</option><option>in_progress</option><option>review</option><option>done</option><option>blocked</option></select></div><div class="field"><label>Due date</label><input type="date" name="due_date"></div></div>`,async(f,p)=>api("create_milestone",{project_id:p.id,title:f.get("title"),description:f.get("description"),status:f.get("status"),due_date:f.get("due_date")}));
$("#addMilestone")?.addEventListener("click",openMilestoneForm);
$("#addMilestoneMirror")?.addEventListener("click",openMilestoneForm);
function editMilestone(id){
  const p=state.currentProject, m=p?.milestones.find(x=>x.id===id);if(!m||!["owner","admin"].includes(p.role))return;
  openModal("Update milestone",`<form class="form"><div class="field"><label>Title</label><input name="title" value="${esc(m.title)}"></div><div class="field"><label>Description</label><textarea name="description">${esc(m.description||"")}</textarea></div><div class="form two"><div class="field"><label>Status</label><select name="status">${["planned","in_progress","review","done","blocked"].map(v=>`<option ${m.status===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="field"><label>Due date</label><input type="date" name="due_date" value="${m.due_date||""}"></div></div><button class="btn" type="submit">Save milestone</button><div id="modalError" class="notice"></div></form>`,async f=>{await api("update_milestone",{id,title:f.get("title"),description:f.get("description"),status:f.get("status"),due_date:f.get("due_date")});await openProject(p.project.id)});
}
async function acceptProposal(id){
  if(!state.currentProject)return;
  if(!confirm("Accept this proposal? This action will be recorded in the project history."))return;
  try{
    await api("accept_proposal",{id});
    showNotice("Proposal accepted.");
    await openProject(state.currentProject.project.id);
  }catch(e){showNotice(e.message)}
}

function projectForm(title,fieldsHtml,handler){
  const p=state.currentProject?.project;if(!p)return;
  openModal(title,`<form class="form">${fieldsHtml}<button class="btn" type="submit">Save</button><div id="modalError" class="notice"></div></form>`,async f=>{await handler(f,p);await openProject(p.id)});
}
$("#postUpdate")?.addEventListener("click",()=>projectForm("Post project update",`<div class="field"><label>Title</label><input name="title" required></div><div class="field"><label>Update</label><textarea name="body" rows="6" required></textarea></div><div class="field"><label>Visibility</label><select name="visibility"><option value="client">Client visible</option><option value="internal">Internal only</option></select></div>`,(f,p)=>api("post_update",{project_id:p.id,title:f.get("title"),body:f.get("body"),visibility:f.get("visibility")})));
$("#addDocument")?.addEventListener("click",()=>projectForm("Add document or project link",`<div class="field"><label>Title</label><input name="title" required></div><div class="field"><label>Upload private file</label><input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.zip,.docx,.xlsx,.pptx"><div class="meta">Private Supabase Storage · maximum 20 MB</div></div><div class="field"><label>Or HTTPS URL</label><input name="url" type="url" placeholder="https://"></div><div class="form two"><div class="field"><label>Kind</label><select name="kind"><option>document</option><option>proposal</option><option>contract</option><option>design</option><option>report</option><option>link</option><option>other</option></select></div><div class="field"><label>Visibility</label><select name="visibility"><option value="client">Client visible</option><option value="internal">Internal only</option></select></div></div>`,async(f,p)=>{
  const file=f.get("file");
  const url=String(f.get("url")||"").trim();
  if((!file||!file.size)&&!url) throw new Error("Choose a file or provide an HTTPS URL");
  let storagePath="";
  if(file&&file.size){
    if(file.size>20*1024*1024) throw new Error("File exceeds the 20 MB limit");
    const safe=String(file.name||"file").replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-120);
    storagePath=`${p.id}/${Date.now()}-${crypto.randomUUID()}-${safe}`;
    const {error}=await supabase.storage.from("project-files").upload(storagePath,file,{upsert:false,cacheControl:"3600"});
    if(error) throw error;
  }
  try{
    await api("add_document",{project_id:p.id,title:f.get("title"),url,storage_path:storagePath,size_bytes:file?.size||null,mime_type:file?.type||null,kind:f.get("kind"),visibility:f.get("visibility")});
  }catch(err){
    if(storagePath) await supabase.storage.from("project-files").remove([storagePath]).catch(()=>{});
    throw err;
  }
}));
$("#addMember")?.addEventListener("click",()=>projectForm("Add client member",`<div class="field"><label>Email</label><input name="email" type="email" required></div><div class="field"><label>Display name</label><input name="display_name"></div><div class="field"><label>Role</label><select name="role"><option>client</option><option>stakeholder</option></select></div>`,(f,p)=>api("add_member",{project_id:p.id,email:f.get("email"),display_name:f.get("display_name"),role:f.get("role")})));
$("#createProposal")?.addEventListener("click",()=>projectForm("Create proposal",`<div class="field"><label>Title</label><input name="title" required></div><div class="field"><label>Scope</label><textarea name="scope" rows="6"></textarea></div><div class="form two"><div class="field"><label>Currency</label><input name="fee_currency" value="USD"></div><div class="field"><label>Fee</label><input name="fee_amount" type="number" min="0" step="0.01"></div><div class="field"><label>Status</label><select name="status"><option>draft</option><option>sent</option><option>accepted</option><option>declined</option></select></div><div class="field"><label>Valid until</label><input type="date" name="valid_until"></div></div>`,(f,p)=>api("create_proposal",{project_id:p.id,title:f.get("title"),scope:f.get("scope"),fee_currency:f.get("fee_currency"),fee_amount:f.get("fee_amount"),status:f.get("status"),valid_until:f.get("valid_until")})));

supabase.auth.onAuthStateChange((_event,session)=>{state.session=session;if(!session)showLogin()});
restore();
