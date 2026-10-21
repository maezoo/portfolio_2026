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

    // Project 01: staggered entrance when its slide becomes visible.
    // Each element reveals once; reduced-motion users see everything immediately.
    const creafit=track.querySelector(".showcase-creafit");
    if(creafit){
      const elements=[
        creafit.querySelector(".showcase-index"),
        creafit.querySelector(".showcase-title"),
        creafit.querySelector(".creafit-project-name"),
        creafit.querySelector(".showcase-description"),
        creafit.querySelector(".creafit-project-meta"),
        creafit.querySelector(".creafit-project-links"),
        creafit.querySelector(".creafit-desktop-device"),
        creafit.querySelector(".creafit-mobile-device")
      ].filter(Boolean);
      const reveal=function(){elements.forEach(function(el){el.classList.add("is-entered");});};
      if(!reducedMotion&&"IntersectionObserver" in window){
        elements.forEach(function(el,index){
          el.classList.add("creafit-entry");
          el.style.setProperty("--creafit-delay",(index<6?index*105:(index===6?230:390))+"ms");
        });
        const projectObserver=new IntersectionObserver(function(entries){
          if(entries.some(function(entry){return entry.isIntersecting;})){
            reveal();
            projectObserver.disconnect();
          }
        },{threshold:0.22});
        projectObserver.observe(creafit);
      }else{
        reveal();
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
})();
