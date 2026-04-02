import { ITEMS } from '/tile/data/items.js';
import { renderTile } from '/tile/tile.js';

const TILE_WIDTH   = 300;
const TILE_GAP     = 20;
const TILE_STEP    = TILE_WIDTH + TILE_GAP;
const SPIN_DURATION = 3500;

const AGE_STEPS = [
  { label: 'Youth',       key: 'youth'   },
  { label: 'Teen',        key: 'teens'   },
  { label: 'Young Adult', key: 'adults'  },
  { label: 'Adult',       key: 'adults'  },
  { label: '65+',         key: 'seniors' },
];

const sliderIndex = val => Math.round(val / 10);

// ── Filters ──────────────────────────────────────────────────────────────────

function daysBetween(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((new Date(dateStr + 'T00:00:00') - today) / 86_400_000);
}

function matchesTimeSlider(dateStr, sliderVal) {
  const d = daysBetween(dateStr);
  switch (sliderIndex(sliderVal)) {
    case 0: return d === 0;
    case 1: return d === 1;
    case 2: return d >= 0 && d <= 6;
    case 3: return d >= 7 && d <= 13;
    default: return true;
  }
}

function filterEventsByTime(ageVal, timeVal) {
  const key = AGE_STEPS[sliderIndex(ageVal)].key;
  return ITEMS.filter(item => item.type === "event" && item.age?.[key] && matchesTimeSlider(item.date, timeVal));
}

function filterEventsByAge(ageVal) {
  const key = AGE_STEPS[sliderIndex(ageVal)].key;
  return ITEMS.filter(item => item.type === "event" && item.age?.[key]);
}

function filterLocationsByAge(ageVal) {
  const key = AGE_STEPS[sliderIndex(ageVal)].key;
  return ITEMS.filter(item => item.type === "location" && item.age?.[key]);
}

// ── State ─────────────────────────────────────────────────────────────────────

let track       = null;
let offset      = 0;      // current translateX (positive px we've scrolled)
let rafId       = null;
let isSpinning  = false;
const LOOP_LEN  = () => ITEMS.length * TILE_STEP;

// ── Track ─────────────────────────────────────────────────────────────────────

function buildTrack() {
  track = document.createElement('div');
  track.id = 'roulette-track';

  // 3 copies is enough — we'll always reset offset after landing
  for (let c = 0; c < 3; c++) {
    ITEMS.forEach((item, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'roulette-tile';
      wrapper.dataset.itemIndex = i;
      wrapper.dataset.copy = c;
      wrapper.appendChild(renderTile(item));
      track.appendChild(wrapper);
    });
  }
  return track;
}

function setOffset(px) {
  offset = px;
  track.style.transform = `translateX(-${px}px)`;
}

// ── Passive drift (rAF, no CSS animation) ────────────────────────────────────

function startDrift() {
  if (rafId) return;
  let last = null;

  function tick(ts) {
    if (last === null) last = ts;
    const dt = ts - last; last = ts;

    // 40 px/s drift, always forward, wrap within one loop
    offset = (offset + dt * 0.04) % LOOP_LEN();
    track.style.transform = `translateX(-${offset}px)`;
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

function stopDrift() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}

// ── Spin & land ───────────────────────────────────────────────────────────────

function spinAndLand(winnerIndex, onDone) {
  stopDrift();
  isSpinning = true;

  // Clear any previous winner
  track.querySelectorAll('.roulette-winner').forEach(el =>
    el.classList.remove('roulette-winner')
  );

  const viewport      = document.getElementById('roulette-viewport');
  const viewportWidth = viewport?.offsetWidth || 800;
  const centerOffset  = Math.floor((viewportWidth - TILE_WIDTH) / 2);

  // To center a tile, offset should be tileStart - centerOffset.
  // We target copy 1 (middle copy) for a smooth spin.
  const landingPos = ITEMS.length * TILE_STEP + winnerIndex * TILE_STEP - centerOffset;

  // Spin at least one full loop past current offset before landing
  // Add extra loops so it always feels like a real spin
  const minSpinDistance = LOOP_LEN() * 2;
  let targetOffset = landingPos;
  while (targetOffset < offset + minSpinDistance) {
    targetOffset += LOOP_LEN();
  }

  // Disable transition, snap to current offset (no jump)
  track.style.transition = 'none';
  track.style.transform  = `translateX(-${offset}px)`;
  void track.offsetWidth; // reflow

  // Apply spin transition
  track.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.12, 0, 0.2, 1)`;
  track.style.transform  = `translateX(-${targetOffset}px)`;

  track.addEventListener('transitionend', () => {
    offset = targetOffset % LOOP_LEN(); // normalize so we never drift to huge numbers
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${offset}px)`;

    // After normalizing to one loop, copy 0 is the visible canonical target.
    const toHighlight = track.querySelector(
      `.roulette-tile[data-item-index="${winnerIndex}"][data-copy="0"]`
    );

    if (toHighlight) toHighlight.classList.add('roulette-winner');

    isSpinning = false;
    onDone?.();
  }, { once: true });
}

// ── Error ─────────────────────────────────────────────────────────────────────

function showError(msg) {
  const existing = document.getElementById('roulette-error');
  if (existing) existing.remove();
  const err = document.createElement('div');
  err.id = 'roulette-error';
  err.className = 'roulette-error';
  err.textContent = msg;
  document.getElementById('roulette-viewport')?.after(err);
}

function clearError() {
  document.getElementById('roulette-error')?.remove();
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initGenerate() {
  const ageSlider   = document.getElementById('age');
  const timeSlider  = document.getElementById('time');
  const generateBtn = document.getElementById('generatebtn');
  const container   = document.getElementById('slideshow-container');

  if (!ageSlider || !timeSlider || !generateBtn || !container) return;

  // Build viewport + track once
  const viewport = document.createElement('div');
  viewport.id = 'roulette-viewport';
  container.innerHTML = '';
  container.appendChild(viewport);
  viewport.appendChild(buildTrack());

  startDrift();

  generateBtn.addEventListener('click', () => {
    if (isSpinning) return;
    clearError();

    const ageVal  = parseInt(ageSlider.value,  10);
    const timeVal = parseInt(timeSlider.value, 10);
    
    // First, try to find events matching both age and time restrictions
    let matched = filterEventsByTime(ageVal, timeVal);
    
    // If no events match time restrictions, try any event matching age
    if (matched.length === 0) matched = filterEventsByAge(ageVal);
    
    // If still no events, fall back to locations matching age
    if (matched.length === 0) matched = filterLocationsByAge(ageVal);

    if (matched.length === 0) {
      showError('No events or locations match those filters. Try a different age or time range!');
      return;
    }

    const winner      = matched[Math.floor(Math.random() * matched.length)];
    const winnerIndex = ITEMS.findIndex(item => item.id === winner.id);
    if (winnerIndex === -1) return;

    spinAndLand(winnerIndex);
  });
}