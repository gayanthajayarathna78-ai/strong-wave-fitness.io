/* scripts.js - shared behaviors: year, nav highlight, theme toggle, WA helper */
(() => {
  const THEME_KEY = 'swf-theme';

  // set year in any element with id="yr"
  function setYear(){
    const el = document.getElementById('yr');
    if(el) el.textContent = new Date().getFullYear();
  }

  // highlight active nav link based on filename
  function highlightNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('header.site-header .nav a').forEach(a=>{
      try{
        if(a.getAttribute('href') === path) a.classList.add('active');
        else a.classList.remove('active');
      }catch(e){}
    });
  }

  // apply theme: 'dark' (default) or 'light'
  function applyTheme(theme){
    if(theme === 'light'){
      document.body.classList.add('light');
      // update all toggle buttons if present
      document.querySelectorAll('.theme-toggle').forEach(btn=>{
        btn.textContent = '☀️';
        btn.setAttribute('aria-pressed','true');
      });
    } else {
      document.body.classList.remove('light');
      document.querySelectorAll('.theme-toggle').forEach(btn=>{
        btn.textContent = '🌙';
        btn.setAttribute('aria-pressed','false');
      });
    }
  }

  // init theme from localStorage or prefers-color-scheme
  function initTheme(){
    const saved = localStorage.getItem(THEME_KEY);
    if(saved) applyTheme(saved);
    else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark');
    }
  }

  // toggle handler (will be attached to every .theme-toggle button)
  function toggleTheme(){
    const isLight = document.body.classList.contains('light');
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  // attach toggle listeners
  function wireThemeToggle(){
    document.querySelectorAll('.theme-toggle').forEach(btn=>{
      btn.addEventListener('click', toggleTheme);
    });
  }

  // WhatsApp helper: looks for elements with id "waBtn" or "waButton" or "waFloat"
  // and attaches open behavior using WA_NUMBER if defined on the page (or defaults).
  function wireWhatsApp(){
    const WA_NUMBER = window.SWF_WA_NUMBER || '94701421968';
    const makeUrl = (name, email, msg) => {
      const text = `Name: ${name}%0AEmail: ${email}%0A%0AMessage: ${msg}`;
      return `https://wa.me/${WA_NUMBER}?text=${text}`;
    };

    // handler attaches to elements if they exist on the page
    const handler = (e) => {
      e.preventDefault();
      const name = encodeURIComponent(document.getElementById('name')?.value || '');
      const email = encodeURIComponent(document.getElementById('email')?.value || '');
      const msg = encodeURIComponent(document.getElementById('message')?.value || 'Hello! I would like more info.');
      window.open(makeUrl(name, email, msg), '_blank');
    };

    ['waBtn','waButton','waFloat','waDirect'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.addEventListener('click', handler);
    });
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    setYear();
    highlightNav();
    initTheme();
    wireThemeToggle();
    wireWhatsApp();
  });

  // expose small API for pages (optional)
  window.SWF = {
    setTheme: applyTheme,
    toggleTheme
  };
})();
