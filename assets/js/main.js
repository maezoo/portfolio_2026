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

  if(!motionDisabled){
    const parallaxItems=document.querySelectorAll('[data-parallax]');
    const heroTitle=document.querySelector('.hero-title');
    let ticking=false;

    function updateParallax(){
      const y=window.scrollY;
      parallaxItems.forEach(function(item){
        const speed=parseFloat(item.getAttribute('data-parallax'))||0;
        item.style.transform='translate3d(0,'+(y*speed)+'px,0)';
      });
      if(heroTitle){
        heroTitle.style.transform='translate3d(0,'+(Math.min(y,700)*0.035)+'px,0)';
      }
      ticking=false;
    }

    window.addEventListener('scroll',function(){
      if(!ticking){
        window.requestAnimationFrame(updateParallax);
        ticking=true;
      }
    },{passive:true});
  }
})();
