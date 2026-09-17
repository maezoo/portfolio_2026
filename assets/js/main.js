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

  function initPortfolioSwiper(selector){
    const element=document.querySelector(selector);
    if(!element||typeof window.Swiper==='undefined') return;
    const controls=element.nextElementSibling;
    if(!controls||!controls.hasAttribute('data-slider-controls')) return;
    const currentLabel=controls.querySelector('[data-slider-current]');
    const progress=controls.querySelector('[data-slider-progress]');
    const total=element.querySelectorAll('.swiper-slide').length;

    function render(swiper){
      const current=swiper.activeIndex+1;
      currentLabel.textContent=String(current).padStart(2,'0');
      progress.style.transform='scaleX('+(current/total)+')';
    }

    new window.Swiper(element,{
      slidesPerView:'auto',
      spaceBetween:24,
      speed:motionDisabled?0:600,
      grabCursor:true,
      watchOverflow:true,
      keyboard:{enabled:true,onlyInViewport:true},
      navigation:{
        prevEl:controls.querySelector('[data-slider-prev]'),
        nextEl:controls.querySelector('[data-slider-next]')
      },
      on:{init:render,slideChange:render}
    });
  }

  initPortfolioSwiper('.project-swiper');
  initPortfolioSwiper('.value-swiper');

})();
