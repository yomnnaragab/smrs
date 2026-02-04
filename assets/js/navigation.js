/**
 * Navigation utilities for SMRs Website
 */

// Smooth scroll to anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's not a tab link (tabs have their own handler)
            if (!this.hasAttribute('data-tab')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
});

// Add active state to current page in navigation
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('nav a, .nav-btn');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === filename || href.endsWith('/' + filename))) {
            link.classList.add('active-page');
        }
    });
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightCurrentPage);
} else {
    highlightCurrentPage();
}