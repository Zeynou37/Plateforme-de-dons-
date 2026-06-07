'use strict';

/* ============================================================
   DATA
============================================================ */
const DONATIONS = [
  // ── GAZA ──
  {
    id: 'g1', cat: 'gaza', status: 'close', urgent: false,
    title_ar:  'إغاثة أطفال غزة — طرود غذائية',
    title_fr:  'Secours enfants de Gaza — Colis alimentaires',
    target_ar: 'أطفال قطاع غزة المحاصرين',
    target_fr: 'Enfants assiégés de Gaza',
    desc_ar:   'توفير طرود غذائية طارئة للأطفال الذين فقدوا مصادر التغذية جراء الحصار. كل طرد يكفي عائلة لأسبوعين كاملين.',
    desc_fr:   "Fourniture de colis alimentaires d'urgence aux enfants privés de nourriture à cause du blocus. Chaque colis suffit une famille pour deux semaines.",
    goal_ar:   '500,000 أوقية',  goal_fr: '500 000 MRU',
    open_date: 'غير متوفر',      close_date: 'غير متوفر',
    don_num:   'غير متوفر', email: 'dons@jama3a-rouaa.mr',
    assoc:     'جمعية الرعاة',
    verse_ar:  '﴿ وَيُطْعِمُونَ الطَّعَامَ عَلَىٰ حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا ﴾ — الإنسان: ٨',
    verse_fr:  "﴿ Ils donnent à manger, par amour pour Lui, au pauvre, à l'orphelin et au captif ﴾ — Al-Insan: 8",
  },

  // ── OTHER ──
  {
    id: 'o1', cat: 'other', status: 'open', urgent: true,
    title_ar:  'بناء مسجد',
    title_fr:  'Construction d\'une mosquée',
    target_ar: 'غير متوفر',
    target_fr: 'indisponible',
    desc_ar:   'مشروع بناء مسجد في قرية تفتقر إلى مكان للصلاة',
    desc_fr:   'Construction d\'une mosquée dans un village dépourvu de lieu de prière.',
    goal_ar:   '700  أوقية قديمة', goal_fr: '700 MRU',
    open_date: '2026-06-01',     close_date: 'غير متوفر',
    don_num:   '20099999', email: '234037@isgm.mr',
    assoc:     'جمعية نسائم الخير',
    verse_ar:  '« مَنْ بَنَى مَسْجِدًا لِلَّهِ بَنَى اللَّهُ لَهُ بَيْتًا فِي الجَنَّةِ » — رواه مسلم',
    verse_fr:  '« Quiconque construit une mosquée pour Allah, Allah lui construira une maison au Paradis » — Muslim',
  },  
];

/* ============================================================
   TRANSLATIONS
============================================================ */
const T = {
  ar: {
    open:'مفتوح', closed:'مغلق', urgent:'عاجل',
    close_date:'تاريخ الإغلاق', open_date:'تاريخ الفتح',
    target:'الجهة المستفيدة', goal:'السهم المالي',
    assoc:'الجمعية', status:'الحالة', don_num:'رقم التبرع',
    details:'التفاصيل',
    ss_title:'إرسال لقطة الشاشة بعد التبرع',
    ss_hint:'أرسل لقطة الشاشة إلى الجمعية كإثبات للتبرع',
    ss_drop:'اضغط أو اسحب لقطة الشاشة هنا',
    ss_sub:'PNG، JPG — حجم أقصى 5MB',
    ss_send:'إرسال اللقطة',
    ss_ok:'شكراً! سيتم مراجعة لقطتك 🤲',
    ss_rm:'إزالة',
    share:'مشاركة هذا التبرع',
    share_ok:'تم نسخ الرابط! شاركه مع الآخرين 🤲',
    vis:'زائر اليوم',
    not_img:'يجب أن يكون الملف صورة',
    too_big:'الصورة أكبر من 5 ميغابايت',
  },
  fr: {
    open:'Ouvert', closed:'Clôturé', urgent:'Urgent',
    close_date:"Date de clôture", open_date:"Date d'ouverture",
    target:'Bénéficiaire', goal:'Actions financières',
    assoc:'Association', status:'Statut', don_num:'N° du don',
    details:'Détails',
    ss_title:'Envoyer une capture après le don',
    ss_hint:"Envoyez votre capture d'écran à l'association comme preuve",
    ss_drop:'Cliquez ou glissez la capture ici',
    ss_sub:'PNG, JPG — Max 5 Mo',
    ss_send:'Envoyer la capture',
    ss_ok:'Merci ! Votre capture sera examinée 🤲',
    ss_rm:'Supprimer',
    share:'Partager ce don',
    share_ok:'Lien copié ! Partagez avec les autres 🤲',
    vis:'visiteur(s)',
    not_img:"Le fichier doit être une image",
    too_big:'Image trop lourde (max 5 Mo)',
  },
};

/* ============================================================
   STATE
============================================================ */
let lang   = 'ar';
let theme  = 'dark';
let filter = 'all';
let search = '';
let openId = null;

/* ============================================================
   HELPERS
============================================================ */
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function fmtDate(str) {
  const d = new Date(str);
  if (isNaN(d)) return str;
  const loc = lang === 'ar' ? 'ar-SA' : 'fr-FR';
  return d.toLocaleDateString(loc, {year:'numeric',month:'short',day:'numeric'});
}

function countUp(el, target, ms) {
  const start = performance.now();
  const ease  = t => 1 - Math.pow(1 - t, 3);
  (function tick(now) {
    const p = Math.min((now - start) / ms, 1);
    el.textContent = Math.round(target * ease(p));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ============================================================
   VISITOR COUNTER
============================================================ */
async function trackVisitor() {
  try {
    // جلب IP حقيقي من API مجاني
    const res  = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    const ip   = data.ip || 'unknown';

    const today = new Date().toDateString();
    let rec = JSON.parse(localStorage.getItem('rua3a_day') || '{"date":"","ids":[],"n":0}');
    if (rec.date !== today) rec.date = today;
    if (!rec.ids.includes(ip)) {
      rec.ids.push(ip);
      rec.n++;
    }
    localStorage.setItem('rua3a_day', JSON.stringify(rec));
    return rec.n;
  } catch(e) {
    return 1;
  }
}
/* ============================================================
   RENDER CARDS
============================================================ */
function renderCards() {
  const t  = T[lang];
  const q  = search.trim().toLowerCase();

  const list = DONATIONS.filter(d => {
    const title  = lang === 'ar' ? d.title_ar  : d.title_fr;
    const target = lang === 'ar' ? d.target_ar : d.target_fr;
    const okF =
      filter === 'all' ||
      (filter === 'open'   && d.status === 'open'   && !d.urgent) ||
      (filter === 'closed' && d.status === 'closed') ||
      (filter === 'urgent' && d.urgent && d.status === 'open');
    const okS = !q || title.toLowerCase().includes(q) || target.toLowerCase().includes(q);
    return okF && okS;
  });

  const gList = list.filter(d => d.cat === 'gaza');
  const oList = list.filter(d => d.cat === 'other');

  document.getElementById('grid-gaza').innerHTML  = gList.map((d,i) => cardHTML(d,i)).join('');
  document.getElementById('grid-other').innerHTML = oList.map((d,i) => cardHTML(d,i)).join('');

  document.getElementById('empty-msg').style.display =
    (gList.length + oList.length === 0) ? 'block' : 'none';

  // attach listeners
  document.querySelectorAll('.don-card').forEach(c => {
    c.addEventListener('click', () => openModal(c.dataset.id));
    c.addEventListener('keydown', e => { if(e.key==='Enter') openModal(c.dataset.id); });
  });
  document.querySelectorAll('.card-btn').forEach(b => {
    b.addEventListener('click', e => { e.stopPropagation(); openModal(b.dataset.id); });
  });
}

function cardHTML(d, i) {
  const t      = T[lang];
  const title  = lang === 'ar' ? d.title_ar  : d.title_fr;
  const target = lang === 'ar' ? d.target_ar : d.target_fr;
  const closeD = fmtDate(d.close_date);
  const isOpen = d.status === 'open';
  const isGaza = d.cat === 'gaza';

  const IC_SUN    = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const IC_MOON   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const IC_BOLT   = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  const IC_CLOCK  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const IC_PIN    = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const IC_HASH   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`;
  const IC_INFO   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

  const statusBadge = isOpen
    ? `<span class="badge b-open">${IC_SUN} ${t.open}</span>`
    : `<span class="badge b-closed">${IC_MOON} ${t.closed}</span>`;
  const urgentBadge = d.urgent && isOpen
    ? `<span class="badge b-urgent">${IC_BOLT} ${t.urgent}</span>` : '';

  return `
<div class="don-card ${isGaza?'gz':'ot'} ${isOpen?'':'closed-card'}"
     data-id="${esc(d.id)}" tabindex="0" role="button"
     aria-label="${esc(title)}"
     style="animation-delay:${i*55}ms">
  <div class="card-top">
    <div class="card-badges">${statusBadge}${urgentBadge}</div>
    <h3 class="card-title">${esc(title)}</h3>
    <div class="card-target">${IC_PIN} <span>${esc(target)}</span></div>
    <div class="card-don-num">
      ${IC_HASH}
      <span class="don-num-lbl">${t.don_num}:</span>
      <span class="don-num-val">${esc(d.don_num)}</span>
    </div>
  </div>
  <div class="card-bottom">
    <div class="date-row">
      ${IC_CLOCK}
      <span class="date-lbl">${t.close_date}:</span>
      <span class="date-val">${closeD}</span>
    </div>
    <button class="card-btn" data-id="${esc(d.id)}">
      ${IC_INFO} ${t.details}
    </button>
  </div>
</div>`;
}

/* ============================================================
   MODAL
============================================================ */
function openModal(id) {
  const d = DONATIONS.find(x => x.id === id);
  if (!d) return;
  openId = id;
  const t      = T[lang];
  const title  = lang === 'ar' ? d.title_ar  : d.title_fr;
  const target = lang === 'ar' ? d.target_ar : d.target_fr;
  const desc   = lang === 'ar' ? d.desc_ar   : d.desc_fr;
  const goal   = lang === 'ar' ? d.goal_ar   : d.goal_fr;
  const verse  = lang === 'ar' ? d.verse_ar  : d.verse_fr;
  const isOpen = d.status === 'open';

  const IC_SUN  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const IC_MOON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const IC_BOLT = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;

  const statusIcon = isOpen ? IC_SUN : IC_MOON;
  const statusText = isOpen ? t.open : t.closed;
  const sc = isOpen ? '#22c55e' : '#6b7280';

  document.getElementById('modal-body').innerHTML = `
<h2 class="modal-title">${esc(title)}</h2>

<div class="mrow">
  <span class="mlbl">${t.status}</span>
  <span class="mval" style="color:${sc};font-weight:700;display:flex;align-items:center;gap:6px">
    ${statusIcon} ${statusText}${d.urgent ? ' &nbsp;' + IC_BOLT : ''}
  </span>
</div>
<div class="mrow">
  <span class="mlbl">${t.don_num}</span>
  <span class="mval"><span class="mval-code">${esc(d.don_num)}</span></span>
</div>
<div class="mrow">
  <span class="mlbl">${t.target}</span>
  <span class="mval">${esc(target)}</span>
</div>
<div class="mrow">
  <span class="mlbl">${t.open_date}</span>
  <span class="mval">${fmtDate(d.open_date)}</span>
</div>
<div class="mrow">
  <span class="mlbl">${t.close_date}</span>
  <span class="mval">${fmtDate(d.close_date)}</span>
</div>
<div class="mrow">
  <span class="mlbl">${t.goal}</span>
  <span class="mval">${esc(goal)}</span>
</div>
<div class="mrow">
  <span class="mlbl">${t.assoc}</span>
  <span class="mval">${esc(d.assoc)}</span>
</div>
<div class="mrow" style="border-bottom:none">
  <span class="mlbl"></span>
  <span class="mval" style="color:var(--tx2);font-size:.86rem;line-height:1.7">${esc(desc)}</span>
</div>

<div class="modal-verse">${esc(verse)}</div>

<div class="ss-section">
  <div class="ss-hdr">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    ${t.ss_title}
  </div>
  <p class="ss-hint">${t.ss_hint}</p>
  <label class="ss-label" id="ss-lbl">
    <input type="file" accept="image/*" class="ss-input" id="ss-file" />
    <div class="ss-drop" id="ss-drop">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="1.4" opacity=".6">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
      </svg>
      <span class="ss-drop-txt">${t.ss_drop}</span>
      <span class="ss-drop-sub">${t.ss_sub}</span>
    </div>
  </label>
  <div class="ss-preview" id="ss-prev">
    <img id="ss-img" src="" alt="preview" />
    <button class="ss-rm" id="ss-rm">${t.ss_rm} ✕</button>
  </div>
  <button class="ss-send" id="ss-send">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
    ${t.ss_send}
  </button>
</div>

<button class="modal-share" id="modal-share-btn">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
  ${t.share}
</button>
`;

  // Wire screenshot
  const fileInput = document.getElementById('ss-file');
  const drop      = document.getElementById('ss-drop');
  const prev      = document.getElementById('ss-prev');
  const img       = document.getElementById('ss-img');
  const lbl       = document.getElementById('ss-lbl');
  const rmBtn     = document.getElementById('ss-rm');
  const sendBtn   = document.getElementById('ss-send');
  const shareBtn  = document.getElementById('modal-share-btn');

  function loadFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast(T[lang].not_img); return; }
    if (file.size > 5*1024*1024)         { showToast(T[lang].too_big); return; }
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      prev.style.display = 'flex';
      lbl.style.display  = 'none';
      sendBtn.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', () => loadFile(fileInput.files[0]));

  drop.addEventListener('dragover',  e => { e.preventDefault(); drop.classList.add('drag'); });
  drop.addEventListener('dragleave', ()  => drop.classList.remove('drag'));
  drop.addEventListener('drop', e => {
    e.preventDefault(); drop.classList.remove('drag');
    loadFile(e.dataTransfer.files[0]);
  });

  rmBtn.addEventListener('click', () => {
    img.src = ''; fileInput.value = '';
    prev.style.display    = 'none';
    lbl.style.display     = 'block';
    sendBtn.style.display = 'none';
  });

  sendBtn.addEventListener('click', () => {
    const phone = '22236744422'; // ← ضع رقم واتساب الجمعية هنا (مع رمز الدولة بدون +)
    const msg = lang === 'ar'
      ? `السلام عليكم، أرسل لقطة الشاشة كإثبات تبرعي.\nرقم التبرع: ${d.don_num}\nالعنوان: ${d.title_ar}`
      : `Bonjour, voici ma capture d'écran comme preuve de don.\nN° du don: ${d.don_num}\nTitre: ${d.title_fr}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    showToast(T[lang].ss_ok);
  });

  shareBtn.addEventListener('click', () => {
    const url = location.href.split('?')[0] + '?don=' + id;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast(T[lang].share_ok));
    } else {
      const ta = document.createElement('textarea');
      ta.value = url; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      showToast(T[lang].share_ok);
    }
  });

  // Show modal
  document.getElementById('modal-bg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
  document.body.style.overflow = '';
  openId = null;
}

/* ============================================================
   LANGUAGE
============================================================ */
function setLang(l) {
  lang = l;
  document.body.setAttribute('data-lang', l);
  document.documentElement.lang = l;
  document.body.style.direction = l === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-label').textContent = l === 'ar' ? 'FR' : 'AR';

  // Update all data-ar / data-fr text nodes
  document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
    el.textContent = el.getAttribute('data-' + l);
  });

  // Update search placeholder
  const si = document.getElementById('search-input');
  si.placeholder = si.getAttribute('data-ph-' + l);

  renderCards();
}

/* ============================================================
   THEME
============================================================ */
function setTheme(th) {
  theme = th;
  document.body.classList.toggle('dark-mode',  th === 'dark');
  document.body.classList.toggle('light-mode', th === 'light');
  document.querySelector('.ic-dark').style.display = th === 'dark'  ? '' : 'none';
  document.querySelector('.ic-light').style.display = th === 'light' ? '' : 'none';
  localStorage.setItem('rua3a_theme', th);
}

/* ============================================================
   STATS
============================================================ */
function updateStats() {
  const opens  = DONATIONS.filter(d => d.status === 'open');
  const gazas  = opens.filter(d => d.cat === 'gaza');
  const others = opens.filter(d => d.cat === 'other');
  countUp(document.getElementById('st-open'),  opens.length,  900);
  countUp(document.getElementById('st-gaza'),  gazas.length,  900);
  countUp(document.getElementById('st-other'), others.length, 900);
}

/* ============================================================
   PARTICLES
============================================================ */
function initParticles() {
  const bg = document.getElementById('particles-bg');
  const n  = window.innerWidth < 768 ? 7 : 16;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'ptc';
    const sz = Math.random() * 2.5 + 1;
    p.style.cssText =
      `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;` +
      `animation-duration:${Math.random()*18+14}s;` +
      `animation-delay:${Math.random()*18}s;`;
    bg.appendChild(p);
  }
}

/* ============================================================
   DEEP LINK
============================================================ */
function handleDeepLink() {
  const p = new URLSearchParams(location.search).get('don');
  if (p && DONATIONS.find(d => d.id === p)) setTimeout(() => openModal(p), 700);
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // Theme
  const saved = localStorage.getItem('rua3a_theme') || 'dark';
  setTheme(saved);

  // Particles
  initParticles();

  // Visitor
  trackVisitor().then(vc => {
  countUp(document.getElementById('vis-count'), vc, 1400);
});

  // Render
  renderCards();

  // Stats
  setTimeout(updateStats, 350);

  // Deep link
  handleDeepLink();

  // Lang button
  document.getElementById('btn-lang').addEventListener('click', () => {
    setLang(lang === 'ar' ? 'fr' : 'ar');
  });

  // Theme button
  document.getElementById('btn-theme').addEventListener('click', () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  });

  // Search
  document.getElementById('search-input').addEventListener('input', function() {
    search = this.value;
    renderCards();
  });

  // Filter chips
  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      filter = c.dataset.f;
      renderCards();
    });
  });

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-bg').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.cat-section').forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(28px)';
    s.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(s);
  });
});
