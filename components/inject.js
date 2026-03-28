
export async function injectComponents() {
  await inject('header-placeholder', '/components/header.html', 'header');
  await inject('footer-placeholder', '/components/footer.html', 'footer');
  await inject('tile-modal-placeholder', '/components/tile-modal.html', 'tile-modal');
  await hamburger();
}

async function inject(placeholderId, path, label) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  placeholder.style.display = 'none';

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    placeholder.outerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load ${label}:`, err);
  }
}

async function hamburger() {
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
