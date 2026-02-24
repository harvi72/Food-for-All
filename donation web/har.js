/* ─────────────────────────────────────────────
   FOOD FOR ALL — ANIMATED SCRIPT
───────────────────────────────────────────── */

const API_URL = 'http://localhost:3000/api';
let map;
let allDonations = [];

// ── Mock donations for demo ──────────────────
const DEMO_DONATIONS = [
  { id:1, donorName:'Hotel Grand Spice', foodType:'Cooked Meals', quantity:80, description:'Dal makhani, rice, roti. No allergens.', paymentAmount:500, address:'Connaught Place, New Delhi', latitude:28.6328, longitude:77.2197, donationDate:new Date(Date.now()-12e5).toISOString() },
  { id:2, donorName:'Fresh Valley Bakery', foodType:'Bakery Items', quantity:45, description:'Bread loaves and croissants.', paymentAmount:0, address:'Saket, New Delhi', latitude:28.5244, longitude:77.2066, donationDate:new Date(Date.now()-36e5).toISOString() },
  { id:3, donorName:'City Grocery Mart', foodType:'Vegetables', quantity:30, description:'Fresh seasonal vegetables.', paymentAmount:200, address:'Karol Bagh, New Delhi', latitude:28.6519, longitude:77.1909, donationDate:new Date(Date.now()-72e5).toISOString() },
  { id:4, donorName:'Sunrise Caterers', foodType:'Cooked Meals', quantity:200, description:'Wedding surplus — biryani, paneer, desserts.', paymentAmount:1000, address:'Dwarka, New Delhi', latitude:28.5921, longitude:77.0460, donationDate:new Date(Date.now()-180e3).toISOString() },
  { id:5, donorName:'Rahul Sharma', foodType:'Packed Food', quantity:15, description:'Sealed snack packets, unused.', paymentAmount:0, address:'Lajpat Nagar, New Delhi', latitude:28.5665, longitude:77.2431, donationDate:new Date(Date.now()-9e5).toISOString() },
  { id:6, donorName:'Metro Superstore', foodType:'Fruits', quantity:50, description:'Apples, bananas, guava — last-day stock.', paymentAmount:300, address:'Rohini, New Delhi', latitude:28.7041, longitude:77.1025, donationDate:new Date(Date.now()-27e5).toISOString() },
];

const FOOD_EMOJIS = { 'Cooked Meals':'🍛', 'Bakery Items':'🥖', 'Vegetables':'🥦', 'Fruits':'🍎', 'Packed Food':'📦', 'Snacks':'🍿', default:'🍽️' };

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCanvas();
  initScrollReveal();
  animateCounters();
  initMap();
  loadDonations();
  setupForm();
});

// ─────────────────────────────────────────────
// NAVBAR — shrink + link highlight on scroll
// ─────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nl');
  const sections = ['home','donate','donations','map','about'];

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);

    // Active link
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive:true });

  // Burger
  document.getElementById('burger').addEventListener('click', () => {
    nav.classList.toggle('menu-open');
  });
}

// ─────────────────────────────────────────────
// HERO CANVAS — floating food particles
// ─────────────────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const EMOJIS = ['🍎','🥕','🍞','🥦','🍊','🌽','🍇','🥗','🍅','🫐'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn() {
    return {
      x: Math.random() * W,
      y: H + 20,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      size: 14 + Math.random() * 16,
      speed: 0.4 + Math.random() * 0.6,
      drift: (Math.random() - .5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - .5) * 0.02,
      opacity: 0.06 + Math.random() * 0.12,
    };
  }

  for (let i = 0; i < 18; i++) {
    const p = spawn();
    p.y = Math.random() * H;
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();

      p.y -= p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y < -30) { Object.assign(p, spawn()); p.x = Math.random() * W; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
}

// ─────────────────────────────────────────────
// COUNTER ANIMATION
// ─────────────────────────────────────────────
function animateCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString('en-IN');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold:.5 });
  document.querySelectorAll('.hs-num[data-target]').forEach(el => obs.observe(el));
}

// ─────────────────────────────────────────────
// MAP
// ─────────────────────────────────────────────
function initMap() {
  map = L.map('mapContainer', { zoomControl:false }).setView([28.6139, 77.2090], 11);
  L.control.zoom({ position:'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution:'&copy; OpenStreetMap &copy; CARTO', maxZoom:19
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      map.setView([pos.coords.latitude, pos.coords.longitude], 13);
      L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
        radius:10, fillColor:'#2d7a52', color:'#fff', weight:3, fillOpacity:.9
      }).addTo(map).bindPopup('<strong>📍 You are here</strong>');
    });
  }
}

function updateMap(donations) {
  if (!map) return;
  map.eachLayer(l => { if (l instanceof L.Marker || (l instanceof L.CircleMarker && !l._isUser)) map.removeLayer(l); });

  const icon = emoji => L.divIcon({
    html:`<div style="font-size:20px;width:34px;height:34px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.2);border:2px solid #2d7a52">${emoji}</div>`,
    className:'', iconSize:[34,34], iconAnchor:[17,17]
  });

  donations.forEach(d => {
    if (!d.latitude || !d.longitude) return;
    const emoji = FOOD_EMOJIS[d.foodType] || FOOD_EMOJIS.default;
    L.marker([d.latitude, d.longitude], { icon:icon(emoji) })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:DM Sans,sans-serif;min-width:180px">
          <strong style="color:#1a5c3a">${d.donorName}</strong><br/>
          <span style="color:#7a7060;font-size:.85rem">${d.foodType} — ${d.quantity} servings</span>
          ${d.paymentAmount > 0 ? `<br/><span style="color:#d97706;font-size:.8rem;font-weight:700">💰 ₹${d.paymentAmount}</span>` : ''}
          <br/><span style="font-size:.75rem;color:#aaa">📅 ${new Date(d.donationDate).toLocaleDateString('en-IN')}</span>
        </div>
      `);
  });
}

// ─────────────────────────────────────────────
// FORM — MULTI STEP
// ─────────────────────────────────────────────
function goStep(n) {
  document.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
  document.getElementById('fp' + n).classList.add('active');

  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active','done');
    if (i + 1 < n) s.classList.add('done');
    if (i + 1 === n) s.classList.add('active');
    if (s.classList.contains('done')) s.querySelector('.step-num').textContent = '✓';
    else s.querySelector('.step-num').textContent = i + 1;
  });
}

function setupForm() {
  document.getElementById('donationForm').addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.querySelector('.btn-submit');
  btn.classList.add('loading');

  const donation = {
    donorName: val('donorName'), donorEmail: val('donorEmail'), donorPhone: val('donorPhone'),
    foodType: val('foodType'), quantity: parseInt(val('quantity')),
    description: val('description'),
    paymentAmount: parseFloat(val('paymentAmount')) || 0,
    paymentMethod: val('paymentMethod') || '',
    address: val('address'),
    latitude: parseFloat(val('latitude')) || null,
    longitude: parseFloat(val('longitude')) || null,
    donationDate: new Date().toISOString()
  };

  try {
    const res = await fetch(`${API_URL}/donations`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(donation)
    });
    if (res.ok) { onSuccess(donation); }
    else { throw new Error('Server error'); }
  } catch {
    // Demo mode — add locally
    donation.id = Date.now();
    allDonations.unshift(donation);
    onSuccess(donation);
  } finally {
    btn.classList.remove('loading');
  }
}

function onSuccess(donation) {
  document.getElementById('listingId').textContent = '#FRP-' + Math.floor(1000 + Math.random() * 9000);
  showModal();
  spawnConfetti();
  document.getElementById('donationForm').reset();
  goStep(1);
  displayDonations(allDonations);
  updateMap(allDonations);
}

function val(id) { const el = document.getElementById(id); return el ? el.value : ''; }

// ─────────────────────────────────────────────
// LOAD DONATIONS
// ─────────────────────────────────────────────
async function loadDonations() {
  showSkeletons();
  try {
    const res = await fetch(`${API_URL}/donations`);
    const result = await res.json();
    allDonations = result.data || [];
  } catch {
    allDonations = DEMO_DONATIONS; // demo fallback
  }
  displayDonations(allDonations);
  updateMap(allDonations);
}

function showSkeletons() {
  const c = document.getElementById('donationsList');
  c.innerHTML = Array(4).fill(0).map(() => `
    <div class="donation-card" style="pointer-events:none">
      <div class="card-header">
        <div class="skeleton" style="width:44px;height:44px;border-radius:12px;flex-shrink:0"></div>
        <div style="flex:1">
          <div class="skeleton" style="width:60%;margin-bottom:8px"></div>
          <div class="skeleton" style="width:40%;height:14px"></div>
        </div>
      </div>
      <div class="skeleton" style="width:80%;margin-bottom:8px"></div>
      <div class="skeleton" style="width:55%;height:14px"></div>
    </div>
  `).join('');
}

function displayDonations(donations) {
  const c = document.getElementById('donationsList');
  if (!donations.length) {
    c.innerHTML = `<p style="text-align:center;color:var(--muted);padding:3rem;grid-column:1/-1">No donations yet. Be the first! 🍱</p>`;
    return;
  }
  c.innerHTML = donations.map((d, i) => {
    const emoji = FOOD_EMOJIS[d.foodType] || FOOD_EMOJIS.default;
    const daysAgo = Math.floor((Date.now() - new Date(d.donationDate)) / 3600000);
    const timeLabel = daysAgo < 1 ? 'Just now' : daysAgo < 24 ? `${daysAgo}h ago` : `${Math.floor(daysAgo/24)}d ago`;
    return `
    <div class="donation-card reveal-up" style="--d:${i*.06}s;animation-delay:${i*.06}s">
      <div class="card-header">
        <div class="card-emoji">${emoji}</div>
        <div>
          <div class="card-title">${d.foodType}</div>
          <div class="card-sub">${d.donorName}</div>
        </div>
      </div>
      <div class="card-tags">
        <span class="ctag ctag-green">🍽️ ${d.quantity} servings</span>
        ${d.paymentAmount > 0 ? `<span class="ctag ctag-amber">💰 ₹${d.paymentAmount}</span>` : ''}
        <span class="ctag ctag-blue">⏱ ${timeLabel}</span>
      </div>
      ${d.description ? `<div class="card-meta" style="margin-bottom:6px">📝 ${d.description}</div>` : ''}
      <div class="card-meta">
        <span>📍 ${d.address || 'Location not specified'}</span>
        <span>📅 ${new Date(d.donationDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
      </div>
    </div>`;
  }).join('');
  // re-observe new cards
  document.querySelectorAll('.donation-card.reveal-up:not(.visible)').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
}

// ─────────────────────────────────────────────
// FILTER
// ─────────────────────────────────────────────
function filterDonations(type, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  let filtered = allDonations;
  if (type === 'food')  filtered = allDonations.filter(d => !d.paymentAmount || d.paymentAmount === 0);
  if (type === 'money') filtered = allDonations.filter(d => d.paymentAmount > 0);
  displayDonations(filtered);
}

// ─────────────────────────────────────────────
// GEOLOCATION
// ─────────────────────────────────────────────
function getCurrentLocation() {
  if (!navigator.geolocation) { toast('Geolocation not supported in this browser.', 'error'); return; }
  const btn = document.querySelector('.btn-locate');
  btn.textContent = '🔄 Detecting…';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude:lat, longitude:lng } = pos.coords;
      document.getElementById('latitude').value = lat.toFixed(6);
      document.getElementById('longitude').value = lng.toFixed(6);

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(r => r.json())
        .then(data => { if (data.display_name) document.getElementById('address').value = data.display_name; })
        .catch(() => {});

      btn.innerHTML = '<span class="locate-pulse"></span>📍 Location Captured!';
      btn.style.borderColor = 'var(--green)';
      btn.disabled = false;
      toast('📍 Location detected successfully!');
    },
    err => {
      btn.innerHTML = '<span class="locate-pulse"></span>📍 Detect My Location';
      btn.disabled = false;
      toast('Could not get location: ' + err.message, 'error');
    }
  );
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
function showModal() {
  document.getElementById('successModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('successModal')) return;
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────
function spawnConfetti() {
  const area = document.getElementById('confettiArea');
  area.innerHTML = '';
  const COLORS = ['#f59e0b','#22c55e','#3b82f6','#ef4444','#a855f7','#ec4899','#14b8a6'];
  for (let i = 0; i < 38; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left:${Math.random()*100}%;
      background:${COLORS[i % COLORS.length]};
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
      animation-delay:${Math.random()*.8}s;
      animation-duration:${2+Math.random()}s;
    `;
    area.appendChild(el);
  }
  setTimeout(() => { area.innerHTML = ''; }, 4000);
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:9999;
    background:${type === 'error' ? '#dc2626' : '#1a5c3a'};
    color:#fff;padding:12px 20px;border-radius:12px;
    font-family:DM Sans,sans-serif;font-size:.9rem;font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,.25);
    animation:toast-in .35s cubic-bezier(.16,1,.3,1);
    max-width:320px;
  `;
  t.textContent = msg;
  const style = document.createElement('style');
  style.textContent = `@keyframes toast-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`;
  document.head.appendChild(style);
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3200);
}