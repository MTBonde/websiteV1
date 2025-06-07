// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            console.log('Using saved theme:', savedTheme);
            return savedTheme;
        }

        // Check system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        
        console.log('System theme detection:', { prefersDark, prefersLight });
        
        if (prefersDark) {
            console.log('System prefers dark mode');
            return 'dark';
        } else if (prefersLight) {
            console.log('System prefers light mode');
            return 'light';
        }

        // Default fallback
        console.log('Using fallback theme: dark');
        return 'dark';
    }

    init() {
        // Apply saved theme on load
        this.applyTheme(this.theme);
        
        // Create theme toggle button
        this.createToggleButton();
        
        // Add event listeners
        this.addEventListeners();
    }

    createToggleButton() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            this.updateToggleIcon(themeToggle);
        }
    }

    addEventListeners() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme(this.theme);
                    const themeToggle = document.querySelector('.theme-toggle');
                    if (themeToggle) {
                        this.updateToggleIcon(themeToggle);
                    }
                }
            });
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            this.updateToggleIcon(themeToggle);
        }
    }

    applyTheme(theme) {
        console.log('Applying theme:', theme);
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            console.log('Set data-theme to light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            console.log('Removed data-theme (dark mode)');
        }
    }

    updateToggleIcon(button) {
        // Update button content based on current theme
        if (this.theme === 'dark') {
            button.innerHTML = '☀️';
            button.setAttribute('aria-label', 'Switch to light mode');
        } else {
            button.innerHTML = '🌙';
            button.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Smooth scroll functionality
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fade in animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.section, .card, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    new ThemeToggle();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Console message
    console.log('Welcome to mtbonde.dev - Portfolio loaded successfully!');
});