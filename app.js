(() => {
  gsap.registerPlugin(ScrollTrigger);
  const esc=(s="")=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmtDate=s=>{if(!s)return"";const[y,m]=s.split("-");const M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return m?`${M[+m-1]} ${y}`:y};
  const range=(a,b)=>{const s=fmtDate(a),e=b?fmtDate(b):"Present";return s===e?s:`${s} — ${e}`};
  const splitC=(t,em)=>{let h="";for(const c of t)h+=c===" "?'<span class="char space"></span>':`<span class="char">${esc(c)}</span>`;if(em)for(const c of em)h+=c===" "?'<span class="char space em-char"></span>':`<span class="char em-char">${esc(c)}</span>`;return h};
  const ICO={
    email:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    linkedin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5 1.78 1.78 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>',
    github:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.2.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0012 .3"/></svg>',
    leetcode:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M13.5 2L4 12l9.5 10M20 12H9"/></svg>',
    kaggle:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.8 23.6c-.03.1-.12.14-.27.14h-3.06c-.18 0-.34-.08-.47-.24L9.9 16.9l-1.44 1.38v4.92c0 .22-.11.33-.33.33H5.75c-.22 0-.33-.11-.33-.33V.6c0-.22.11-.33.33-.33h2.38c.22 0 .33.11.33.33v14.2l6.1-6.17c.13-.13.28-.2.45-.2h3.18c.14 0 .23.06.27.17.04.13.03.22-.04.28l-6.43 6.23 6.72 8.24c.09.08.1.17.06.27z"/></svg>',
    loc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  };

  /* ─── CURSOR ─── */
  function initCursor(){
    if(matchMedia("(pointer:coarse)").matches||innerWidth<900)return;
    const d=document.getElementById("cursor"),r=document.getElementById("cursorRing");
    let cx=0,cy=0,rx=0,ry=0;
    document.addEventListener("mousemove",e=>{cx=e.clientX;cy=e.clientY;d.style.left=cx+"px";d.style.top=cy+"px"});
    (function f(){rx+=(cx-rx)*.1;ry+=(cy-ry)*.1;r.style.left=rx+"px";r.style.top=ry+"px";requestAnimationFrame(f)})();
    const HOV="a,button,.proj-card,.skill-chip,.cert-card,.edu-card,.btn,.about__lang";
    document.addEventListener("mouseover",e=>{if(e.target.closest(HOV))document.body.classList.add("cursor-hover")});
    document.addEventListener("mouseout",e=>{if(e.target.closest(HOV)&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest(HOV)))document.body.classList.remove("cursor-hover")});
  }

  /* ─── MAGNETIC ─── */
  function initMagnetic(){
    if(matchMedia("(pointer:coarse)").matches||innerWidth<900)return;
    document.querySelectorAll(".magnetic").forEach(el=>{
      el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-(r.left+r.width/2))*.2,y:(e.clientY-(r.top+r.height/2))*.2,duration:.4,ease:"power3.out",overwrite:true})});
      el.addEventListener("mouseleave",()=>gsap.to(el,{x:0,y:0,duration:.5,ease:"power3.out",overwrite:true}));
    });
  }

  /* ─── PARTICLES ─── */
  function initParticles(){
    const c=document.getElementById("particles"),x=c.getContext("2d");let W,H;const ds=[];
    function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener("resize",rs);
    for(let i=0;i<45;i++)ds.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.3,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,a:Math.random()*.25+.06});
    (function d(){x.clearRect(0,0,W,H);for(const p of ds){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=`rgba(212,128,74,${p.a})`;x.fill()}requestAnimationFrame(d)})();
  }

  /* ─── TILT ─── */
  function initTilt(){
    if(matchMedia("(pointer:coarse)").matches||innerWidth<900)return;
    document.querySelectorAll("[data-tilt]").forEach(card=>{
      card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect();const mx=(e.clientX-r.left)/r.width,my=(e.clientY-r.top)/r.height;card.style.setProperty("--mx",mx*100+"%");card.style.setProperty("--my",my*100+"%");gsap.to(card,{rotateX:(my-.5)*-6,rotateY:(mx-.5)*6,transformPerspective:900,duration:.5,ease:"power2.out",overwrite:true})});
      card.addEventListener("mouseleave",()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.5,ease:"power3.out",overwrite:true}));
    });
  }

  /* ─── RENDER ─── */
  function render(data){
    const p=data.profile,c=p.contacts;
    // Loader
    document.getElementById("loaderName").innerHTML=p.fullName.split("").map(ch=>ch===" "?'<span class="char" style="width:.25em">&nbsp;</span>':`<span class="char">${esc(ch)}</span>`).join("");
    // Hero title — massive centered chars
    document.getElementById("heroTag").textContent="Data · ML · Dublin";
    const parts=p.fullName.split(" "),first=parts[0],last=parts.slice(1).join(" ")+".";
    let tH='<span class="line">';for(const ch of first)tH+=`<span class="char">${esc(ch)}</span>`;
    tH+='</span><span class="line"><span class="em-wrap">';for(const ch of last)tH+=ch===" "?'<span class="char space"></span>':`<span class="char">${esc(ch)}</span>`;
    tH+='</span></span>';
    document.getElementById("heroTitle").innerHTML=tH;
    document.getElementById("heroSub").textContent=p.headline;
    // Socials
    [c.email&&{href:`mailto:${c.email}`,icon:"email",label:"Email"},c.linkedin&&{href:c.linkedin,icon:"linkedin",label:"LinkedIn"},c.github&&{href:c.github,icon:"github",label:"GitHub"},c.kaggle&&{href:c.kaggle,icon:"kaggle",label:"Kaggle"},c.leetcode&&{href:c.leetcode,icon:"leetcode",label:"LeetCode"}].filter(Boolean).forEach(s=>{
      document.getElementById("heroSocials").insertAdjacentHTML("beforeend",`<a href="${esc(s.href)}" target="_blank" rel="noopener" aria-label="${s.label}" class="magnetic">${ICO[s.icon]}</a>`);
    });
    // Statements — wrap each word, keeping <em> styling intact
    ["statementText","statementText2"].forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      const out=[];
      el.childNodes.forEach(n=>{
        const isEm=n.nodeName==="EM";
        (n.textContent||"").split(/\s+/).filter(Boolean).forEach(w=>out.push(isEm?`<span class="word"><em>${esc(w)}</em></span>`:`<span class="word">${esc(w)}</span>`));
      });
      el.innerHTML=out.join(" ");
    });
    // Marquees
    const allSkills=[...new Set((data.skills?.categories||[]).flatMap(c=>c.items))];
    const mc=allSkills.map(s=>`<span>${esc(s)}</span>`).join('<span class="sep">◆</span>');
    const d2=mc+'<span class="sep">◆</span>'+mc;
    document.getElementById("marqueeTrack").innerHTML=d2;
    document.getElementById("marqueeTrack2").innerHTML=d2;
    // About
    document.getElementById("aboutText").innerHTML=p.summary.split(/\n\s*\n/).map(para=>`<p>${para.trim().split(/\s+/).map(w=>`<span class="word">${esc(w)}</span>`).join(" ")}</p>`).join("");
    document.getElementById("aboutLangs").innerHTML=(data.languages||[]).map(l=>`<span class="about__lang">${esc(l.name)} · ${esc(l.level)}</span>`).join("");
    // Experience — store for pinned reveal
    window.__expData=data.experience||[];
    document.getElementById("expTotal").textContent=String(window.__expData.length).padStart(2,"0");
    if(window.__expData.length)showExp(0);
    // Projects
    const pg=document.getElementById("projectsGrid");
    (data.projects||[]).forEach((pr,i)=>{
      const links=(pr.links||[]).map(l=>`<a class="proj-link magnetic" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");
      const skills=(pr.skills||[]).slice(0,6).map(s=>`<span class="tag">${esc(s)}</span>`).join("");
      const metrics=(pr.metrics||[]).length?`<div class="proj-card__metrics">${pr.metrics.map(m=>`<span>${esc(m)}</span>`).join("")}</div>`:"";
      const when=pr.start?(pr.end?range(pr.start,pr.end):fmtDate(pr.start)):"";
      const meta=[pr.associatedWith,when].filter(Boolean).join(" · ");
      const hl=pr.highlights||[];
      const body=pr.featured?`<ul class="proj-card__list">${hl.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>`:`<p class="proj-card__desc">${esc(hl[0]||"")}</p>`;
      pg.insertAdjacentHTML("beforeend",`<article class="proj-card${pr.featured?" proj-card--featured":""}" data-tilt><div class="proj-card__shine"></div><span class="proj-card__num">${pr.featured?"FEATURED":"PROJ"} / ${String(i+1).padStart(2,"0")}</span><h3 class="proj-card__title">${esc(pr.title)}</h3>${meta?`<div class="proj-card__assoc">${esc(meta)}</div>`:""}${metrics}${body}<div class="proj-card__footer"><div class="tags">${skills}</div>${links?`<div class="proj-card__links">${links}</div>`:""}</div></article>`);
    });
    const ar=document.getElementById("projectsArchive");
    if(ar&&(data.archive||[]).length){
      ar.innerHTML=`<h3 class="archive__title">Earlier &amp; smaller projects</h3><ul class="archive__list">${data.archive.map(a=>{const t=a.url?`<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)} ↗</a>`:`<span>${esc(a.title)}</span>`;return `<li>${t}<span class="archive__meta">${esc(a.context||"")} · ${esc(a.year||"")}</span></li>`}).join("")}</ul>`;
    }
    // Skills
    const catC=document.getElementById("skillsCats");(data.skills?.categories||[]).forEach((cat,i)=>{const btn=document.createElement("button");btn.className="skill-cat-btn"+(i===0?" active":"");btn.textContent=cat.label;btn.dataset.index=i;catC.appendChild(btn)});
    switchCat(0);catC.addEventListener("click",e=>{const b=e.target.closest(".skill-cat-btn");if(b)switchCat(+b.dataset.index)});
    // Education
    (data.education||[]).forEach(e=>{document.getElementById("eduList").insertAdjacentHTML("beforeend",`<div class="edu-card"><h3 class="edu-card__qual">${esc(e.qualification)}</h3><div class="edu-card__inst">${esc(e.institution)}</div>${e.note?`<p class="edu-card__note">${esc(e.note)}</p>`:""}<div class="edu-card__meta"><span>${esc(range(e.start,e.end))}</span><span>${esc(e.location||"")}</span></div></div>`)});
    // Certifications
    (data.certifications||[]).forEach(ct=>{document.getElementById("certGrid").insertAdjacentHTML("beforeend",`<div class="cert-card"><h3 class="cert-card__title">${esc(ct.title)}</h3><div class="cert-card__issuer">${esc(ct.issuer)}</div><span class="cert-card__date">Issued ${esc(ct.issued)}</span>${ct.credentialUrl?`<a class="cert-card__link magnetic" href="${esc(ct.credentialUrl)}" target="_blank" rel="noopener">View credential</a>`:""}</div>`)});
    // Contact
    document.getElementById("contactTitle").innerHTML=splitC("Let's ","connect.");
    [c.email&&{href:`mailto:${c.email}`,label:c.email,icon:"email"},c.linkedin&&{href:c.linkedin,label:"LinkedIn",icon:"linkedin"},c.github&&{href:c.github,label:"GitHub",icon:"github"},c.kaggle&&{href:c.kaggle,label:"Kaggle",icon:"kaggle"},c.leetcode&&{href:c.leetcode,label:"LeetCode",icon:"leetcode"}].filter(Boolean).forEach(l=>{const ext=!l.href.startsWith("mailto:");document.getElementById("contactLinks").insertAdjacentHTML("beforeend",`<a class="contact__link magnetic" href="${esc(l.href)}"${ext?' target="_blank" rel="noopener"':""}>${ICO[l.icon]}<span>${esc(l.label)}</span></a>`)});
    document.getElementById("contactLinks").insertAdjacentHTML("beforeend",`<span class="contact__link contact__link--static">${ICO.loc}<span>${esc(p.location||"Dublin, Ireland")}</span></span>`);
    document.getElementById("footerYear").textContent=new Date().getFullYear();
    document.getElementById("footerName").textContent=p.fullName;
  }

  /* ─── Experience reveal (GTA VI character-style) ─── */
  function showExp(idx){
    const exp=window.__expData;if(!exp||!exp[idx])return;
    const x=exp[idx];
    const card=document.getElementById("expCard");
    // Animate out then in
    gsap.to(card,{opacity:0,y:20,duration:.3,ease:"power2.in",onComplete:()=>{
      document.getElementById("expDates").textContent=range(x.start,x.end);
      document.getElementById("expRole").textContent=x.title;
      document.getElementById("expCompany").textContent=x.company;
      document.getElementById("expLocation").textContent=x.location||"";
      document.getElementById("expHighlights").innerHTML=(x.highlights||[]).map(h=>`<li>${esc(h)}</li>`).join("");
      document.getElementById("expTags").innerHTML=(x.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("");
      document.getElementById("expIdx").textContent=String(idx+1).padStart(2,"0");
      gsap.fromTo(card,{opacity:0,y:20},{opacity:1,y:0,duration:.6,ease:"power3.out"});
    }});
  }

  /* ─── Skill switch ─── */
  function switchCat(idx){
    const cats=window.__portfolioData?.skills?.categories||[];const cat=cats[idx];if(!cat)return;
    const d=document.getElementById("skillsDisplay"),cc=document.getElementById("skillsCats");
    cc.querySelectorAll(".skill-cat-btn").forEach((b,j)=>b.classList.toggle("active",j===idx));
    const old=d.querySelectorAll(".skill-chip");
    if(old.length){gsap.to(old,{opacity:0,y:8,duration:.2,stagger:.01,ease:"power2.in",onComplete:()=>{d.innerHTML="";addChips(cat.items)}});}else addChips(cat.items);
  }
  function addChips(items){
    const d=document.getElementById("skillsDisplay");
    items.forEach(item=>d.insertAdjacentHTML("beforeend",`<span class="skill-chip">${esc(item)}</span>`));
    gsap.fromTo(d.querySelectorAll(".skill-chip"),{opacity:0,y:14},{opacity:1,y:0,duration:.4,stagger:.025,ease:"power3.out"});
  }

  /* ─── Scroll spy ─── */
  function initScrollSpy(){
    ["about","experience","projects","skills","education","certifications","contact"].forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      ScrollTrigger.create({trigger:el,start:"top 40%",end:"bottom 40%",onToggle:self=>{
        document.querySelectorAll(".nav__link[data-section]").forEach(l=>l.classList.toggle("active",self.isActive&&l.dataset.section===id));
      }});
    });
  }

  /* ═══════════ ALL GSAP ANIMATIONS ═══════════ */
  function initAnimations(){
    const mm=gsap.matchMedia();

    /* Progress */
    ScrollTrigger.create({start:0,end:"max",onUpdate:s=>document.getElementById("progress").style.setProperty("--sp",(s.progress*100)+"%")});

    /* Nav — hidden initially, appears after hero */
    ScrollTrigger.create({trigger:".hero",start:"80% top",onEnter:()=>{document.getElementById("nav").classList.add("visible");gsap.to("#nav",{opacity:1,y:0,duration:.6,ease:"power3.out"})},once:true});
    ScrollTrigger.create({start:30,onUpdate:s=>document.getElementById("nav").classList.toggle("scrolled",s.scroll()>30)});

    /* ─── HERO — massive centered reveal ─── */
    const hTl=gsap.timeline({defaults:{ease:"power3.out"}});
    hTl.to(".hero__title .char",{y:0,opacity:1,duration:1,stagger:.02})
       .to(".hero__tag",{opacity:1,duration:.6},"-=0.3")
       .to(".hero__sub",{opacity:1,duration:.6},"-=0.2")
       .to(".hero__actions",{opacity:1,duration:.6},"-=0.2")
       .to(".hero__socials",{opacity:1,duration:.6},"-=0.2")
       .to("#heroScroll",{opacity:1,duration:.5},"-=0.1")
       .to(".hero__scene",{opacity:.6,y:0,scale:1,duration:1.2,ease:"power3.out"},"-=1.2");

    /* Coder scene animations */
    const clTl=gsap.timeline({delay:1.6});
    document.querySelectorAll(".code-line").forEach((l,i)=>{gsap.set(l,{scaleX:0});clTl.to(l,{scaleX:1,duration:.25+Math.random()*.2,ease:"power2.out"},i*.1)});
    document.querySelectorAll(".float-sym").forEach((sym,i)=>{
      gsap.to(sym,{opacity:.25+Math.random()*.2,duration:.8,delay:2.2+i*.35,ease:"power2.out"});
      gsap.to(sym,{y:-20-Math.random()*30,x:(Math.random()-.5)*20,duration:4+Math.random()*3,ease:"sine.inOut",repeat:-1,yoyo:true,delay:2.2+i*.35});
    });
    gsap.to(".coder__head",{y:-2,duration:3,ease:"sine.inOut",repeat:-1,yoyo:true,delay:2});

    /* Hero scroll parallax — foreground exits faster than scene */
    gsap.to(".hero__fg",{y:-100,opacity:0,scrollTrigger:{trigger:".hero",start:"40% top",end:"90% top",scrub:true}});
    gsap.to(".hero__scene",{y:60,opacity:0,scale:.9,scrollTrigger:{trigger:".hero",start:"50% top",end:"bottom top",scrub:true}});
    gsap.to(".hero__bg-layer",{scale:1.1,opacity:.2,scrollTrigger:{trigger:".hero",start:"40% top",end:"bottom top",scrub:true}});
    gsap.to(".float-sym",{y:-50,scrollTrigger:{trigger:".hero",start:"20% top",end:"bottom top",scrub:true}});

    /* ─── STATEMENTS — word-by-word scrub reveal ─── */
    document.querySelectorAll(".statement").forEach(sec=>{
      const words=sec.querySelectorAll(".word");if(!words.length)return;
      ScrollTrigger.create({trigger:sec,start:"top bottom",end:"bottom top",scrub:.5,
        onUpdate:self=>{const lit=Math.ceil(self.progress*2*words.length);words.forEach((w,i)=>w.classList.toggle("lit",i<lit))}
      });
    });

    /* ─── ABOUT — pinned word reveal ─── */
    mm.add("(min-width:861px)",()=>{
      const aboutEl=document.querySelector(".about");
      const words=aboutEl.querySelectorAll(".about__text .word");
      const wc=words.length;
      const sd=Math.max(wc*18,innerHeight*1.5);
      aboutEl.style.height=(sd+innerHeight)+"px";
      ScrollTrigger.create({trigger:aboutEl,start:"top top",end:"bottom bottom",pin:".about__pin",pinSpacing:false,invalidateOnRefresh:true});
      if(wc)ScrollTrigger.create({trigger:aboutEl,start:"top top",end:()=>`bottom-=${innerHeight*.5} bottom`,scrub:.5,invalidateOnRefresh:true,
        onUpdate:self=>{const lit=Math.ceil(self.progress*wc);words.forEach((w,i)=>w.classList.toggle("lit",i<lit))}});
      gsap.fromTo(".about__langs",{opacity:0,y:16},{opacity:1,y:0,duration:.8,scrollTrigger:{trigger:aboutEl,start:"70% center",end:"85% center",scrub:true,invalidateOnRefresh:true}});
      gsap.fromTo(".about__orb",{scale:.85},{scale:1.05,scrollTrigger:{trigger:aboutEl,start:"top top",end:"bottom bottom",scrub:true}});
    });

    /* ─── EXPERIENCE — GTA VI pinned full-viewport reveal ─── */
    mm.add("(min-width:861px)",()=>{
      const sec=document.querySelector(".experience");
      const expData=window.__expData||[];
      const total=expData.length;if(!total)return;
      const scrollPer=innerHeight*.9;
      const totalScroll=scrollPer*total;
      sec.style.height=(totalScroll+innerHeight)+"px";
      let currentExp=0;
      ScrollTrigger.create({trigger:sec,start:"top top",end:()=>`+=${totalScroll}`,pin:".experience__pin",anticipatePin:1,invalidateOnRefresh:true,
        onRefresh:()=>{sec.style.height=(scrollPer*total+innerHeight)+"px"},
        onUpdate:self=>{
          const idx=Math.min(Math.floor(self.progress*total),total-1);
          document.getElementById("expProgressFill").style.width=(self.progress*100)+"%";
          if(idx!==currentExp){currentExp=idx;showExp(idx)}
        }
      });
    });

    /* ─── PROJECTS ─── */
    gsap.utils.toArray(".proj-card").forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.9,ease:"power3.out",scrollTrigger:{trigger:c,start:"top 90%",toggleActions:"play none none none"},delay:(i%2)*.1}));

    /* ─── SKILLS ─── */
    mm.add("(min-width:861px)",()=>{
      const ss=document.querySelector(".skills");const cbs=document.querySelectorAll(".skill-cat-btn");const tc=cbs.length;if(!tc)return;
      const sp=innerHeight*.65,ts=sp*tc;ss.style.height=(ts+innerHeight)+"px";
      let cc=0;
      ScrollTrigger.create({trigger:ss,start:"top top",end:()=>`+=${ts}`,pin:".skills__pin",anticipatePin:1,invalidateOnRefresh:true,
        onRefresh:()=>{ss.style.height=(sp*tc+innerHeight)+"px"},
        onUpdate:self=>{const idx=Math.min(Math.floor(self.progress*tc),tc-1);if(idx!==cc){cc=idx;switchCat(idx)}}
      });
    });

    /* ─── EDUCATION ─── */
    gsap.utils.toArray(".edu-card").forEach((c,i)=>gsap.to(c,{opacity:1,x:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger:c,start:"top 88%",toggleActions:"play none none none"},delay:i*.08}));

    /* ─── CERTS ─── */
    gsap.utils.toArray(".cert-card").forEach((c,i)=>gsap.to(c,{opacity:1,y:0,duration:.7,ease:"power3.out",scrollTrigger:{trigger:c,start:"top 90%",toggleActions:"play none none none"},delay:(i%3)*.07}));

    /* ─── CONTACT ─── */
    ScrollTrigger.create({trigger:".contact",start:"top 70%",once:true,onEnter:()=>{
      gsap.to(".contact__title .char",{y:0,opacity:1,duration:.7,stagger:.02,ease:"power3.out"});
      gsap.to(".contact__sub",{opacity:1,y:0,duration:.7,delay:.3,ease:"power3.out"});
      gsap.to(".contact__link",{opacity:1,y:0,duration:.5,stagger:.05,delay:.5,ease:"power3.out"});
    }});

    /* Labels & titles */
    gsap.utils.toArray(".anim-label").forEach(el=>gsap.fromTo(el,{opacity:0,x:-20},{opacity:1,x:0,duration:.7,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 92%",toggleActions:"play none none none"}}));
    gsap.utils.toArray(".anim-title").forEach(el=>gsap.fromTo(el,{opacity:0,y:28},{opacity:1,y:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",toggleActions:"play none none none"}}));

    /* Glow parallax */
    gsap.to(".hero__glow--1",{y:200,scrollTrigger:{start:"top top",end:"bottom bottom",scrub:3}});
    gsap.to(".hero__glow--2",{y:-200,scrollTrigger:{start:"top top",end:"bottom bottom",scrub:3}});

    initScrollSpy();
  }

  /* ─── LOADER ─── */
  function runLoader(cb){
    const fill=document.getElementById("loaderFill"),pct=document.getElementById("loaderPct"),chars=document.querySelectorAll(".loader__name .char");
    gsap.to(chars,{y:0,opacity:1,duration:.6,stagger:.03,ease:"power3.out",delay:.15});
    let v=0;const t=setInterval(()=>{v+=Math.floor(Math.random()*10)+12;if(v>100)v=100;fill.style.width=v+"%";pct.textContent=v;
      if(v>=100){clearInterval(t);gsap.to(chars,{y:-80,opacity:0,duration:.4,stagger:.015,ease:"power3.in",delay:.25});gsap.to("#loader",{opacity:0,duration:.6,delay:.7,onComplete:()=>{document.getElementById("loader").classList.add("done");cb()}})}
    },30);
  }

  /* ─── RESIZE ─── */
  let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>ScrollTrigger.refresh(),200)});

  /* ─── BOOT ─── */
  const nt=document.getElementById("navToggle"),nm=document.getElementById("navMenu");
  nt.addEventListener("click",()=>{nt.classList.toggle("open");nm.classList.toggle("open")});
  nm.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nt.classList.remove("open");nm.classList.remove("open")}));

  fetch("portfolio-data.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(data=>{
    window.__portfolioData=data;render(data);
    runLoader(()=>{initCursor();initMagnetic();initParticles();initTilt();initAnimations();ScrollTrigger.refresh()});
  }).catch(err=>{document.getElementById("loader").innerHTML=`<div style="text-align:center;padding:40px;font-family:system-ui"><h2>Failed to load data</h2><p style="color:#a09889;margin-top:8px">${err.message}</p><p style="color:#5c5549;margin-top:12px">Run: <code>python3 -m http.server</code></p></div>`});
})();
