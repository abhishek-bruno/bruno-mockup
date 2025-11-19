/* ============================================
   Bruno UI - Theme Toggle Script
   ============================================ */

(function() {
    'use strict';

    const THEME_STORAGE_KEY = 'bruno-theme';
    const THEME_ATTRIBUTE = 'data-theme';
    
    // Get theme from localStorage or default to 'dark'
    function getStoredTheme() {
        return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    }

    // Save theme to localStorage
    function saveTheme(theme) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    // Apply theme to document root
    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'light') {
            root.setAttribute(THEME_ATTRIBUTE, 'light');
        } else {
            root.removeAttribute(THEME_ATTRIBUTE);
        }
    }

    // Update theme icon
    function updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'ti ti-moon';
            } else {
                themeIcon.className = 'ti ti-sun';
            }
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        saveTheme(newTheme);
        updateThemeIcon(newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const theme = getStoredTheme();
        applyTheme(theme);
        updateThemeIcon(theme);
    }

    // Set up event listener for theme toggle button
    function setupThemeToggle() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            setupThemeToggle();
        });
    } else {
        initTheme();
        setupThemeToggle();
    }
})();

