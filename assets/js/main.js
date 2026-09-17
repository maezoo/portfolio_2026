(function(){
  const nav=document.getElementById('nav');
  const menuBtn=document.getElementById('menuBtn');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      const open=nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded','false');
      });
    });
  }

  const motionDisabled=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if('IntersectionObserver' in window&&!motionDisabled){
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -5% 0px'});

    document.querySelectorAll('.fade').forEach(function(el,index){
      el.style.transitionDelay=Math.min(index%4,3)*70+'ms';
      observer.observe(el);
    });
  }else{
    document.querySelectorAll('.fade').forEach(function(el){el.classList.add('on');});
  }

  const buttons=document.querySelectorAll('.filter');
  const works=document.querySelectorAll('.work');
  buttons.forEach(function(button){
    button.addEventListener('click',function(){
      buttons.forEach(function(b){b.classList.remove('on');});
      button.classList.add('on');
      const f=button.getAttribute('data-filter');
      works.forEach(function(card){
        card.classList.toggle('hide',!(f==='all'||card.getAttribute('data-type')===f));
      });
    });
  });

  document.querySelectorAll('[data-placeholder]').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      alert(link.getAttribute('data-placeholder'));
    });
  });

  document.querySelectorAll('[data-slider-track]').forEach(function(track){
    const items=Array.from(track.children);
    const controls=track.nextElementSibling;
    if(!items.length||!controls||!controls.hasAttribute('data-slider-controls')) return;

    const currentLabel=controls.querySelector('[data-slider-current]');
    const progress=controls.querySelector('[data-slider-progress]');
    const prev=controls.querySelector('[data-slider-prev]');
    const next=controls.querySelector('[data-slider-next]');
    let current=0;
    let frame=0;
    let dragging=false;
    let startX=0;
    let startScroll=0;

    function nearestIndex(){
      let found=0;
      let distance=Infinity;
      items.forEach(function(item,index){
        const itemLeft=item.offsetLeft-track.offsetLeft;
        const nextDistance=Math.abs(track.scrollLeft-itemLeft);
        if(nextDistance<distance){distance=nextDistance;found=index;}
      });
      return found;
    }

    function update(){
      current=nearestIndex();
      currentLabel.textContent=String(current+1).padStart(2,'0');
      progress.style.transform='scaleX('+((current+1)/items.length)+')';
      prev.disabled=current===0;
      next.disabled=current===items.length-1;
      frame=0;
    }

    function goTo(index){
      const target=Math.max(0,Math.min(index,items.length-1));
      track.scrollTo({left:items[target].offsetLeft-track.offsetLeft,behavior:motionDisabled?'auto':'smooth'});
    }

    track.addEventListener('scroll',function(){
      if(!frame) frame=window.requestAnimationFrame(update);
    },{passive:true});
    prev.addEventListener('click',function(){goTo(current-1);});
    next.addEventListener('click',function(){goTo(current+1);});
    track.addEventListener('keydown',function(event){
      if(event.key==='ArrowLeft'){event.preventDefault();goTo(current-1);}
      if(event.key==='ArrowRight'){event.preventDefault();goTo(current+1);}
    });
    track.addEventListener('pointerdown',function(event){
      if(event.pointerType!=='mouse') return;
      dragging=true;startX=event.clientX;startScroll=track.scrollLeft;
      track.classList.add('is-dragging');track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove',function(event){
      if(!dragging) return;
      track.scrollLeft=startScroll-(event.clientX-startX);
    });
    function endDrag(event){
      if(!dragging) return;
      dragging=false;track.classList.remove('is-dragging');
      if(track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      current=nearestIndex();goTo(current);
    }
    track.addEventListener('pointerup',endDrag);
    track.addEventListener('pointercancel',endDrag);
    update();
  });

})();
