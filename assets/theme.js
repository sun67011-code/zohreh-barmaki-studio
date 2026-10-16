(()=>{
  const root=document.documentElement;
  const themeButton=document.getElementById("themeToggle");
  const meta=document.querySelector('meta[name="theme-color"]');
  const KEY="zb-theme";
  const getPreferred=()=>{
    try{const value=localStorage.getItem(KEY);if(value==="dark"||value==="light")return value;}catch(e){}
    return "light";
  };
  const apply=(mode,persist=false)=>{
    const next=mode==="dark"?"dark":"light";
    root.dataset.theme=next;
    root.style.colorScheme=next;
    if(meta) meta.setAttribute("content",next==="dark"?"#101113":"#f4f2ed");
    if(themeButton){
      themeButton.setAttribute("aria-label",next==="dark"?"Switch to light mode":"Switch to dark mode");
      themeButton.setAttribute("aria-pressed",String(next==="dark"));
      const icon=themeButton.querySelector(".theme-icon");
      const label=themeButton.querySelector(".theme-label");
      if(icon)icon.textContent=next==="dark"?"☀":"☾";
      if(label)label.textContent=next==="dark"?"Light":"Dark";
      themeButton.title=next==="dark"?"Switch to light mode":"Switch to dark mode";
    }
    if(persist){try{localStorage.setItem(KEY,next)}catch(e){}}
  };
  apply(getPreferred());
  themeButton?.addEventListener("click",()=>apply(root.dataset.theme==="dark"?"light":"dark",true));
})();
