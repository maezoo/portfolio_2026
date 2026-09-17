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
      el.style.transitionDelay=Math.min(index%3,2)*60+'ms';
      observer.observe(el);
    });
  }else{
    reveals.forEach(function(el){el.classList.add('on');});
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
