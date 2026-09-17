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

  document.querySelectorAll('[data-tabs]').forEach(function(tabs){
    const scope=tabs.parentElement;
    const buttons=tabs.querySelectorAll('[data-tab]');
    const panels=scope.querySelectorAll('[data-panel]');
    buttons.forEach(function(btn){
      btn.addEventListener('click',function(){
        const target=btn.dataset.tab;
        buttons.forEach(function(b){b.classList.toggle('is-active',b===btn);});
        panels.forEach(function(p){p.classList.toggle('is-active',p.dataset.panel===target);});
        if(hasGSAP){
          const panel=[...panels].find(function(p){return p.dataset.panel===target;});
          if(panel)gsap.fromTo(panel,{y:12,opacity:0},{y:0,opacity:1,duration:.35,ease:'power3.out'});
        }
      });
    });
  });

  document.querySelectorAll('[data-preview]').forEach(function(item){
    const activate=function(){
      const id=item.dataset.preview;
      document.querySelectorAll('[data-preview]').forEach(function(el){el.classList.toggle('is-active',el===item);});
      document.querySelectorAll('[data-preview-panel]').forEach(function(panel){
        const active=panel.dataset.previewPanel===id;
        panel.classList.toggle('is-active',active);
        if(active&&hasGSAP&&!reduceMotion){gsap.fromTo(panel,{opacity:0,scale:.9,rotate:3},{opacity:1,scale:1,rotate:0,duration:.55,ease:'power3.out'});}
      });
    };
    item.addEventListener('mouseenter',activate);
    item.addEventListener('focus',activate);
    item.addEventListener('click',activate);
  });

  document.querySelectorAll('[data-placeholder]').forEach(function(link){link.addEventListener('click',function(e){e.preventDefault();alert(link.getAttribute('data-placeholder'));});});

  if(hasGSAP&&hasST&&!reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.site-header',{y:-30,opacity:0,duration:.7,ease:'power3.out'});

    const hero=document.querySelector('[data-hero-scene]');
    if(hero){
      const tl=gsap.timeline({defaults:{ease:'power4.out'}});
      tl.from('.hero-copy .micro',{y:20,opacity:0,duration:.45})
        .from('.hero-copy h1',{y:80,opacity:0,duration:1},'-=.2')
        .from('.hero-copy p,.hero-link',{y:30,opacity:0,stagger:.08,duration:.55},'-=.55')
        .from('.hero-card-a',{x:100,y:80,rotation:-16,opacity:0,duration:.9},'-=.75')
        .from('.hero-card-b',{x:140,y:-50,rotation:12,opacity:0,duration:1},'-=.8')
        .from('.hero-card-c',{x:-80,y:120,rotation:-10,opacity:0,duration:.9},'-=.75');
      gsap.to('.hero-card-a',{yPercent:-18,xPercent:-8,rotation:-11,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
      gsap.to('.hero-card-b',{yPercent:12,xPercent:10,rotation:8,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.2}});
      gsap.to('.hero-card-c',{yPercent:-28,xPercent:-14,rotation:4,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.9}});
      gsap.to('.orbit-a',{rotation:160,scale:1.15,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
      gsap.to('.orbit-b',{rotation:-220,scale:.8,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
    }

    const marquee=document.querySelector('.marquee-track');
    if(marquee){gsap.to(marquee,{xPercent:-35,ease:'none',scrollTrigger:{trigger:'.kinetic-marquee',start:'top bottom',end:'bottom top',scrub:1}});}

    const process=document.querySelector('[data-process]');
    if(process&&window.innerWidth>1100){
      const steps=[
        ['01','Request','요청사항과 자료 확인'],['02','Scope','범위 · 일정 · 견적 정리'],['03','Plan','메뉴 · 페이지 · 콘텐츠 구조'],['04','UI','PC · Mobile · 상태 설계'],['05','Build','HTML · SCSS · JavaScript · jQuery'],['06','Launch','CMS · QA · Open'],['07','Improve','Feedback · Error · Maintenance']
      ];
      const frames=gsap.utils.toArray('.stage-frame');
      const dots=gsap.utils.toArray('.process-dots button');
      ScrollTrigger.create({
        trigger:process,start:'top top',end:'bottom bottom',scrub:true,
        onUpdate:function(self){
          const idx=Math.min(6,Math.floor(self.progress*7));
          const current=steps[idx];
          document.querySelector('.process-number').textContent=current[0];
          document.querySelector('.process-title').textContent=current[1];
          document.querySelector('.process-desc').textContent=current[2];
          dots.forEach(function(dot,i){dot.classList.toggle('is-active',i===idx);});
          frames.forEach(function(frame,i){
            const p=Math.max(0,Math.min(1,(idx-(i*2))/2));
            gsap.to(frame,{yPercent:-p*12,scale:1-p*.05,opacity:i*2<=idx?1:.18,duration:.25,overwrite:true});
          });
        }
      });
    }

    const horizontal=document.querySelector('[data-horizontal]');
    if(horizontal&&window.innerWidth>1100){
      const track=horizontal.querySelector('.horizontal-track');
      const amount=function(){return -(track.scrollWidth-window.innerWidth);};
      gsap.to(track,{x:amount,ease:'none',scrollTrigger:{trigger:horizontal,start:'top top',end:function(){return '+='+(track.scrollWidth-window.innerWidth);},pin:true,scrub:1,invalidateOnRefresh:true}});
      gsap.utils.toArray('.horizontal-project').forEach(function(card){
        const visual=card.querySelector('.hp-visual');
        gsap.fromTo(visual,{scale:.86,rotation:2},{scale:1,rotation:0,ease:'none',scrollTrigger:{trigger:card,containerAnimation:gsap.getTweensOf(track)[0],start:'left 90%',end:'center center',scrub:true}});
      });
    }

    const workScenes=gsap.utils.toArray('.work-scene');
    workScenes.forEach(function(scene,index){
      const copy=scene.querySelector('.scene-copy');
      const media=scene.querySelector('.scene-media');
      const layers=scene.querySelectorAll('.scene-media>div');
      gsap.from(copy,{x:index%2===0?-100:100,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:scene,start:'top 70%',once:true}});
      gsap.from(media,{scale:.8,rotation:index%2===0?4:-4,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:scene,start:'top 75%',once:true}});
      layers.forEach(function(layer,i){gsap.to(layer,{yPercent:(i-1)*-18,xPercent:(i-1)*12,ease:'none',scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:1}});});
    });

    const caseStory=document.querySelector('[data-case-story]');
    if(caseStory){
      const media2=document.querySelector('.case-media-2');
      const media3=document.querySelector('.case-media-3');
      const steps=gsap.utils.toArray('[data-case-step]');
      steps.forEach(function(step,i){
        gsap.from(step,{y:80,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:step,start:'top 70%',once:true}});
        ScrollTrigger.create({trigger:step,start:'top center',end:'bottom center',onEnter:function(){if(i>=1)gsap.to(media2,{clipPath:i>=1?'inset(0% 0 0 0)':'inset(100% 0 0 0)',duration:.6});if(i>=3)gsap.to(media3,{clipPath:'inset(0% 0 0 0)',duration:.6});},onEnterBack:function(){gsap.to(media2,{clipPath:i>=1?'inset(0% 0 0 0)':'inset(100% 0 0 0)',duration:.5});gsap.to(media3,{clipPath:i>=3?'inset(0% 0 0 0)':'inset(100% 0 0 0)',duration:.5});}});
      });
      gsap.to('.case-media-sticky',{scale:.92,rotation:-2,ease:'none',scrollTrigger:{trigger:caseStory,start:'top top',end:'bottom bottom',scrub:1}});
    }

    const rail=document.querySelector('[data-about-rail]');
    if(rail&&window.innerWidth>1100){
      const track=rail.querySelector('.about-rail-track');
      gsap.to(track,{x:function(){return -(track.scrollWidth-window.innerWidth);},ease:'none',scrollTrigger:{trigger:rail,start:'top top',end:function(){return '+='+(track.scrollWidth-window.innerWidth);},pin:true,scrub:1,invalidateOnRefresh:true}});
    }

    gsap.utils.toArray('[data-magnetic]').forEach(function(el){
      el.addEventListener('mousemove',function(e){const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.22,y:(e.clientY-r.top-r.height/2)*.22,duration:.3,ease:'power3.out'});});
      el.addEventListener('mouseleave',function(){gsap.to(el,{x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'});});
    });

    gsap.from('.archive-item',{x:-60,opacity:0,stagger:.05,duration:.6,ease:'power3.out',scrollTrigger:{trigger:'.archive-stage',start:'top 75%',once:true}});
    gsap.to('.contact-word',{rotation:12,scale:1.08,ease:'none',scrollTrigger:{trigger:'.contact-scene',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.orbit-one',{rotation:180,scale:1.15,duration:18,repeat:-1,ease:'none'});
    gsap.to('.orbit-two',{rotation:-180,scale:.85,duration:12,repeat:-1,ease:'none'});
  }

  document.querySelectorAll('a[href$=".html"]').forEach(function(link){
    link.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||reduceMotion)return;
      const href=link.getAttribute('href');
      if(!href||href.charAt(0)==='#')return;
      e.preventDefault();
      if(hasGSAP){gsap.to(body,{opacity:0,y:18,duration:.3,ease:'power2.in',onComplete:function(){window.location.href=href;}});}else{window.location.href=href;}
    });
  });
})();