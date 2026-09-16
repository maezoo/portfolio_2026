(function(){
  const nav=document.getElementById('nav');
  const menuBtn=document.getElementById('menuBtn');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){
      const open=nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');});});
  }

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('on');observer.unobserve(entry.target);}});
    },{threshold:.08});
    document.querySelectorAll('.fade').forEach(function(el){observer.observe(el);});
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
    link.addEventListener('click',function(e){e.preventDefault();alert(link.getAttribute('data-placeholder'));});
  });
})();
