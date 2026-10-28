(function(){
  "use strict";
  const menuBtn=document.getElementById("menuBtn");
  const nav=document.getElementById("mainNav");

  if(menuBtn&&nav){
    function setMenu(open){
      nav.classList.toggle("open",open);
      menuBtn.setAttribute("aria-expanded",String(open));
      menuBtn.setAttribute("aria-label",open?"메뉴 닫기":"메뉴 열기");
    }
    menuBtn.addEventListener("click",function(){setMenu(!nav.classList.contains("open"));});
    nav.querySelectorAll("a").forEach(function(link){link.addEventListener("click",function(){setMenu(false);});});
    document.addEventListener("keydown",function(event){if(event.key==="Escape")setMenu(false);});
    document.addEventListener("click",function(event){if(!nav.contains(event.target)&&!menuBtn.contains(event.target))setMenu(false);});
  }

  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animated=document.querySelectorAll(".reveal");
  if(!reducedMotion&&"IntersectionObserver" in window){
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:0.06,rootMargin:"0px 0px -35px 0px"});
    animated.forEach(function(element){observer.observe(element);});
  }else{
    animated.forEach(function(element){element.classList.add("visible");});
  }

  // Reveal the existing fixed header after the interactive entry screen.
  (function initPortalHeader(){
    const header=document.getElementById("siteHeader");
    const portal=document.querySelector(".portal-intro");
    if(!header||!portal)return;
    function updateHeader(){
      const show=portal.getBoundingClientRect().bottom<=window.innerHeight*.72;
      header.classList.toggle("is-visible",show);
      header.setAttribute("aria-hidden",show?"false":"true");
      if(!show&&header.contains(document.activeElement))document.activeElement.blur();
    }
    window.addEventListener("scroll",updateHeader,{passive:true});
    window.addEventListener("resize",updateHeader);
    updateHeader();
  })();

  const filters=Array.from(document.querySelectorAll(".archive-filters .filter"));
  const archive=Array.from(document.querySelectorAll(".archive-item"));
  filters.forEach(function(button){
    button.addEventListener("click",function(){
      const selected=button.dataset.filter;
      filters.forEach(function(item){
        const active=item===button;
        item.classList.toggle("active",active);
        item.setAttribute("aria-pressed",String(active));
      });
      archive.forEach(function(item){
        const matches=selected==="all"||item.dataset.type===selected;
        item.classList.toggle("hide",!matches);
        item.hidden=!matches;
      });
    });
  });

  // Selected Projects: normal vertical scroll drives the horizontal track.
  // The sticky gallery releases automatically after the third project.
  (function initSelectedProjects(){
    const section=document.querySelector(".selected-scroll");
    const runway=document.getElementById("selectedRunway");
    const pin=document.getElementById("selectedPin");
    const track=document.getElementById("selectedTrack");
    const current=document.getElementById("selectedCurrent");
    const progressBar=document.getElementById("selectedProgressBar");
    const previous=document.getElementById("selectedPrev");
    const next=document.getElementById("selectedNext");
    if(!section||!runway||!pin||!track||!current||!progressBar||!previous||!next)return;

    const slides=Array.from(track.querySelectorAll(".feature"));

    // Project 01: stagger from early stage entry; never jump opacity to 1.
    const creafit=track.querySelector(".showcase-creafit");
    let updateCreafitEntry=function(){};
    if(creafit){
      const elements=[
        creafit.querySelector(".showcase-index"),
        creafit.querySelector(".showcase-title"),
        creafit.querySelector(".creafit-project-name"),
        creafit.querySelector(".showcase-description"),
        creafit.querySelector(".creafit-project-meta"),
        creafit.querySelector(".creafit-desktop-device"),
        creafit.querySelector(".creafit-mobile-device"),
        creafit.querySelector(".creafit-project-links")
      ].filter(Boolean);
      let started=false;
      if(reducedMotion){
        elements.forEach(function(el){el.classList.add("is-entered");});
      }else{
        const delays=[0,95,160,225,295,165,350,430];
        elements.forEach(function(el,i){
          el.classList.add("creafit-entry");
          el.style.setProperty("--creafit-delay",delays[i]+"ms");
        });
        updateCreafitEntry=function(pinnedMode,stageStart){
          if(started)return;
          const header=document.querySelector(".site-header");
          const topLimit=header?header.getBoundingClientRect().height:0;
          const bounds=(pinnedMode?pin:creafit).getBoundingClientRect();
          const viewportHeight=Math.max(1,window.innerHeight-topLimit);
          const visible=Math.max(0,Math.min(bounds.bottom,window.innerHeight)-Math.max(bounds.top,topLimit));
          const fraction=visible/Math.max(1,Math.min(bounds.height,viewportHeight));
          if(fraction>=.35||(pinnedMode&&window.scrollY>=stageStart)){
            started=true;
            window.requestAnimationFrame(function(){
              elements.forEach(function(el){el.classList.add("is-entered");});
            });
          }
        };
      }
    }
    // Project 02: independently reveal after the second slide is 35% visible.
    const donggam=track.querySelector(".showcase-donggam");
    let updateDonggamEntry=function(){};
    if(donggam){
      const dgElements=[
        donggam.querySelector(".showcase-index"),
        donggam.querySelector(".showcase-title"),
        donggam.querySelector(".donggam-project-name"),
        donggam.querySelector(".showcase-description"),
        donggam.querySelector(".donggam-project-meta"),
        donggam.querySelector(".donggam-browser"),
        donggam.querySelector(".donggam-mobile-mock"),
        donggam.querySelector(".donggam-project-links"),
        donggam.querySelector(".donggam-case-study-card")
      ].filter(Boolean);
      let dgStarted=false;
      if(!reducedMotion){
        const dgDelays=[0,95,160,225,295,165,350,430,575];
        dgElements.forEach(function(el,i){
          el.classList.add("donggam-entry");
          el.style.setProperty("--donggam-delay",dgDelays[i]+"ms");
        });
        updateDonggamEntry=function(pinnedMode){
          if(dgStarted)return;
          const rect=donggam.getBoundingClientRect();
          const header=document.querySelector(".site-header");
          const topLimit=header?header.getBoundingClientRect().height:0;
          const verticalVisible=Math.max(0,Math.min(rect.bottom,window.innerHeight)-Math.max(rect.top,topLimit));
          const horizontalVisible=Math.max(0,Math.min(rect.right,window.innerWidth)-Math.max(rect.left,0));
          const widthRatio=horizontalVisible/Math.max(1,Math.min(rect.width,window.innerWidth));
          const heightRatio=verticalVisible/Math.max(1,Math.min(rect.height,window.innerHeight-topLimit));
          if((pinnedMode?widthRatio>=.35&&heightRatio>=.7:widthRatio>=.35&&heightRatio>=.35)){
            dgStarted=true;
            window.requestAnimationFrame(function(){
              dgElements.forEach(function(el){el.classList.add("is-entered");});
            });
          }
        };
      }
    }
    const desktop=window.matchMedia("(min-width: 1025px) and (min-height: 700px)");
    let pinned=false;
    let travel=0;
    let start=0;
    let frame=0;
    let resizeFrame=0;
    let activeIndex=0;

    function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
    function renderIndicator(index,progress){
      activeIndex=index;
      current.textContent=String(index+1).padStart(2,"0");
      progressBar.style.transform="scaleX("+(1/slides.length+(1-1/slides.length)*progress)+")";
      previous.disabled=index===0;
      next.disabled=index===slides.length-1;
    }

    function render(){
      frame=0;
      updateCreafitEntry(pinned,start);
      updateDonggamEntry(pinned);
      if(pinned){
        const shift=clamp(window.scrollY-start,0,travel);
        track.style.transform="translate3d("+(-shift)+"px,0,0)";
        const index=slides.reduce(function(closest,slide,i){
          return Math.abs(slide.offsetLeft-shift)<Math.abs(slides[closest].offsetLeft-shift)?i:closest;
        },0);
        renderIndicator(index,travel>0?shift/travel:0);
      }else{
        const step=slides.length>1?(slides[1].offsetLeft-slides[0].offsetLeft):1;
        const index=clamp(Math.round(track.scrollLeft/Math.max(step,1)),0,slides.length-1);
        renderIndicator(index,slides.length>1?index/(slides.length-1):1);
      }
    }

    function requestRender(){
      if(!frame)frame=window.requestAnimationFrame(render);
    }

    function measure(){
      resizeFrame=0;
      pinned=desktop.matches;
      section.classList.toggle("has-pin",pinned);
      if(!pinned){
        runway.style.height="";
        section.style.removeProperty("--selected-header-height");
        section.style.removeProperty("--selected-stage-height");
        track.style.transform="";
        render();
        return;
      }
      const header=document.querySelector(".site-header");
      const headerHeight=header?header.getBoundingClientRect().height:0;
      const stageHeight=Math.max(400,window.innerHeight-headerHeight);
      section.style.setProperty("--selected-header-height",headerHeight+"px");
      section.style.setProperty("--selected-stage-height",stageHeight+"px");
      track.scrollLeft=0;
      travel=Math.max(0,track.scrollWidth-pin.clientWidth);
      runway.style.height=(stageHeight+travel)+"px";
      start=window.scrollY+runway.getBoundingClientRect().top-headerHeight;
      render();
    }

    function requestMeasure(){
      if(!resizeFrame)resizeFrame=window.requestAnimationFrame(measure);
    }

    function goTo(index){
      const destination=clamp(index,0,slides.length-1);
      if(pinned){
        const shift=clamp(slides[destination].offsetLeft,0,travel);
        window.scrollTo({top:start+shift,behavior:reducedMotion?"auto":"smooth"});
      }else{
        track.scrollTo({left:slides[destination].offsetLeft,behavior:reducedMotion?"auto":"smooth"});
      }
    }

    previous.addEventListener("click",function(){goTo(activeIndex-1);});
    next.addEventListener("click",function(){goTo(activeIndex+1);});
    window.addEventListener("scroll",requestRender,{passive:true});
    track.addEventListener("scroll",requestRender,{passive:true});
    window.addEventListener("resize",requestMeasure);
    if(desktop.addEventListener)desktop.addEventListener("change",requestMeasure);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(requestMeasure);
    measure();
  })();

  // First-section menu; the remaining navigation and sections are untouched.
  (function initDiagonalMenu(){
    const button=document.getElementById("diagonalMenuToggle");
    const menu=document.getElementById("diagonalMenu");
    if(!button||!menu)return;
    menu.hidden=false;
    menu.inert=true;
    menu.setAttribute("aria-hidden","true");
    function openMenu(open){
      menu.classList.toggle("is-open",open);
      menu.inert=!open;
      menu.setAttribute("aria-hidden",String(!open));
      button.setAttribute("aria-expanded",String(open));
      button.innerHTML=open?'CLOSE <span aria-hidden="true">×</span>':'MENU <span aria-hidden="true">☰</span>';
    }
    button.addEventListener("click",()=>openMenu(!menu.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>openMenu(false)));
    document.addEventListener("click",event=>{
      if(menu.classList.contains("is-open")&&!menu.contains(event.target)&&!button.contains(event.target))openMenu(false);
    });
    document.addEventListener("keydown",event=>{
      if(event.key==="Escape"&&menu.classList.contains("is-open")){openMenu(false);button.focus();}
    });
  })();

  // Whole-viewport diagonal sheets unfold in order while the split widens.
  (function initDiagonalPages(){
    const hero=document.querySelector(".diagonal-hero");
    if(!hero)return;
    const stage=hero.querySelector(".diagonal-stage");
    const left=hero.querySelector(".diagonal-left");
    const sheets=Array.from(hero.querySelectorAll(".diagonal-sheet"));
    const jumps=Array.from(hero.querySelectorAll("[data-diagonal-go]"));
    const desktop=window.matchMedia("(min-width:1100px) and (min-height:760px)");
    if(!stage||!left||sheets.length!==5||jumps.length!==5)return;
    const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
    const ease=t=>t*t*(3-2*t);
    let distance=0,enabled=false,frame=0,active=-1;

    function selectCard(index){
      if(active===index)return;
      active=index;
      jumps.forEach((button,i)=>button.setAttribute("aria-current",String(i===index)));
    }
    function render(){
      frame=0;
      if(!enabled)return;
      const progress=clamp(-hero.getBoundingClientRect().top/Math.max(1,distance),0,1);
      const raw=progress*(sheets.length-1);
      const base=Math.min(sheets.length-2,Math.floor(raw));
      const step=clamp(raw-base,0,1);
      // Deliberately preserve a readable interval at either end of each card.
      const unfold=ease(clamp((step-.13)/.73,0,1));
      const index=unfold>=.56?base+1:base;
      selectCard(index);

      // The right-hand diagonal paper progressively takes ownership of the viewport.
      const growth=ease(clamp(progress/.85,0,1));
      // Keep the diagonal proportion restrained while using its new width.
      const topCut=64-17*growth;
      const bottomCut=46-17*growth;
      const contentLeft=65.5-17*growth;
      hero.style.setProperty("--diagonal-top",topCut.toFixed(2)+"%");
      hero.style.setProperty("--diagonal-bottom",bottomCut.toFixed(2)+"%");
      hero.style.setProperty("--diagonal-content-left",contentLeft.toFixed(2)+"%");
      hero.style.setProperty("--diagonal-title-boost",(22*growth).toFixed(2)+"px");
      left.style.opacity=String(1-ease(clamp((progress-.20)/.55,0,1)));

      sheets.forEach((sheet,i)=>{
        const behind=i<base;
        const incoming=i===base+1;
        const shown=i===base;
        const reveal=behind||shown?100:(incoming?34+66*unfold:0);
        const alpha=behind||shown?1:(incoming?unfold:0);
        sheet.style.clipPath="polygon(0 0,"+reveal+"% 0,"+reveal+"% 100%,0 100%)";
        sheet.style.transform=incoming?
          "translate3d("+((1-unfold)*48).toFixed(1)+"px,"+(-(1-unfold)*12).toFixed(1)+"px,0) scale("+(0.985+0.015*unfold).toFixed(4)+")":
          "none";
        sheet.style.visibility=(behind||shown||incoming)?"visible":"hidden";
        sheet.style.setProperty("--diagonal-copy-alpha",String(incoming?ease(clamp((unfold-.38)/.48,0,1)):1));
        sheet.setAttribute("aria-hidden",String(i!==index));
      });
    }
    function requestRender(){if(!frame)frame=requestAnimationFrame(render);}
    function measure(){
      enabled=desktop.matches&&!reducedMotion;
      hero.classList.toggle("is-pinned",enabled);
      if(enabled){
        distance=Math.round(clamp(window.innerHeight*2.1,1450,2600));
        hero.style.height=(window.innerHeight+distance)+"px";
        stage.style.height=window.innerHeight+"px";
        active=-1;
        render();
      }else{
        hero.style.removeProperty("height");
        stage.style.removeProperty("height");
        left.style.removeProperty("opacity");
        for(const property of ["--diagonal-top","--diagonal-bottom","--diagonal-content-left","--diagonal-title-boost"])hero.style.removeProperty(property);
        sheets.forEach(sheet=>{
          for(const property of ["clip-path","transform","visibility","--diagonal-copy-alpha"])sheet.style.removeProperty(property);
          sheet.removeAttribute("aria-hidden");
        });
        active=-1;
        selectCard(0);
      }
    }
    function goTo(index){
      index=clamp(index,0,sheets.length-1);
      if(!enabled){sheets[index].scrollIntoView({behavior:reducedMotion?"auto":"smooth",block:"center"});return;}
      const start=window.scrollY+hero.getBoundingClientRect().top;
      window.scrollTo({top:start+distance*index/(sheets.length-1),behavior:"smooth"});
    }
    jumps.forEach((button,i)=>button.addEventListener("click",()=>goTo(i)));
    window.addEventListener("scroll",requestRender,{passive:true});
    window.addEventListener("resize",measure);
    if(desktop.addEventListener)desktop.addEventListener("change",measure);
    measure();
  })();

  // Small intro reveal. Scrolling remains fully user-controlled.
  (function initDiagonalEntry(){
    const hero=document.querySelector(".diagonal-hero");
    const g=window.gsap;
    if(!hero||!g||reducedMotion)return;
    const lines=hero.querySelectorAll(".diagonal-line");
    const discipline=hero.querySelector(".diagonal-discipline");
    const intro=hero.querySelector(".diagonal-intro");
    if(lines.length!==3||!discipline||!intro)return;
    g.timeline({defaults:{ease:"power3.out"}})
      .from(discipline,{y:12,opacity:0,duration:.5},0)
      .from(lines,{y:24,opacity:0,stagger:.12,duration:.66},.08)
      .from(intro,{y:14,opacity:0,duration:.55},.48);
  })();

})();
