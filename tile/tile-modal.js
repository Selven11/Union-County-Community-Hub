// Tile Modal Logic
// Handles opening, closing, and populating the expandable tile modal

/**
 * Open the tile modal and populate it with tile data
 * @param {Object} tileData - The tile data object containing all tile information
 */
function openTileModal(tileData) {
  const overlay = document.getElementById('tile-modal-overlay');
  const image = document.getElementById('tile-modal-image');
  
  if (!overlay) {
    console.error('Tile modal overlay not found in DOM');
    return;
  }

  // Set image
  if (image) {
    image.src = tileData.image || '';
    image.alt = tileData.title || 'Resource image';
  }

  // Populate left section (contact, location, date, time)
  populateModalLeft(tileData);

  // Populate right boxes section (ages and recreation)
  populateBoxes(tileData);

  // Populate main content under the boxes
  populateMainContent(tileData);

  // Show modal with animation
  overlay.style.display = 'flex';
  overlay.classList.remove('closing');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the tile modal
 */
function closeTileModal() {
  const overlay = document.getElementById('tile-modal-overlay');
  if (!overlay) return;

  overlay.classList.add('closing');
  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.classList.remove('closing');
    document.body.style.overflow = '';
  }, 300);
}

function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === 'string') el.textContent = text;
  return el;
}

function appendDetail(container, label, valueNode) {
  const group = createEl('div', 'tile-modal-detail-group');
  const labelEl = createEl('label', 'tile-modal-detail-label', label);
  const valueEl = createEl('div', 'tile-modal-detail-value');
  valueEl.appendChild(valueNode);
  group.appendChild(labelEl);
  group.appendChild(valueEl);
  container.appendChild(group);
}

function createLink(text, href, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  if (options.newTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}

function appendContactRow(container, label, valueNode) {
  const row = createEl('div', 'tile-modal-contact-row');
  const key = createEl('span', 'tile-modal-contact-key', label);
  const value = createEl('span', 'tile-modal-contact-value');
  value.appendChild(valueNode);
  row.appendChild(key);
  row.appendChild(value);
  container.appendChild(row);
}

function collectField(value, fallbackLabel) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  if (value === true && fallbackLabel) return [fallbackLabel];
  return [];
}

/**
 * Populate the left section with details: location, date, time, contact
 * @param {Object} data - Tile data
 */
function populateModalLeft(data) {
  const leftContent = document.getElementById('tile-modal-left-content');
  if (!leftContent) return;
  clearElement(leftContent);

  // Date
  if (data.date) {
    const formattedDate = formatDate(data.date);
    appendDetail(leftContent, 'Date', createEl('span', '', formattedDate));
  }

  // Time
  if (data.time) {
    appendDetail(leftContent, 'Time', createEl('span', '', data.time));
  }

  // Location
  if (data.location) {
    appendDetail(leftContent, 'Location', createEl('span', '', data.location));
  }

  // Contact Info (and Website)
  const contact = data.contact ?? data.contactInfo ?? data.contacts?.primary;
  const phone = data.phone ?? data.contacts?.phone;
  const email = data.email ?? data.contacts?.email;
  const website = data.link ?? data.url ?? data.website ?? data.contacts?.website;

  if (contact || phone || email || website) {
    const wrap = createEl('div', 'tile-modal-contact-list');
    if (contact) {
      appendContactRow(wrap, 'Contact', createContactNode(contact));
    }
    if (phone && phone !== contact) {
      appendContactRow(wrap, 'Phone', createLink(phone, `tel:${phone}`));
    }
    if (email && email !== contact) {
      appendContactRow(wrap, 'Email', createLink(email, `mailto:${email}`));
    }
    if (website) {
      appendContactRow(wrap, 'Website', createLink('Visit Website', website, { newTab: true }));
    }
    appendDetail(leftContent, 'Contact & Web', wrap);
  } else {
    appendDetail(leftContent, 'Contact & Web', createEl('span', '', 'Not provided'));
  }
}

/**
 * Populate the boxes section with age groups and recreation categories
 * @param {Object} data - Tile data
 */
function populateBoxes(data) {
  const boxesContent = document.getElementById('tile-modal-boxes-content');
  if (!boxesContent) return;
  clearElement(boxesContent);

  const boxSection = createEl('div', 'tile-modal-box-section');

  // Age Groups
  const ageGroups = extractAgeGroups(data);
  for (const age of ageGroups) {
    boxSection.appendChild(createEl('span', 'tile-modal-age-badge', age));
  }

  // Recreation categories in boxes
  const recreationItems = extractRecreationItems(data);
  for (const item of recreationItems) {
    boxSection.appendChild(createEl('span', 'tile-modal-age-badge tile-modal-recreation-box', item));
  }

  if (boxSection.children.length > 0) {
    boxesContent.appendChild(boxSection);
  }
}

/**
 * Extract recreation items from data
 * @param {Object} data - Tile data
 * @returns {Array} Array of recreation items
 */
function extractRecreationItems(data) {
  const items = [];
  
  if (data.recreation) {
    items.push(...collectField(data.recreation.sports, 'Sports'));
    items.push(...collectField(data.recreation.visualArt, 'Visual Art'));
    items.push(...collectField(data.recreation.stem, 'STEM'));
    items.push(...collectField(data.recreation.music, 'Music'));
  }

  return items.slice(0, 6); // Limit to 6 items for space
}

/**
 * Populate the right main section with title, description and more info
 * @param {Object} data - Tile data
 */
function populateMainContent(data) {
  const main = document.getElementById('tile-modal-main-content');
  if (!main) return;
  clearElement(main);

  if (data.title) {
    const section = createEl('div', 'tile-modal-section');
    const title = createEl('h2', '', data.title);
    title.style.color = '#d4af37';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '24px';
    section.appendChild(title);

    if (data.category) {
      const category = createEl('p', '', data.category);
      category.style.color = '#b8b8b8';
      category.style.margin = '0';
      category.style.fontSize = '12px';
      category.style.textTransform = 'uppercase';
      category.style.letterSpacing = '1px';
      section.appendChild(category);
    }

    main.appendChild(section);
  }

  if (data.description) {
    const section = createEl('div', 'tile-modal-section');
    const heading = createEl('h3', 'tile-modal-section-title', 'Description');
    const desc = createEl('div', 'tile-modal-description', data.description);
    section.appendChild(heading);
    section.appendChild(desc);
    main.appendChild(section);
  }

  if (data.link || data.url) {
    const section = createEl('div', 'tile-modal-section');
    const btn = createLink('Learn More →', data.link || data.url, { newTab: true });
    btn.className = 'tile-modal-cta-button';
    section.appendChild(btn);
    main.appendChild(section);
  }
}

/**
 * Extract and format age groups from data
 * @param {Object} data - Tile data
 * @returns {Array} Array of applicable age group labels
 */
function extractAgeGroups(data) {
  const ageGroups = [];
  
  if (data.age) {
    if (data.age.babies) ageGroups.push('Babies');
    if (data.age.youth) ageGroups.push('Youth');
    if (data.age.teens) ageGroups.push('Teens');
    if (data.age.adults) ageGroups.push('Adults');
    if (data.age.seniors) ageGroups.push('Seniors');
  }

  return ageGroups;
}

/**
 * Extract nested categories from data
 * @param {Object} data - Tile data
 * @returns {Array} Array of category items with names and sub-items
 */
function extractCategories(data) {
  const categories = [];

  // Education categories
  if (data.education && Object.keys(data.education).length > 0) {
    const items = [];
    items.push(...collectField(data.education.schools, 'Schools'));
    items.push(...collectField(data.education.summerPrograms, 'Summer Programs'));
    items.push(...collectField(data.education.tutoring, 'Tutoring'));
    
    if (items.length > 0) {
      categories.push({ name: 'Education', items });
    }
  }

  // Recreation categories
  if (data.recreation && Object.keys(data.recreation).length > 0) {
    const items = [];
    items.push(...collectField(data.recreation.sports, 'Sports'));
    items.push(...collectField(data.recreation.visualArt, 'Visual Art'));
    items.push(...collectField(data.recreation.stem, 'STEM'));
    items.push(...collectField(data.recreation.music, 'Music'));
    
    if (items.length > 0) {
      categories.push({ name: 'Recreation', items });
    }
  }

  // Hotlines categories
  if (data.hotlines && Object.keys(data.hotlines).length > 0) {
    const items = [];
    items.push(...collectField(data.hotlines.alcoholicsAnonymous, 'Alcoholics Anonymous'));
    items.push(...collectField(data.hotlines.suicideHelpline, 'Suicide Helpline'));
    items.push(...collectField(data.hotlines.lgbtq, 'LGBTQ Support'));
    items.push(...collectField(data.hotlines.gamblingAddiction, 'Gambling Addiction Support'));
    
    if (items.length > 0) {
      categories.push({ name: 'Hotlines & Support', items });
    }
  }

  // Local Businesses categories
  if (data.localBusinesses && Object.keys(data.localBusinesses).length > 0) {
    const items = [];
    items.push(...collectField(data.localBusinesses.coffeeShops, 'Coffee Shops'));
    items.push(...collectField(data.localBusinesses.restaurants, 'Restaurants'));
    items.push(...collectField(data.localBusinesses.artsAndCrafts, 'Arts & Crafts'));
    items.push(...collectField(data.localBusinesses.hairSalons, 'Hair Salons'));
    
    if (items.length > 0) {
      categories.push({ name: 'Local Businesses', items });
    }
  }

  return categories;
}

/**
 * Create contact node (phone/email/url/plain)
 * @param {String} contact - Contact information
 * @returns {Node} Contact node
 */
function createContactNode(contact) {
  if (!contact) return createEl('span', '', '');

  if (contact.match(/^[\d\-\(\)\+\s]+$/)) {
    return createLink(contact, `tel:${contact}`);
  }

  if (contact.includes('@')) {
    return createLink(contact, `mailto:${contact}`);
  }

  if (contact.startsWith('http://') || contact.startsWith('https://') || contact.startsWith('www.')) {
    const url = contact.startsWith('http') ? contact : 'https://' + contact;
    return createLink(contact, url, { newTab: true });
  }

  return createEl('span', '', contact);
}

/**
 * Format date string to readable format
 * @param {String} dateStr - Date string (YYYY-MM-DD format)
 * @returns {String} Formatted date string
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Initialize modal event listeners
 */
function initializeTileModalListeners() {
  if (window.__tileModalBound) return;
  window.__tileModalBound = true;

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === 'tile-modal-close') {
      closeTileModal();
      return;
    }

    if (target.id === 'tile-modal-overlay') {
      closeTileModal();
    }
  });

  document.addEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  const overlay = document.getElementById('tile-modal-overlay');
  if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
    closeTileModal();
  }
}

window.openTileModal = openTileModal;
window.closeTileModal = closeTileModal;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTileModalListeners);
} else {
  // DOM already loaded
  initializeTileModalListeners();
}
