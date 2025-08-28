// Mobile Navigation Functionality
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.body = document.body;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.mobileMenu) return;
        
        // Add click event to hamburger button
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Add click events to mobile navigation links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        this.mobileMenu.addEventListener('click', (e) => {
            if (e.target === this.mobileMenu) {
                this.closeMenu();
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.hamburger.classList.add('active');
        this.mobileMenu.classList.add('active');
        this.mobileMenu.setAttribute('aria-hidden', 'false');
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.body.classList.add('mobile-menu-open');
        this.isMenuOpen = true;
        
        // Focus management for accessibility
        const firstLink = this.mobileMenu.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.body.classList.remove('mobile-menu-open');
        this.isMenuOpen = false;
    }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});