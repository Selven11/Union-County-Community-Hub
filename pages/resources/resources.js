/* ===============================
   IMPORTS
================================ */
import { injectComponents } from '/components/inject.js';
import { getEvents }        from '/tile/data/items.js';
const events = getEvents();

/* ===============================
   DROPDOWN FUNCTIONALITY
================================ */

// makes each filter capable of dropping down
// also makes the dropdown go away when clicking on it
document.querySelectorAll('.dropdown-btn').forEach(btn => {
 btn.addEventListener('click', (e) => {
   e.stopPropagation();

   const dropdown = btn.nextElementSibling;

   document.querySelectorAll('.dropdown-content').forEach(d => {
     if (d !== dropdown) d.classList.remove('show');
   });


   dropdown.classList.toggle('show');
 });
});

// gets rid of dropdown when clicked anywhere
window.addEventListener('click', () => {
 document.querySelectorAll('.dropdown-content')
   .forEach(d => d.classList.remove('show'));
});


/* ===============================
   APPLIED FILTERS
================================ */
const appliedFiltersContainer = document.querySelector('.applied-filters');
// Track active filters by id
const activeFilters = new Set();

// adds and removes the filters from the dropdowns
document.querySelectorAll('.filter').forEach(filterBtn => {
 filterBtn.addEventListener('click', (e) => {
   e.stopPropagation();

   const id = filterBtn.id;
   const label = filterBtn.textContent;

   // If already active → remove
   if (activeFilters.has(id)) {
     activeFilters.delete(id);
     removeAppliedFilter(id);
     filterBtn.classList.remove('active');
   }
   // If not active → add
   else {
     activeFilters.add(id);
     addAppliedFilter(id, label);
     filterBtn.classList.add('active');

   }
    
   updateURL();
   applyFiltersFromURL();
 });
});

// adding filter function
function addAppliedFilter(id, label) {
 const chip = document.createElement('button');
 chip.className = 'applied-filter';
 chip.textContent = label + ' ✕';
 chip.dataset.filterId = id;


 chip.addEventListener('click', () => {
   activeFilters.delete(id);
   chip.remove();
   updateURL();
   applyFiltersFromURL();

   // sync dropdown button state
   const originalBtn = document.getElementById(id);
   if (originalBtn) originalBtn.classList.remove('active');
 });


 appliedFiltersContainer.appendChild(chip);
}

// removing filter function
function removeAppliedFilter(id) {
 const chip = appliedFiltersContainer.querySelector(
   `[data-filter-id="${id}"]`
 );
 if (chip) chip.remove();
}

// ---------------------
// URL syncing helper
// ---------------------
function updateURL() {
  const params = new URLSearchParams();

  // search query
  const searchInput = document.getElementById('search-input');
  if (searchInput.value) params.set('q', searchInput.value);

  // filters
  if (activeFilters.size > 0) {
    params.set('filters', Array.from(activeFilters).join(','));
  }

  // update URL without reload
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newURL);
}


/* ===============================
   LOADING EVENTS
================================ */
function createEventListItem(event) {
  const item = document.createElement('div');
  item.className = 'event-list-item';

  const date = new Date(event.date);
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  item.innerHTML = `
    <div class="tile-card">
      <div class="tile-img">
        <img src="${event.image || 'images/hero1.jpg'}" alt="${event.title}" loading="lazy">
      </div>

      <div class="tile-body">
        <p class="tile-meta">${event.category || 'Event'} · ${event.type || 'Community'}</p>
        <h3 class="tile-title">${event.title}</h3>
        <p class="tile-desc">${event.description}</p>

        <div class="tile-footer">
          <span class="tile-location">${event.location ? `📍 ${event.location}` : ''}</span>
          <a class="tile-link" href="${event.link || '#'}">Learn More →</a>
        </div>
      </div>
    </div>
  `;

  const tileCard = item.querySelector('.tile-card');
  if (tileCard) {
    tileCard.style.cursor = 'pointer';
    tileCard.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        return;
      }
      e.preventDefault();
      if (typeof window.openTileModal === 'function') {
        window.openTileModal(event);
      }
    });
  }

  return item;
}

function renderEventList(events) {
  const container = document.querySelector('.events');
  if (!container) return;

  container.innerHTML = '';

  events.forEach(event => {
    container.appendChild(createEventListItem(event));
  });
}

/* ===============================
   FILTERING LOGIC
================================ */
const eventsContainer = document.querySelector('.events');

function matchesFilter(event, filterId) {
  switch (filterId) {
    // Education
    case 'filter-education-schools': return event.education.schools;
    case 'filter-education-summer-programs': return event.education.summerPrograms;
    case 'filter-education-tutoring': return event.education.tutoring;

    // Age
    case 'filter-age-65-plus': return event.age.seniors;
    case 'filter-age-18-65': return event.age.adults;
    case 'filter-age-12-18': return event.age.teens;
    case 'filter-age-youth': return event.age.youth;
    case 'filter-age-babies': return event.age.babies;

    // Recreation
    case 'filter-recreation-sports': return event.recreation.sports;
    case 'filter-recreation-visual-arts': return event.recreation.visualArt;
    case 'filter-recreation-stem': return event.recreation.stem;
    case 'filter-recreation-music': return event.recreation.music;

    // Hotlines
    case 'filter-hotlines-aa': return event.hotlines.alcoholicsAnonymous;
    case 'filter-hotlines-suicide': return event.hotlines.suicideHelpline;
    case 'filter-hotlines-lgbtq': return event.hotlines.lgbtq;
    case 'filter-hotlines-gambling': return event.hotlines.gamblingAddiction;

    // Local Businesses
    case 'filter-local-coffee-shops': return event.localBusinesses.coffeeShops;
    case 'filter-local-restaurants': return event.localBusinesses.restaurants;
    case 'filter-local-arts-crafts': return event.localBusinesses.artsAndCrafts;
    case 'filter-local-hair-salons': return event.localBusinesses.hairSalons;

    default:
      return false;
  }
}

function filterEvents(query) {
  const lowerQuery = query.toLowerCase();
  return events.filter(event => {
    const eventData = `
      ${event.title}
      ${event.description}
      ${event.category}
      ${event.location}
      ${event.type || ''}
    `.toLowerCase();
    if (!eventData.includes(lowerQuery)) return false;

    // 2. Match all active filters
    for (let filterId of activeFilters) {
      if (!matchesFilter(event, filterId)) return false;
    }

    return true;
  });
}

function renderFilteredEvents(query) {
  const filtered = filterEvents(query, events);

  const noEvents = document.querySelector('.no-events');
  eventsContainer.innerHTML = '';
  if (filtered.length === 0) {
    noEvents.innerHTML = `
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
    <p class="no-events-subtitle">We couldn't find any resources matching your search.</p>
    <p class="no-events-cta-text">Think we should add something?</p>
    <a href="/pages/contact/contact.html" class="no-events-link">Let us know →</a>
  </div>`;
    return;
  } else {
    noEvents.innerHTML = '';
  }
  filtered.forEach(event => {
    eventsContainer.appendChild(createEventListItem(event));
  });
}

function applyFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  // Apply search query
  const searchQuery = params.get('q') || '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = searchQuery;
  }

  // Apply filters
  const filtersParam = params.get('filters');
  if (filtersParam) {
    const filtersArray = filtersParam.split(',');
    filtersArray.forEach(id => {
      const filterBtn = document.getElementById(id);
      if (filterBtn && !activeFilters.has(id)) {
        activeFilters.add(id);
        filterBtn.classList.add('active');
        addAppliedFilter(id, filterBtn.textContent);
      }
    });
  }

  // Render filtered events based on search and filters
  renderFilteredEvents(searchQuery);
}


async function init() {
  await injectComponents();
  renderEventList(events);

  const searchInput = document.getElementById('search-input');

  searchInput.addEventListener('input', () => {
      renderFilteredEvents(searchInput.value, events);
      updateURL();
  });

  applyFiltersFromURL(events);
}

init();
