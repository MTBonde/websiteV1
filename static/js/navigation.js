function loadNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <a href="index.html" class="nav-brand">mtbonde.dev</a>

        <!-- Desktop Navigation -->
        <ul class="nav-menu">
          <li><a href="index.html" class="nav-link" data-page="index.html">Home</a></li>
          <li><a href="projects.html" class="nav-link" data-page="projects.html">Projects</a></li>
          <li><a href="about.html" class="nav-link" data-page="about.html">About</a></li>
          <li><a href="contact.html" class="nav-link" data-page="contact.html">Contact</a></li>
          <li><button class="theme-toggle" aria-label="Toggle theme"><i class="bi bi-moon-fill"></i></button></li>
        </ul>

        <!-- Mobile Navigation -->
        <div class="mobile-nav">
          <button class="theme-toggle mobile-theme-toggle" aria-label="Toggle theme"><i class="bi bi-moon-fill"></i></button>
          <button class="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>

        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu" aria-hidden="true">
          <ul class="mobile-menu-list">
            <li><a href="index.html" class="mobile-nav-link" data-page="index.html">Home</a></li>
            <li><a href="projects.html" class="mobile-nav-link" data-page="projects.html">Projects</a></li>
            <li><a href="about.html" class="mobile-nav-link" data-page="about.html">About</a></li>
            <li><a href="contact.html" class="mobile-nav-link" data-page="contact.html">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  const navContainer = document.getElementById('navigation-placeholder');
  if (navContainer) {
    navContainer.innerHTML = navHTML;

    // Highlight current page
    const allLinks = navContainer.querySelectorAll('[data-page]');
    allLinks.forEach(link => {
      if (link.getAttribute('data-page') === currentPage) {
        link.style.color = 'var(--primary)';
      }
    });

    // Special handling for home page
    if (currentPage === 'index.html' || currentPage === '') {
      const homeLinks = navContainer.querySelectorAll('[href="#home"], [href="index.html"]');
      homeLinks.forEach(link => {
        link.href = '#home';
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', loadNavigation);
