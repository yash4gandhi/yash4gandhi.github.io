(() => {
  const id = 'G-RHNLBZDB2H';
  const key = 'portfolio-analytics-choice-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const live = location.origin === 'https://yash4gandhi.github.io';
  const browserOptOut = navigator.globalPrivacyControl === true;
  const page = document.body.dataset.analyticsPage || '/404/';
  const project = page.match(/^\/work\/([a-z0-9-]+)\/$/)?.[1];
  const panel = document.querySelector('[data-analytics-panel]');
  if (!panel) return;
  const status = panel.querySelector('[data-analytics-status]');
  const settings = [...document.querySelectorAll('[data-analytics-settings]')];
  const deny = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
  let choice = readChoice(), initialized = false, measured = false, unavailable = false, returnFocus = null;
  window['ga-disable-' + id] = true;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && ['granted','denied'].includes(saved.choice) && Number.isFinite(saved.at) && Date.now() - saved.at >= 0 && Date.now() - saved.at < lifetime) return saved.choice;
    } catch {}
    return null;
  }
  function allowed() { return live && choice === 'granted' && !browserOptOut && !unavailable; }
  function gtag() { window.dataLayer.push(arguments); }
  function track(name, parameters = {}) {
    if (!allowed() || !initialized) return;
    gtag('event', name, {send_to:id, ...(project ? {project_id:project} : {}), ...parameters});
  }
  function refreshStatus() {
    status.textContent = !live ? 'Preview: no analytics data is sent.' : browserOptOut ? 'Analytics is off because your browser requests privacy protection.' : unavailable ? 'Analytics could not load in this browser. The portfolio still works normally.' : choice === 'granted' ? 'Analytics is allowed. You can change this choice at any time.' : 'Analytics is off.';
  }
  function clearCookies() {
    try {
      for (const entry of document.cookie.split(';')) {
        const name = entry.trim().split('=')[0];
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['', '; domain=' + location.hostname, '; domain=.' + location.hostname]) document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax; Secure';
      }
    } catch {}
  }
  function start() {
    if (!allowed()) return;
    window['ga-disable-' + id] = false;
    if (!initialized) {
      initialized = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = gtag;
      gtag('consent', 'default', deny);
      gtag('consent', 'update', {...deny, analytics_storage:'granted'});
      gtag('js', new Date());
      let referrer = '';
      try { const url = new URL(document.referrer); if (['http:','https:'].includes(url.protocol)) referrer = url.origin + '/'; } catch {}
      gtag('config', id, {
        send_page_view:false,
        page_location:location.origin + page,
        page_referrer:referrer,
        allow_google_signals:false,
        allow_ad_personalization_signals:false,
        cookie_expires:90 * 24 * 60 * 60,
        cookie_flags:'SameSite=Lax;Secure'
      });
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      script.addEventListener('error', () => { unavailable = true; window['ga-disable-' + id] = true; refreshStatus(); });
      document.head.append(script);
    } else {
      gtag('consent', 'update', {...deny, analytics_storage:'granted'});
    }
    if (!measured) {
      measured = true;
      track('page_view', {page_location:location.origin + page, page_title:document.title});
    }
  }
  function applyChoice() {
    if (allowed()) start();
    else {
      window['ga-disable-' + id] = true;
      if (initialized) gtag('consent', 'update', deny);
      clearCookies();
    }
    refreshStatus();
  }
  function closePanel() {
    panel.hidden = true;
    if (returnFocus) { returnFocus.focus({preventScroll:true}); returnFocus = null; }
  }
  settings.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => { returnFocus = button; refreshStatus(); panel.hidden = false; panel.querySelector('[data-analytics-choice]').focus({preventScroll:true}); });
  });
  panel.querySelectorAll('[data-analytics-choice]').forEach(button => button.addEventListener('click', () => {
    choice = button.dataset.analyticsChoice;
    try { localStorage.setItem(key, JSON.stringify({choice, at:Date.now()})); } catch {}
    applyChoice();
    closePanel();
  }));
  panel.querySelector('[data-analytics-close]').addEventListener('click', closePanel);
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closePanel(); } });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { choice = readChoice(); applyChoice(); panel.hidden = Boolean(choice) || browserOptOut; } });

  // Only known interface controls are measured. Never copy input text or URLs
  // containing query parameters into custom events.
  const controls = new Map([
    ['data-film-play','animation_toggle'], ['data-project-film-play','animation_toggle'],
    ['data-film-replay','animation_replay'], ['data-project-film-replay','animation_replay'],
    ['data-film-chapter','animation_chapter'], ['data-project-film-chapter','animation_chapter'],
    ['data-agent-stage','agent_stage'], ['data-agent-next','agent_next'], ['data-agent-back','agent_back'], ['data-agent-reset','agent_restart'],
    ['data-next','walkthrough_next'], ['data-back','walkthrough_back'], ['data-reset','walkthrough_restart'],
    ['data-enlarge','figure_enlarge'], ['data-frame','tem_frame'], ['data-model','forecast_model'], ['data-task','methane_task'],
    ['data-peptide-evidence','peptide_evidence'], ['data-tour-view','tourist_view'], ['data-play','recording_embed'],
    ['data-amino','amino_acid'],
    ['data-choice','example_select'], ['data-agent-question','agent_question'], ['data-peptide-select','peptide_select'],
    ['data-film-example','animation_example'], ['data-film-request','animation_route'], ['data-project-film-scenario','agent_scenario'],
    ['data-compare','tem_comparison'], ['data-decode','sequence_decode'], ['data-film-seek','animation_seek'], ['data-project-film-seek','animation_seek']
  ]);
  const controlSelector = [...controls.keys()].map(name => '[' + name + ']').join(',');
  function sourceArea(element) {
    return element.closest('[data-carousel]') ? 'hero' : element.closest('nav') ? 'navigation' : element.closest('footer') ? 'footer' : 'content';
  }
  function demoControl(element) {
    const attribute = [...controls.keys()].find(name => element.hasAttribute(name));
    const parameters = {control:controls.get(attribute)};
    if (element.tagName === 'SELECT') parameters.selection = String(element.selectedIndex);
    else if (element.tagName === 'INPUT' && element.type === 'range') {
      const min = Number(element.min || 0), max = Number(element.max || 100), value = Number(element.value);
      if (Number.isFinite(value) && max > min) parameters.selection = String(Math.round(Math.max(0, Math.min(1, (value-min)/(max-min))) * 100));
    } else {
      const value = element.getAttribute(attribute);
      if (/^\d{1,2}$/.test(value)) parameters.selection = value;
    }
    track('demo_interaction', parameters);
  }
  document.addEventListener('click', event => {
    if (!allowed() || !event.target.closest) return;
    const link = event.target.closest('a[href]');
    if (link) {
      const raw = link.getAttribute('href') || '';
      if (raw.startsWith('mailto:') || raw.startsWith('tel:')) {
        track('contact_click', {contact_method:raw.startsWith('mailto:') ? 'email' : 'phone', source_area:sourceArea(link)}); return;
      }
      let url;
      try { url = new URL(raw, location.origin); } catch { return; }
      if (!['http:','https:'].includes(url.protocol)) return;
      if (url.origin === location.origin) {
        if (url.pathname === '/downloads/Resume_Yash_Gandhi.pdf') track('resume_click', {link_kind:link.hasAttribute('download') ? 'download' : 'view', source_area:sourceArea(link)});
        else if (/^\/work\/[a-z0-9-]+\/$/.test(url.pathname)) track('project_open', {project_id:url.pathname.split('/')[2], source_area:sourceArea(link)});
        else if (/^\/citations\/[a-z0-9-]+\.txt$/.test(url.pathname)) track('citation_click', {publication_id:url.pathname.split('/').pop().replace('.txt','')});
      } else {
        const host = url.hostname.replace(/^www\./, '');
        const kind = host === 'linkedin.com' || host === 'github.com' ? 'profile_or_code' : host === 'youtube.com' || host === 'youtu.be' ? 'recording' : link.closest('.publication') ? 'publication' : 'reference';
        track('external_link', {destination_domain:host, link_kind:kind, source_area:sourceArea(link)});
      }
      return;
    }
    const element = event.target.closest(controlSelector);
    if (element && element.tagName !== 'SELECT' && element.tagName !== 'INPUT') { demoControl(element); return; }
    const carouselButton = event.target.closest('[data-carousel] button');
    if (carouselButton) {
      const control = carouselButton.hasAttribute('data-slide-to') ? 'select' : carouselButton.hasAttribute('data-prev') ? 'previous' : carouselButton.hasAttribute('data-next-slide') ? 'next' : 'play_pause';
      track('carousel_interaction', {control});
    }
  }, true);
  document.addEventListener('change', event => {
    if (!allowed() || !event.target.closest) return;
    const control = event.target.closest(controlSelector);
    if (control) demoControl(control);
  }, true);
  panel.hidden = Boolean(choice) || browserOptOut;
  applyChoice();
})();
