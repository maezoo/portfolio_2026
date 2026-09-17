(function(){
  const body=document.body;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP=typeof window.gsap!=='undefined';
  const hasST=typeof window.ScrollTrigger!=='undefined';
  const nav=document.getElementById('nav');
  const menuBtn=document.getElementById('menuBtn');

  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      const open=nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');});});
  }

  document.querySelectorAll('[data-accordion]').forEach(function(item){
    const trigger=item.querySelector('.accordion-trigger');
    if(!trigger)return;
    trigger.addEventListener('click',function(){
      const open=item.classList.toggle('is-open');
      const icon=trigger.querySelector('i');
      if(icon)icon.textContent=open?'−':'+';
      if(hasGSAP&&!reduceMotion){
        const panel=item.querySelector('.accordion-panel');
        if(panel)gsap.fromTo(panel,{y:open?24:0,opacity:open?0:1},{y:0,opacity:open?1:0,duration:.45,ease:'power3.out'});
      }
    });
  });

  document.querySelectorAll('[data-preview]').forEach(function(item){
    const activate=function(){
      const id=item.dataset.preview;
      document.querySelectorAll('[data-preview]').forEach(function(el){el.classList.toggle('is-active',el===item);});
      document.querySelectorAll('[data-preview-panel]').forEach(function(panel){
        const active=panel.dataset.previewPanel===id;
        panel.classList.toggle('is-active',active);
        if(active&&hasGSAP&&!reduceMotion){gsap.fromTo(panel,{opacity:0,scale:.98},{opacity:1,scale:1,duration:.35,ease:'power2.out'});}
      });
    };
    item.addEventListener('mouseenter',activate);
    item.addEventListener('focus',activate);
    item.addEventListener('click',activate);
  });

  document.querySelectorAll('[data-placeholder]').forEach(function(link){link.addEventListener('click',function(e){e.preventDefault();alert(link.getAttribute('data-placeholder'));});});

  const compare=document.querySelector('[data-compare]');
  if(compare){
    const overlay=compare.querySelector('.compare-overlay');
    const handle=compare.querySelector('button');
    let dragging=false;
    const update=function(clientX){
      const r=compare.getBoundingClientRect();
      const pct=Math.max(0,Math.min(100,((clientX-r.left)/r.width)*100));
      overlay.style.width=pct+'%';
      handle.style.left=pct+'%';
    };
    handle.addEventListener('pointerdown',function(e){dragging=true;handle.setPointerCapture(e.pointerId);});
    handle.addEventListener('pointermove',function(e){if(dragging)update(e.clientX);});
    handle.addEventListener('pointerup',function(){dragging=false;});
    compare.addEventListener('click',function(e){update(e.clientX);});
  }

  if(hasGSAP&&hasST&&!reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.site-header',{y:-20,opacity:0,duration:.6,ease:'power3.out'});

    const hero=document.querySelector('[data-hero-visual]');
    if(hero){
      gsap.from('.hero-copy>*',{y:32,opacity:0,stagger:.08,duration:.7,ease:'power3.out'});
      gsap.from('.hero-screen-main',{y:50,opacity:0,duration:.9,ease:'power3.out'});
      gsap.from('.hero-screen-sub',{x:70,y:30,opacity:0,duration:.9,ease:'power3.out',delay:.1});
      gsap.from('.hero-screen-detail',{x:-50,y:-30,opacity:0,duration:.9,ease:'power3.out',delay:.18});
      gsap.to('.hero-screen-main',{yPercent:-6,ease:'none',scrollTrigger:{trigger:hero,start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to('.hero-screen-sub',{yPercent:-16,ease:'none',scrollTrigger:{trigger:hero,start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to('.hero-screen-detail',{yPercent:12,ease:'none',scrollTrigger:{trigger:hero,start:'top bottom',end:'bottom top',scrub:1}});
    }

    gsap.utils.toArray('.feature,.work-item').forEach(function(item){
      const visual=item.querySelector('.feature-visual,.work-visual');
      const copy=item.querySelector('.feature-meta,.work-info');
      if(visual)gsap.from(visual,{y:60,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 78%',once:true}});
      if(copy)gsap.from(copy,{y:36,opacity:0,duration:.7,ease:'power3.out',delay:.08,scrollTrigger:{trigger:item,start:'top 76%',once:true}});
    });

    gsap.utils.toArray('.about-timeline article,.case-section,.case-lead-copy').forEach(function(item){
      gsap.from(item,{y:42,opacity:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 82%',once:true}});
    });

    const caseSticky=document.querySelector('[data-case-sticky]');
    if(caseSticky){
      const layers=gsap.utils.toArray('[data-case-layer]');
      const steps=gsap.utils.toArray('[data-case-step]');
      steps.forEach(function(step,i){
        ScrollTrigger.create({
          trigger:step,start:'top center',end:'bottom center',
          onEnter:function(){layers.forEach(function(layer,j){layer.classList.toggle('is-active',i===j);});},
          onEnterBack:function(){layers.forEach(function(layer,j){layer.classList.toggle('is-active',i===j);});}
        });
      });
    }

    gsap.from('.archive-item',{x:-30,opacity:0,stagger:.04,duration:.5,ease:'power3.out',scrollTrigger:{trigger:'.archive-stage',start:'top 80%',once:true}});
  }

  document.querySelectorAll('a[href$=".html"]').forEach(function(link){
    link.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduceMotion)return;
      const href=link.getAttribute('href');
      if(!href||href.charAt(0)==='#')return;
      e.preventDefault();
      if(hasGSAP){gsap.to(body,{opacity:0,y:10,duration:.22,ease:'power2.in',onComplete:function(){window.location.href=href;}});}else{window.location.href=href;}
    });
  });
})();