// Polished script: theme toggle, nav toggle, active nav, scroll reveal

/* ======================
   SHEIKAH BOOT
====================== */

const loader = document.getElementById("sheikah-loader");

if(!sessionStorage.getItem("sheikahLoaded")){

  const messages = [
    "Initializing...",
    "Loading Map Data...",
    "Activating Runes...",
    "Calibrating Sensors...",
    "Sheikah Slate Ready"
  ];

  const bootText = document.getElementById("bootText");

  let i = 0;

  const interval = setInterval(()=>{
    i++;
    if(messages[i]) bootText.textContent = messages[i];
  }, 600);

  window.addEventListener("load", ()=>{

    setTimeout(()=>{
      clearInterval(interval);
      loader.style.opacity = "0";
      loader.style.transition = "opacity .6s ease";

      setTimeout(()=>{
        loader.remove();
        sessionStorage.setItem("sheikahLoaded", "true");
      },600);

    },1800);

  });

}else{
  loader?.remove();
}



(function(){
  const HTML = document.documentElement;
  const THEME_KEY = 'jp_theme';
  const themeButtons = document.querySelectorAll('.theme-toggle');
  const navToggles = document.querySelectorAll('.nav-toggle');
  const navLists = document.querySelectorAll('.nav-list');

  // load theme
  function setTheme(name){
    if(name === 'dark') HTML.setAttribute('data-theme','dark');
    else HTML.removeAttribute('data-theme');
    try{ localStorage.setItem(THEME_KEY, name); }catch(e){}
    updateThemeIcons();
  }
  function updateThemeIcons(){
    document.querySelectorAll('.theme-toggle .icon').forEach(el=>{
      const isDark = HTML.getAttribute('data-theme') === 'dark';
      el.textContent = isDark ? '☀️' : '🌙';
    });
  }
  const saved = (function(){ try{ return localStorage.getItem(THEME_KEY); }catch(e){ return null } })();
  if(saved) setTheme(saved);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');

  themeButtons.forEach(btn => btn.addEventListener('click', ()=>{
    const isDark = HTML.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
    btn.setAttribute('aria-pressed', String(!isDark));
  }));

  // nav toggle (mobile)
  navToggles.forEach(toggle=>{
    toggle.addEventListener('click', (e)=>{
      const list = e.target.closest('.nav-inner').querySelector('.nav-list');
      if(!list) return;
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      list.classList.toggle('show');
    });
  });

  // close nav on outside click
  document.addEventListener('click', (e)=>{
    navLists.forEach(list=>{
      if(list.classList.contains('show')){
        const withinNav = list.contains(e.target) || e.target.closest('.nav-toggle');
        if(!withinNav) list.classList.remove('show');
      }
    });
  });

  // active link (based on filename)
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path || (href === 'index.html' && path === '')) a.classList.add('active');
    else a.classList.remove('active');
  });

  // simple scroll reveal using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Prefetch links for perceived performance (home -> projects)
  function prefetch(url){
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = url;
    document.head.appendChild(l);
  }
  prefetch('projects.html');
  prefetch('about.html');

})();
