/* ŠK Dolní Bojanovice — small, purposeful interactions */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav.nav');
  const header = document.querySelector('.site-header');

  // Mobile navigation: generated so the existing HTML structure stays intact.
  if (nav && header) {
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Otevřít navigaci');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    header.querySelector('.header-inner')?.appendChild(toggle);

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Otevřít navigaci');
      document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Zavřít navigaci' : 'Otevřít navigaci');
      document.body.classList.toggle('menu-open', open);
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Mark the current section in the navigation.
  // Clear any static state first so the homepage cannot show two active items.
  if (nav) {
    const current = location.pathname.split('/').pop() || 'index.html';
    const links = nav.querySelectorAll('a[href]');

    links.forEach(link => {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    });

    links.forEach(link => {
      const href = link.getAttribute('href').split('/').pop().split('#')[0];
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // Existing article images open in a focused lightbox. No markup changes required.
  const articleImages = document.querySelectorAll('.post-body img, .stepan-photo img, .season-photo img, .map-preview img');
  if (articleImages.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<button class="lightbox-close" type="button" aria-label="Zavřít obrázek">×</button><img alt=""><div class="lightbox-caption"></div>';
    document.body.appendChild(overlay);

    const lightboxImage = overlay.querySelector('img');
    const caption = overlay.querySelector('.lightbox-caption');
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    articleImages.forEach(image => {
      image.addEventListener('click', () => {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || '';
        caption.textContent = image.alt || '';
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
      });
    });

    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target === close || event.target.closest('.lightbox-close')) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
  }
});
