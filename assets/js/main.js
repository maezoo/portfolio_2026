(function(){
  const body=document.body;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP=typeof window.gsap!=='undefined';
  const hasScrollTrigger=typeof window.ScrollTrigger!=='undefined';

  body.classList.add('is-entering');
  window.setTimeout(function(){body.classList.remove('is-entering');},500);

  const nav=document.getElementById('nav');
  const menuBtn=document.getElementById('menuBtn');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      const open=nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      });
    });
  }

  document.querySelectorAll('[data-accordion]').forEach(function(group){
    const items=group.querySelectorAll('.accordion-item');
    items.forEach(function(item){
      const trigger=item.querySelector('.accordion-trigger');
      if(!trigger)return;
      trigger.addEventListener('click',function(){
        const willOpen=!item.classList.contains('is-open');
        items.forEach(function(other){
          other.classList.remove('is-open');
          const otherTrigger=other.querySelector('.accordion-trigger');
          if(otherTrigger){
            otherTrigger.setAttribute('aria-expanded','false');
            const mark=otherTrigger.querySelector('b');
            if(mark)mark.textContent='+';
          }
        });
        if(willOpen){
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded','true');
          const mark=trigger.querySelector('b');
          if(mark)mark.textContent='−';
        }
        if(hasScrollTrigger)window.setTimeout(function(){window.ScrollTrigger.refresh();},450);
      });
    });
  });

  document.querySelectorAll('[data-tabs]').forEach(function(tabs){
    const scope=tabs.parentElement;
    const buttons=tabs.querySelectorAll('[data-tab]');
    const panels=scope.querySelectorAll('[data-panel]');
    buttons.forEach(function(button){
      button.addEventListener('click',function(){
        const target=button.getAttribute('data-tab');
        buttons.forEach(function(btn){btn.classList.toggle('is-active',btn===button);});
        panels.forEach(function(panel){panel.classList.toggle('is-active',panel.getAttribute('data-panel')===target);});
      });
    });
  });

  document.querySelectorAll('[data-demo]').forEach(function(button){
    button.addEventListener('click',function(){
      const panel=button.nextElementSibling;
      const isOpen=button.classList.toggle('is-active');
      if(panel&&panel.classList.contains('demo-panel'))panel.classList.toggle('is-open',isOpen);
      if(hasScrollTrigger)window.setTimeout(function(){window.ScrollTrigger.refresh();},350);
    });
  });

  if(!reduceMotion&&window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      card.addEventListener('pointermove',function(e){
        const rect=card.getBoundingClientRect();
        const x=(e.clientX-rect.left)/rect.width-.5;
        const y=(e.clientY-rect.top)/rect.height-.5;
        card.style.setProperty('--rx',(-y*5).toFixed(2)+'deg');
        card.style.setProperty('--ry',(x*6).toFixed(2)+'deg');
        card.style.setProperty('--tx',(x*12).toFixed(2)+'px');
        card.style.setProperty('--ty',(y*12).toFixed(2)+'px');
      });
      card.addEventListener('pointerleave',function(){
        card.style.setProperty('--rx','0deg');
        card.style.setProperty('--ry','0deg');
        card.style.setProperty('--tx','0px');
        card.style.setProperty('--ty','0px');
      });
    });
  }

  if(hasGSAP&&hasScrollTrigger&&!reduceMotion){
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.site-header',{y:-30,opacity:0,duration:.7,ease:'power3.out'});

    if(document.querySelector('.home-hero')){
      const heroTl=gsap.timeline({defaults:{ease:'power3.out'}});
      heroTl.from('.hero-index span',{y:20,opacity:0,stagger:.08,duration:.55})
        .from('.hero-copy h1',{y:50,opacity:0,duration:.8},'-=.3')
        .from('.hero-copy p,.hero-stack,.hero-copy .text-link',{y:24,opacity:0,stagger:.08,duration:.55},'-=.45')
        .from('.hero-build-preview',{x:90,opacity:0,scale:.96,duration:.9},'-=.65');

      gsap.to('.preview-screen',{yPercent:-10,scrollTrigger:{trigger:'.home-hero',start:'top top',end:'bottom top',scrub:1.2}});
      gsap.to('.preview-mobile',{yPercent:-24,scrollTrigger:{trigger:'.home-hero',start:'top top',end:'bottom top',scrub:1.1}});
      gsap.to('.preview-chip',{yPercent:18,scrollTrigger:{trigger:'.home-hero',start:'top top',end:'bottom top',scrub:1}});
    }

    document.querySelectorAll('.interaction-showcase,.workflow,.selected-work,.work-intro,.about-hero,.about-statement,.archive-intro,.contact-page,.case-hero,.case-section').forEach(function(section){
      const targets=section.querySelectorAll('h1,h2,p,.section-label,.eyebrow,.demo-row,.workflow-list li,.project-feature,.about-detail,.contact-links a,.case-facts span');
      if(!targets.length)return;
      gsap.from(targets,{y:42,opacity:0,stagger:.06,duration:.75,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 82%',once:true}});
    });

    document.querySelectorAll('.project-visual,.case-cover,.case-visual,.interactive-visual').forEach(function(visual){
      gsap.fromTo(visual,{scale:.96,y:40},{scale:1,y:0,ease:'none',scrollTrigger:{trigger:visual,start:'top 92%',end:'top 38%',scrub:1}});
    });

    const workflow=document.querySelector('.workflow');
    if(workflow&&window.innerWidth>1100){
      const list=workflow.querySelector('.workflow-list');
      if(list){
        ScrollTrigger.create({trigger:workflow,start:'top 12%',end:'bottom 70%',pin:'.workflow-intro',pinSpacing:false});
      }
    }

    const archivePreview=document.querySelector('.archive-preview');
    if(archivePreview&&window.innerWidth>1100){
      gsap.to(archivePreview,{y:-90,ease:'none',scrollTrigger:{trigger:'.archive-list',start:'top 70%',end:'bottom 30%',scrub:1}});
    }

    document.querySelectorAll('.accordion-item').forEach(function(item,index){
      gsap.from(item,{x:index%2===0?-50:50,opacity:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 88%',once:true}});
    });
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('on');});
  }

  document.querySelectorAll('a[href$=".html"]').forEach(function(link){
    link.addEventListener('click',function(e){
      if(reduceMotion||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const href=link.getAttribute('href');
      if(!href||href.charAt(0)==='#')return;
      e.preventDefault();
      if(hasGSAP){
        gsap.to(body,{opacity:0,y:8,duration:.22,ease:'power2.in',onComplete:function(){window.location.href=href;}});
      }else{
        body.classList.add('is-leaving');
        window.setTimeout(function(){window.location.href=href;},180);
      }
    });
  });

  document.querySelectorAll('[data-placeholder]').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      alert(link.getAttribute('data-placeholder'));
    });
  });
})();