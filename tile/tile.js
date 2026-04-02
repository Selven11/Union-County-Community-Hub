
export function renderTile(data) {
  const tile = document.createElement('div');
  tile.className = 'tile-card';
  tile.style.cursor = 'pointer';
  tile.appendChild(buildImageArea(data));
  tile.appendChild(buildBody(data));
  
  tile.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      return;
    }
    e.preventDefault();
    if (typeof window.openTileModal === 'function') {
      window.openTileModal(data);
    }
  });
  
  return tile;
}


export function renderTiles(container, items) {
  container.innerHTML = '';
  items.forEach(item => container.appendChild(renderTile(item)));
}


function buildImageArea(data) {
  const wrap = document.createElement('div');
  wrap.className = 'tile-img';

  const img = document.createElement('img');
  img.src = data.image || 'images/hero1.jpg';
  img.alt = data.title;
  wrap.appendChild(img);

  return wrap;
}

function buildBody(data) {
  const body = document.createElement('div');
  body.className = 'tile-body';

  const meta = document.createElement('p');
  meta.className = 'tile-meta';
  meta.textContent = `${data.category || 'Event'} · ${data.type || 'Community'}`;
  body.appendChild(meta);

  const title = document.createElement('h3');
  title.className = 'tile-title';
  title.textContent = data.title;
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'tile-desc';
  desc.textContent = data.description;
  body.appendChild(desc);

  body.appendChild(buildFooter(data));
  return body;
}

function buildFooter(data) {
  const footer = document.createElement('div');
  footer.className = 'tile-footer';

  const loc = document.createElement('span');
  loc.className = 'tile-location';
  loc.textContent = data.location ? `📍 ${data.location}` : '';
  footer.appendChild(loc);

  const link = document.createElement('a');
  link.className = 'tile-link';
  link.href = data.link || '#';
  link.textContent = 'Learn More →';
  footer.appendChild(link);

  return footer;
}