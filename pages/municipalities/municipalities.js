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
};

// Panel emoji icons
const MUNI_ICONS = {
  'elizabeth':        '🌆', 'plainfield':    '🏘️', 'union':          '🏙️',
  'linden':           '🏭', 'rahway':        '🎭', 'summit':         '⛰️',
  'westfield':        '🛍️', 'scotch-plains': '🌳', 'clark':          '🏫',
  'cranford':         '🌊', 'hillside':      '🏠', 'springfield':    '🌿',
  'roselle':          '🌹', 'roselle-park':  '🌺', 'kenilworth':     '🌾',
  'fanwood':          '🏡', 'mountainside':  '🏔️', 'new-providence': '🔬',
  'berkeley-heights': '🌲', 'garwood':       '⚙️', 'winfield':       '🗺️',
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

  const iconEl = document.getElementById('muni-title-icon');
  if (iconEl) iconEl.textContent = MUNI_ICONS[selectedMunicipalityKey] || '🏙️';

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
    if (emptyMsg) emptyMsg.textContent = `No upcoming events for ${muni.name}.`;
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
  if (!response.ok) {
    throw new Error(`Failed to load municipality overlay: ${response.status}`);
  }

  const svgText = await response.text();
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const sourcePaths = [...parsed.querySelectorAll('path')];
  const svgNS = 'http://www.w3.org/2000/svg';
  const inkscapeNS = 'http://www.inkscape.org/namespaces/inkscape';

  sourcePaths.forEach(sourcePath => {
    const label = sourcePath.getAttributeNS(inkscapeNS, 'label')
      || sourcePath.getAttribute('inkscape:label')
      || '';
    const d = sourcePath.getAttribute('d');
    if (!label || !d) return;

    const key = normalizeMunicipalityLabel(label);
    const muni = MUNICIPALITY_MAP[key];
    if (!muni) return;

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'map-region');
    path.setAttribute('data-municipality-key', key);
    path.setAttribute('role', 'button');
    path.setAttribute('tabindex', '0');
    path.setAttribute('aria-label', `${muni.name} — click to view events`);
    path.setAttribute('aria-pressed', 'false');
    svgRoot.appendChild(path);
  });
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

    const cx = (marker.x / 100) * 1088;
    const cy = (marker.y / 100) * 757;

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