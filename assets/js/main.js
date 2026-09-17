(function(){
  const body=document.body;
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

  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduceMotion){
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    reveals.forEach(function(el,index){
      el.style.transitionDelay=Math.min(index%3,2)*70+'ms';
      observer.observe(el);
    });
  }else{
    reveals.forEach(function(el){el.classList.add('on');});
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
        card.style.setProperty('--tx',(x*10).toFixed(2)+'px');
        card.style.setProperty('--ty',(y*10).toFixed(2)+'px');
      });
      card.addEventListener('pointerleave',function(){
        card.style.setProperty('--rx','0deg');
        card.style.setProperty('--ry','0deg');
        card.style.setProperty('--tx','0px');
        card.style.setProperty('--ty','0px');
      });
    });
  }

  document.querySelectorAll('a[href$=".html"]').forEach(function(link){
    link.addEventListener('click',function(e){
      if(reduceMotion||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const href=link.getAttribute('href');
      if(!href||href.charAt(0)==='#')return;
      e.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(function(){window.location.href=href;},180);
    });
  });

  document.querySelectorAll('[data-placeholder]').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      alert(link.getAttribute('data-placeholder'));
    });
  });
})();