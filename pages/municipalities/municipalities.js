/**
 * municipalities.js
 *
 * Interactive municipalities map for Union County, NJ.
 *
 * Map visual:  unioncountymunicipalities.png placed as <img>
 * Hit regions: municipality SVG path overlay from unioncountymunicipalities1.svg
 * County pins: rendered on the same overlay SVG
 */

import { injectComponents } from '../../components/inject.js';
import { renderTiles } from '../../tile/tile.js';
import { ITEMS } from '../../tile/data/items.js';
import { MUNICIPALITIES, COUNTY_MARKERS } from './municipalityData.js';

// ── State ─────────────────────────────────────────────────
let selectedMunicipalityKey = null;

const MUNICIPALITY_MAP = Object.fromEntries(
  MUNICIPALITIES.map(m => [m.key, m])
);

const MUNICIPALITY_OVERLAY_URL = '/images/unioncountymunicipalities1.svg';
const OVERLAY_WIDTH = 1088;
const OVERLAY_HEIGHT = 757.33331;
let overlayDimensions = { width: OVERLAY_WIDTH, height: OVERLAY_HEIGHT };

const MUNICIPALITY_LABEL_ALIASES = {
  'new_providence': 'new-providence',
  'new-providence': 'new-providence',
  'berkely_heights': 'berkeley-heights',
  'berkely-heights': 'berkeley-heights',
  'berkeley_heights': 'berkeley-heights',
  'berkeley-heights': 'berkeley-heights',
  'roselle_park': 'roselle-park',
  'roselle-park': 'roselle-park',
  'scotch_plains': 'scotch-plains',
  'scotch-plains': 'scotch-plains',
  'winfield1': 'winfield',
  'winfield2': 'winfield',
  'union1':           'union',   // ← add these
  'union2':           'union',
  'union-township':   'union',

};

// ── Date Parsing ──────────────────────────────────────────
function parseEventDateTime(item) {
  if (!item.date) return new Date(0);
  const [year, month, day] = item.date.split('-').map(Number);
  let hours = 0, minutes = 0;
  if (item.time) {
    const m = item.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (m) {
      hours = parseInt(m[1], 10);
      minutes = parseInt(m[2], 10);
      const p = m[3]?.toUpperCase();
      if (p === 'PM' && hours !== 12) hours += 12;
      if (p === 'AM' && hours === 12) hours = 0;
    }
  }
  return new Date(year, month - 1, day, hours, minutes);
}

// ── Event Filtering ───────────────────────────────────────
function getUpcomingMunicipalityEvents(key, now = Date.now()) {
  return ITEMS
    .filter(item => item.municipality === key)
    .filter(item => parseEventDateTime(item).getTime() >= now)
    .sort((a, b) => parseEventDateTime(a) - parseEventDateTime(b))
    .slice(0, 2);
}

// ── Region Highlight ──────────────────────────────────────
function updateRegionSelection() {
  document.querySelectorAll('.map-region').forEach(el => {
    const active = el.dataset.municipalityKey === selectedMunicipalityKey;
    el.classList.toggle('is-active', active);
    el.setAttribute('aria-pressed', String(active));
  });
}

// ── Details Panel ─────────────────────────────────────────
function renderMunicipalityPanel() {
  const muni = MUNICIPALITY_MAP[selectedMunicipalityKey];
  if (!muni) return;

  document.getElementById('municipality-title').textContent = muni.name;

  const linkEl = document.getElementById('municipality-website-link');
  linkEl.href = muni.website;
  linkEl.style.display = 'inline-block';

  const tilesEl   = document.getElementById('municipality-event-tiles');
  const emptyEl   = document.getElementById('municipality-empty-state');
  const emptyMsg  = document.getElementById('empty-message');
  const labelEl   = document.getElementById('events-label');
  const countEl   = document.getElementById('events-count');
  const placeholder = document.getElementById('details-placeholder');

  if (placeholder) placeholder.hidden = true;
  tilesEl.innerHTML = '';
  emptyEl.hidden = true;
  if (labelEl) labelEl.hidden = true;

  const events = getUpcomingMunicipalityEvents(selectedMunicipalityKey);

  if (events.length > 0) {
    if (labelEl) labelEl.hidden = false;
    if (countEl) countEl.textContent = events.length;
    renderTiles(tilesEl, events);
  } else {
    emptyEl.hidden = false;
    if (emptyMsg) emptyMsg.innerHTML = `
      <div class="no-events-content">
    <div class="no-events-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <line x1="9" y1="16" x2="9.01" y2="16"></line>
        <line x1="15" y1="16" x2="15.01" y2="16"></line>
      </svg>
    </div>
    <h3 class="no-events-title">No resources found</h3>
    <p class="no-events-subtitle">We couldn't find any resources for this municipality.</p>
    <p class="no-events-cta-text">Think we should have one?</p>
    <a href="/pages/contact/contact.html" class="no-events-link">Let us know →</a>
  </div>`;
  }

  updateRegionSelection();
}

// ── Municipality Selection ────────────────────────────────
function selectMunicipality(key) {
  if (!MUNICIPALITY_MAP[key]) return;
  selectedMunicipalityKey = key;
  renderMunicipalityPanel();
}

// ── Marker Tooltip ────────────────────────────────────────
let tooltipTimeout = null;

function showMarkerTooltip(marker, svgEl) {
  clearTimeout(tooltipTimeout);
  const tooltip = document.getElementById('marker-tooltip');
  if (!tooltip) return;

  tooltip.querySelector('.marker-tooltip-title').textContent = marker.label;
  tooltip.querySelector('.marker-tooltip-desc').textContent  = marker.description || '';
  const linkEl = tooltip.querySelector('.marker-tooltip-link');
  linkEl.href          = marker.link || '#';
  linkEl.style.display = marker.link ? 'inline' : 'none';

  const shell     = document.querySelector('.map-shell');
  const shellRect = shell.getBoundingClientRect();
  const svgRect   = svgEl.getBoundingClientRect();
  const px        = (marker.x / 100) * svgRect.width  + (svgRect.left - shellRect.left);
  const py        = (marker.y / 100) * svgRect.height + (svgRect.top  - shellRect.top);
  const W         = 230;
  let left        = px + 14;
  let top         = py - 14;
  if (left + W > shellRect.width - 8) left = px - W - 14;
  if (top < 8) top = 8;

  tooltip.style.left = `${left}px`;
  tooltip.style.top  = `${top}px`;
  tooltip.hidden     = false;
}

function hideMarkerTooltip() {
  tooltipTimeout = setTimeout(() => {
    const t = document.getElementById('marker-tooltip');
    if (t) t.hidden = true;
  }, 120);
}

function normalizeMunicipalityLabel(label) {
  const normalized = (label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return MUNICIPALITY_LABEL_ALIASES[normalized]
    || MUNICIPALITY_LABEL_ALIASES[normalized.replace(/-/g, '_')]
    || normalized;
}

async function injectMunicipalityRegionsFromOverlay(svgRoot) {
  const response = await fetch(MUNICIPALITY_OVERLAY_URL);
  if (!response.ok) throw new Error(`Failed to load municipality overlay: ${response.status}`);

  const svgText = await response.text();
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const parseError = parsed.querySelector('parsererror');
  if (parseError) throw new Error('Failed to parse municipality overlay SVG.');

  const sourceSvg = parsed.querySelector('svg');
  if (!sourceSvg) throw new Error('No SVG root found in municipality overlay.');

  const sourceViewBox = sourceSvg.getAttribute('viewBox');
  if (sourceViewBox) {
    svgRoot.setAttribute('viewBox', sourceViewBox);
    const [, , width, height] = sourceViewBox.split(/\s+/).map(Number);
    if (Number.isFinite(width) && Number.isFinite(height)) {
      overlayDimensions = { width, height };
    }
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const sourceLayer = sourceSvg.querySelector('#g8') || sourceSvg;
  const clonedLayer = sourceLayer.cloneNode(true);
  svgRoot.appendChild(clonedLayer);

  const sourceImage = svgRoot.querySelector('image');
  if (sourceImage) {
    sourceImage.removeAttribute('style');
    sourceImage.setAttribute('class', 'map-base-image');
    sourceImage.setAttribute('pointer-events', 'none');
  }

  const inkscapeNS = 'http://www.inkscape.org/namespaces/inkscape';

  [...svgRoot.querySelectorAll('path')].forEach(path => {
    const label = path.getAttributeNS(inkscapeNS, 'label')
      || path.getAttribute('inkscape:label')
      || '';

      console.log('PATH LABEL:', label, '→', normalizeMunicipalityLabel(label)); // ← add just this line

    path.removeAttribute('style');
    path.removeAttribute('fill');
    path.removeAttribute('stroke');
    path.removeAttribute('stroke-width');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', 'transparent');
    path.setAttribute('pointer-events', 'none');

    const key = normalizeMunicipalityLabel(label) || 'union';
    const muni = MUNICIPALITY_MAP[key];
    if (!muni) return;

    path.setAttribute('class', 'map-region');
    path.setAttribute('data-municipality-key', key);
    path.setAttribute('role', 'button');
    path.setAttribute('tabindex', '0');
    path.setAttribute('aria-label', `${muni.name} — click to view events`);
    path.setAttribute('aria-pressed', 'false');
    path.setAttribute('pointer-events', 'all');
  });

  const fallbackImg = document.getElementById('union-county-map');
  if (fallbackImg) fallbackImg.hidden = true;
}

// ── Build SVG Overlay ─────────────────────────────────────
async function initializeMapSVG() {
  const svg = document.getElementById('map-overlay');
  if (!svg) return;

  // Load municipality path regions from the provided transparent SVG overlay.
  await injectMunicipalityRegionsFromOverlay(svg);

  // County landmark pins
  // COUNTY_MARKERS x/y are percentages — convert to 1088×757 coordinate space
  COUNTY_MARKERS.forEach(marker => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'county-marker');
    g.setAttribute('data-marker-id', marker.id);
    g.setAttribute('role', 'button');
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', marker.label);

    const cx = (marker.x / 100) * overlayDimensions.width;
    const cy = (marker.y / 100) * overlayDimensions.height;

    // Shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    shadow.setAttribute('cx', cx + 1.5);
    shadow.setAttribute('cy', cy + 1.5);
    shadow.setAttribute('r', '9');
    shadow.setAttribute('fill', 'rgba(0,0,0,0.18)');
    g.appendChild(shadow);

    // Pin circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'marker-pin-circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', '8');
    g.appendChild(circle);

    // Emoji icon
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', 'marker-pin-icon');
    text.setAttribute('x', cx);
    text.setAttribute('y', cy);
    text.textContent = marker.icon || '📍';
    g.appendChild(text);

    svg.appendChild(g);
  });

  // Wire up interactions
  svg.querySelectorAll('[data-municipality-key]').forEach(el => {
    el.addEventListener('click', () => selectMunicipality(el.dataset.municipalityKey));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectMunicipality(el.dataset.municipalityKey);
      }
    });
  });

  svg.querySelectorAll('[data-marker-id]').forEach(el => {
    const data = COUNTY_MARKERS.find(m => m.id === el.dataset.markerId);
    if (!data) return;
    el.addEventListener('mouseenter', () => showMarkerTooltip(data, svg));
    el.addEventListener('mouseleave', hideMarkerTooltip);
    el.addEventListener('focusin',   () => showMarkerTooltip(data, svg));
    el.addEventListener('focusout',  hideMarkerTooltip);
    el.addEventListener('click', () => {
      if (data.link) window.open(data.link, '_blank', 'noopener,noreferrer');
    });
    el.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && data.link) {
        e.preventDefault();
        window.open(data.link, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // Keep tooltip open when the user hovers over it
  const tooltip = document.getElementById('marker-tooltip');
  if (tooltip) {
    tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimeout));
    tooltip.addEventListener('mouseleave', hideMarkerTooltip);
  }
}

// ── Init ──────────────────────────────────────────────────
async function initMunicipalitiesPage() {
  await injectComponents();
  await initializeMapSVG();

  const defaultKey =
    MUNICIPALITIES.find(m => getUpcomingMunicipalityEvents(m.key).length > 0)?.key
    ?? 'elizabeth';

  selectMunicipality(defaultKey);
}

initMunicipalitiesPage();