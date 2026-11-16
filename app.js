(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function sc(){top.classList.toggle('sc',window.scrollY>8)}
  window.addEventListener('scroll',sc,{passive:true});sc();
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var rok=document.getElementById('rok');if(rok)rok.textContent=new Date().getFullYear();

  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
    var hero=document.querySelector('.hero'),mob=document.getElementById('mob');
    if(hero&&mob)new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting)},{threshold:0}).observe(hero);
  }

  /* karuzele: palec natywnie, mysz przeciaganiem, strzalki, kwadratowe kropki jak na obecnej stronie */
  document.querySelectorAll('.tor').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function gap(){return parseFloat(getComputedStyle(tor).columnGap)||20}
    function krok(){return tor.firstElementChild.getBoundingClientRect().width+gap()}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;tor.classList.add('drag')}if(moved)tor.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){setTimeout(function(){tor.classList.remove('drag')},0);var it=[].slice.call(tor.children),best=0,bd=1e9;it.forEach(function(c,i){var d=Math.abs(c.offsetLeft-tor.offsetLeft-tor.scrollLeft);if(d<bd){bd=d;best=i}});tor.scrollTo({left:it[best].offsetLeft-tor.firstElementChild.offsetLeft,behavior:'smooth'})}});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-tor="'+tor.id+'"]');
    if(nav)nav.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:krok()*(+b.dataset.k),behavior:'smooth'})})});
    var kr=document.querySelector('[data-kropki="'+tor.id+'"]');
    if(kr&&!kr.hidden){
      var n=tor.children.length,bs=[];
      for(var i=0;i<n;i++){(function(i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Projekt '+(i+1));b.addEventListener('click',function(){tor.scrollTo({left:tor.children[i].offsetLeft-tor.firstElementChild.offsetLeft,behavior:'smooth'})});kr.appendChild(b);bs.push(b)})(i)}
      function upd(){var i=Math.round(tor.scrollLeft/krok());if(tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4)i=n-1;bs.forEach(function(b,j){b.classList.toggle('on',j===i)})}
      tor.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd();
    }
  });

  /* lightbox */
  var lb=document.getElementById('lb'),lbi=document.getElementById('lbi'),lbc=document.getElementById('lbc'),grp=[],idx=0,last=null;
  function pokaz(i){idx=(i+grp.length)%grp.length;var a=grp[idx];lbi.src=a.getAttribute('href');lbi.alt=a.dataset.cap||'';lbc.textContent=(a.dataset.cap||'')+(grp.length>1?'  ('+(idx+1)+'/'+grp.length+')':'');lb.querySelector('.pv').hidden=lb.querySelector('.nx').hidden=grp.length<2}
  function otworz(a){grp=[].slice.call(document.querySelectorAll('[data-lb="'+a.dataset.lb+'"]'));last=a;pokaz(grp.indexOf(a));lb.classList.add('on');document.body.style.overflow='hidden';lb.querySelector('.x').focus()}
  function zamk(){lb.classList.remove('on');document.body.style.overflow='';lbi.removeAttribute('src');if(last)last.focus()}
  document.querySelectorAll('[data-lb]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();otworz(a)})});
  lb.querySelector('.x').addEventListener('click',zamk);
  lb.querySelector('.pv').addEventListener('click',function(){pokaz(idx-1)});
  lb.querySelector('.nx').addEventListener('click',function(){pokaz(idx+1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')zamk()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){zamk();zamknij()}if(!lb.classList.contains('on'))return;if(e.key==='ArrowLeft')pokaz(idx-1);if(e.key==='ArrowRight')pokaz(idx+1)});
  var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>45)pokaz(idx+(dx<0?1:-1));tx=null});

  /* mapa Google ladowana przy przewinieciu */
  var m=document.getElementById('mapa');
  function load(){if(m.dataset.ok)return;m.dataset.ok=1;var f=document.createElement('iframe');f.src=m.dataset.src;f.title=m.dataset.title;f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
  if(m){if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){load();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else load()}

  var f=document.getElementById('form');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var i=document.getElementById('info');i.hidden=false;i.focus()});
})();
