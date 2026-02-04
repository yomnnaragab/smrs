/**
 * Tab System for SMRs Website
 * Handles tab switching, URL hash updates, and active states
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    
    // Add click event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Handle initial load from Hash
    const hash = window.location.hash.substring(1);
    
    // Check for query parameters (?tab=xxx)
    const urlParams = new URLSearchParams(window.location.search);
    const queryTab = urlParams.get('tab');

    if (queryTab) {
        switchTab(queryTab, false);
    } else if (hash) {
        // Check if hash corresponds to a tab
        const targetTab = document.querySelector(`[data-tab="${hash}"]`);
        if (targetTab) {
            switchTab(hash, false);
        } else {
            showFirstTab();
        }
    } else {
        showFirstTab();
    }

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash) {
            const targetTab = document.querySelector(`[data-tab="${newHash}"]`);
            if (targetTab) {
                switchTab(newHash, false);
            }
        }
    });
}

function switchTab(tabId, updateHash = true) {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Update buttons
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    });

    // Update panes
    tabPanes.forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Update URL hash
    if (updateHash) {
        history.pushState(null, null, `#${tabId}`);
    }
}

function showFirstTab() {
    const firstButton = document.querySelector('[data-tab]');
    if (firstButton) {
        const tabId = firstButton.getAttribute('data-tab');
        switchTab(tabId, false); // Don't set hash on initial load unless needed
    }
}