/* Tastonettis – Skripte (ohne externe Abhängigkeiten) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  /* ---------- Mobile Navigation ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Nach oben ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle('show', window.scrollY > 600); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- YouTube: 2-Klick-Lösung (DSGVO) ----------
     Vor dem Klick wird KEINE Verbindung zu YouTube/Google aufgebaut.
     Das Vorschaubild liegt lokal auf unserem Server.
     Erst nach Zustimmung wird der Player über youtube-nocookie.com geladen.
     Optional kann die Zustimmung im localStorage gemerkt werden (widerrufbar im Footer). */
  var CONSENT_KEY = 'tastonettis-youtube-consent';
  function hasConsent() { try { return localStorage.getItem(CONSENT_KEY) === 'yes'; } catch (e) { return false; } }
  function setConsent(v) { try { v ? localStorage.setItem(CONSENT_KEY, 'yes') : localStorage.removeItem(CONSENT_KEY); } catch (e) {} }

  function loadVideo(box, autoplay) {
    var id = box.getAttribute('data-youtube');
    var title = box.getAttribute('data-title') || 'YouTube-Video';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?rel=0&modestbranding=1' + (autoplay ? '&autoplay=1' : '');
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(iframe);
  }

  var videos = document.querySelectorAll('.video-embed[data-youtube]');
  videos.forEach(function (box) {
    var btn = box.querySelector('.video-play');
    var remember = box.querySelector('input[type="checkbox"]');
    if (btn) {
      btn.addEventListener('click', function () {
        if (remember && remember.checked) { setConsent(true); updateRevoke(); }
        loadVideo(box, true);
      });
    }
  });
  if (hasConsent()) videos.forEach(function (box) { loadVideo(box, false); });

  var revoke = document.querySelector('[data-revoke-consent]');
  function updateRevoke() { if (revoke) revoke.hidden = !hasConsent(); }
  if (revoke) {
    updateRevoke();
    revoke.querySelector('button').addEventListener('click', function () {
      setConsent(false);
      window.location.reload();
    });
  }

  /* ---------- 360°-Ansicht "Klavier to go" ---------- */
  document.querySelectorAll('[data-spin]').forEach(function (spin) {
    var img = spin.querySelector('img');
    var base = spin.getAttribute('data-spin');
    var count = parseInt(spin.getAttribute('data-frames'), 10) || 1;
    var frames = [];
    var current = 0;
    var timer = null;
    var playBtn = spin.querySelector('[data-spin-play]');

    function src(i) { return base + String(i + 1).padStart(2, '0') + '.jpg'; }
    function preload() {
      for (var i = 0; i < count; i++) { var im = new Image(); im.src = src(i); frames.push(im); }
    }
    function show(i) { current = (i + count) % count; img.src = src(current); }
    function play() {
      stop();
      timer = setInterval(function () { show(current + 1); }, 140);
      if (playBtn) { playBtn.setAttribute('aria-label', 'Drehung anhalten'); playBtn.innerHTML = ICON_PAUSE; }
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      if (playBtn) { playBtn.setAttribute('aria-label', 'Automatisch drehen'); playBtn.innerHTML = ICON_PLAY; }
    }
    var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

    var started = false;
    function start() {
      if (started) return; started = true; preload();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) play();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en, obs) {
        if (en[0].isIntersecting) { start(); obs.disconnect(); }
      }).observe(spin);
    } else { start(); }

    var prev = spin.querySelector('[data-spin-prev]');
    var next = spin.querySelector('[data-spin-next]');
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); stop(); show(current - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); stop(); show(current + 1); });
    if (playBtn) playBtn.addEventListener('click', function (e) { e.stopPropagation(); timer ? stop() : play(); });

    // Ziehen mit Maus / Finger
    var dragX = null;
    spin.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      start(); stop(); dragX = e.clientX; spin.setPointerCapture(e.pointerId);
    });
    spin.addEventListener('pointermove', function (e) {
      if (dragX === null) return;
      var step = spin.clientWidth / count / 1.2;
      var d = e.clientX - dragX;
      if (Math.abs(d) >= step) { show(current + (d > 0 ? -1 : 1)); dragX = e.clientX; }
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { spin.addEventListener(t, function () { dragX = null; }); });
    spin.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stop(); show(current - 1); }
      if (e.key === 'ArrowRight') { stop(); show(current + 1); }
    });
  });

  /* ---------- Lightbox ---------- */
  var links = document.querySelectorAll('a[data-lightbox]');
  if (links.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Bildansicht');
    lb.innerHTML = '<button type="button" aria-label="Schließen">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption'), lbClose = lb.querySelector('button');
    var lastFocus = null;
    function close() { lb.classList.remove('open'); lbImg.src = ''; if (lastFocus) lastFocus.focus(); }
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lastFocus = a;
        var im = a.querySelector('img');
        lbImg.src = a.href;
        lbImg.alt = im ? im.alt : '';
        lbCap.textContent = a.getAttribute('data-caption') || (im ? im.alt : '');
        lb.classList.add('open');
        lbClose.focus();
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbClose) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }

  /* Jahr im Footer */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
