// Theme Toggle Functionality
const darkBtn = document.getElementById('darkBtn');
const lightBtn = document.getElementById('lightBtn');
const html = document.documentElement;

// Helper to apply theme and sync toggle button states
function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (theme === 'light') {
        darkBtn.classList.remove('active');
        lightBtn.classList.add('active');
    } else {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
    }
}

// Determine default theme by screen size if user has no saved preference
const savedTheme = localStorage.getItem('theme');
const userHasPreference = !!savedTheme;
const smallScreenQuery = window.matchMedia('(max-width: 768px)');
const defaultTheme = smallScreenQuery.matches ? 'light' : 'dark';
applyTheme(savedTheme || defaultTheme);

// If no user preference, adapt on screen size changes; once user sets, we stop adapting
smallScreenQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'light' : 'dark');
    }
});

// Dark mode button click handler
darkBtn.addEventListener('click', () => {
    applyTheme('dark');
    localStorage.setItem('theme', 'dark');
});

// Light mode button click handler
lightBtn.addEventListener('click', () => {
    applyTheme('light');
    localStorage.setItem('theme', 'light');
});

// Spotlight Effect
const spotlight = document.getElementById('spotlight');
let isMouseMoving = false;
let mouseTimeout;

document.addEventListener('mousemove', (e) => {
    // Update spotlight position
    spotlight.style.setProperty('--x', e.clientX + 'px');
    spotlight.style.setProperty('--y', e.clientY + 'px');
    
    // Show spotlight
    if (!isMouseMoving) {
        spotlight.classList.add('active');
        isMouseMoving = true;
    }

    // Hide spotlight after mouse stops moving
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        spotlight.classList.remove('active');
        isMouseMoving = false;
    }, 100);
});

// Navigation Active State (Intersection Observer)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            // Update active state for navigation links
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => observer.observe(section));

// Smooth Scroll for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Card Hover Effects
const cards = document.querySelectorAll(
    '.experience-item, .project-item, .blog-item, .education-item, .contact-item, .calendly-card'
);

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Projects: show top 3 with View more toggle
(function initProjectsToggle() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const projectItems = projectsSection.querySelectorAll('.project-item');
    const viewMoreBtn = document.getElementById('projectsViewMore');

    if (projectItems.length <= 3) {
        if (viewMoreBtn) viewMoreBtn.style.display = 'none';
        return;
    }

    // Hide all except first 3
    projectItems.forEach((item, index) => {
        if (index > 2) item.classList.add('hidden');
    });

    if (!viewMoreBtn) return;

    viewMoreBtn.addEventListener('click', () => {
        const isExpanded = viewMoreBtn.getAttribute('aria-expanded') === 'true';
        const newExpanded = !isExpanded;
        viewMoreBtn.setAttribute('aria-expanded', String(newExpanded));
        viewMoreBtn.textContent = newExpanded ? 'View less' : 'View more';

        projectItems.forEach((item, index) => {
            if (index > 2) {
                if (newExpanded) item.classList.remove('hidden');
                else item.classList.add('hidden');
            }
        });
    });
})();
