// StudyHub landing page interactions.

const yearSpan = document.querySelector('.year');
const navbar = document.getElementById('site-navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('primary-navigation');
const backToTopButton = document.querySelector('.back-to-top');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');

// Fill in the current year in the footer.
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studyhub-theme', theme);

    if (themeToggle) {
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.querySelector('.theme-toggle__icon').textContent = isDark ? '🌙' : '☀️';
        themeToggle.querySelector('.theme-toggle__label').textContent = isDark ? 'Dark' : 'Light';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

const preferredTheme = localStorage.getItem('studyhub-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(preferredTheme || (systemPrefersDark ? 'dark' : 'light'));

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

// Smooth scrolling for all internal navigation links.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        const targetElement = targetId ? document.querySelector(targetId) : null;

        if (!targetElement) {
            return;
        }

        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close the mobile menu after a link is chosen.
        if (navMenu && navMenu.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });
});

function openMobileMenu() {
    if (!navToggle || !navMenu) {
        return;
    }

    navToggle.classList.add('is-open');
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    if (!navToggle || !navMenu) {
        return;
    }

    navToggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const menuIsOpen = navMenu && navMenu.classList.contains('is-open');

        if (menuIsOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Close the menu if the viewport becomes large again.
window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
        closeMobileMenu();
    }
});

// Add a stronger shadow to the navbar after the user scrolls.
function updateNavbarState() {
    if (!navbar || !backToTopButton) {
        return;
    }

    const hasScrolled = window.scrollY > 20;
    navbar.classList.toggle('is-scrolled', hasScrolled);
    backToTopButton.classList.toggle('is-visible', window.scrollY > 500);
}

window.addEventListener('scroll', updateNavbarState, { passive: true });
updateNavbarState();

// Reveal sections with a simple fade-in animation as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.18,
    rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach((element) => revealObserver.observe(element));

// Animate the statistic counters once the stats section becomes visible.
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.45
});

function animateCounter(element) {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '+';
    const duration = 1600;
    const startTime = performance.now();

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = `${value.toLocaleString()}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(step);
            return;
        }

        element.textContent = `${target.toLocaleString()}${suffix}`;
    }

    requestAnimationFrame(step);
}

counters.forEach((counter) => counterObserver.observe(counter));

// Scroll back to the top of the page when the floating button is clicked.
if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}