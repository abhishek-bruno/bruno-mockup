/**
 * Bruno UI - Format Dropdown Logic
 * Handles format selection and preview mode toggle
 */

(function() {
    'use strict';

    const formatDropdownBtn = document.getElementById('formatDropdownBtn');
    const formatDropdownMenu = document.getElementById('formatDropdownMenu');
    const formatDropdownText = document.getElementById('formatDropdownText');
    const formatPreviewToggle = document.getElementById('formatPreviewToggle');
    const responseContent = document.getElementById('responseContent');
    let currentFormat = 'xml';
    let isPreviewMode = false;

    // Format name mapping for display
    const formatNames = {
        'json': 'JSON',
        'xml': 'XML',
        'javascript': 'Javascript',
        'html': 'HTML',
        'raw': 'Raw',
        'hex': 'Hex',
        'base64': 'Base64'
    };

    function updateFormatDisplay() {
        if (formatDropdownText) {
            const formatName = formatNames[currentFormat] || currentFormat.toUpperCase();
            if (isPreviewMode) {
                formatDropdownText.innerHTML = `${formatName} <span><i class="ti ti-eye"></i></span>`;
            } else {
                formatDropdownText.textContent = formatName;
            }
        }
        
        if (responseContent) {
            if (isPreviewMode) {
                responseContent.classList.remove('code-mode');
                responseContent.classList.add('preview-mode');
            } else {
                responseContent.classList.remove('preview-mode');
                responseContent.classList.add('code-mode');
            }
        }

        // Update preview toggle state
        if (formatPreviewToggle) {
            if (isPreviewMode) {
                formatPreviewToggle.classList.add('active');
            } else {
                formatPreviewToggle.classList.remove('active');
            }
        }

        // Update active format in dropdown
        if (formatDropdownMenu) {
            const formatItems = formatDropdownMenu.querySelectorAll('.format-item');
            formatItems.forEach(item => {
                const itemFormat = item.getAttribute('data-format');
                if (itemFormat === currentFormat) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    // Format dropdown toggle
    if (formatDropdownBtn && formatDropdownMenu) {
        formatDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = formatDropdownMenu.classList.toggle('show');
            formatDropdownBtn.classList.toggle('active', isOpen);
            
            // Close other dropdowns if open
            const tabsDropdownMenu = document.getElementById('tabsDropdownMenu');
            const controlsDropdownMenu = document.getElementById('controlsDropdownMenu');
            if (tabsDropdownMenu) {
                tabsDropdownMenu.classList.remove('show');
                const tabsDropdownBtn = document.getElementById('tabsDropdownBtn');
                if (tabsDropdownBtn) tabsDropdownBtn.classList.remove('active');
            }
            if (controlsDropdownMenu) {
                controlsDropdownMenu.classList.remove('show');
                const controlsDropdownBtn = document.getElementById('controlsDropdownBtn');
                if (controlsDropdownBtn) controlsDropdownBtn.classList.remove('active');
            }
        });

        // Format selection from dropdown
        const formatItems = formatDropdownMenu.querySelectorAll('.format-item');
        formatItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const format = item.getAttribute('data-format');
                if (format) {
                    currentFormat = format;
                    updateFormatDisplay();
                }
                // Don't close dropdown - allow toggling preview
            });
        });

        // Preview toggle in header
        if (formatPreviewToggle) {
            formatPreviewToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                isPreviewMode = !isPreviewMode;
                updateFormatDisplay();
            });
        }
    }

    // Initialize format display
    updateFormatDisplay();

    // Export for use by other modules
    window.formatModule = {
        updateFormatDisplay,
        getCurrentFormat: () => currentFormat,
        getPreviewMode: () => isPreviewMode
    };

})();

