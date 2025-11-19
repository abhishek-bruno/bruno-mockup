/**
 * Bruno UI - Draggable Divider Logic
 * Handles resizing between request and response panels
 */

(function() {
    'use strict';

    const divider = document.getElementById('divider');
    const requestPanel = document.getElementById('requestPanel');
    const responsePanel = document.getElementById('responsePanel');
    let isDragging = false;
    const MIN_PANEL_WIDTH = 300;
    const MINIMIZED_PANEL_WIDTH = 40;
    let savedRequestWidth = null;
    let savedResponseWidth = null;

    function minimizeRequestPanel() {
        if (!requestPanel || !responsePanel) return;
        // Save current width before minimizing
        if (!requestPanel.classList.contains('minimized')) {
            savedRequestWidth = requestPanel.offsetWidth;
        }
        requestPanel.classList.add('minimized');
        requestPanel.style.flex = `0 0 ${MINIMIZED_PANEL_WIDTH}px`;
        // Make response panel take remaining space
        responsePanel.style.flex = `1`;
        responsePanel.classList.remove('minimized');
        if (divider) divider.style.display = 'none';
        if (window.updateResponsiveClasses) {
            window.updateResponsiveClasses();
        }
    }

    function minimizeResponsePanel() {
        if (!requestPanel || !responsePanel) return;
        // Save current width before minimizing
        if (!responsePanel.classList.contains('minimized')) {
            savedResponseWidth = responsePanel.offsetWidth;
        }
        responsePanel.classList.add('minimized');
        responsePanel.style.flex = `0 0 ${MINIMIZED_PANEL_WIDTH}px`;
        // Make request panel take remaining space
        requestPanel.style.flex = `1`;
        requestPanel.classList.remove('minimized');
        if (divider) divider.style.display = 'none';
        if (window.updateResponsiveClasses) {
            window.updateResponsiveClasses();
        }
    }

    function restoreRequestPanel() {
        if (!requestPanel || !responsePanel) return;
        const container = document.querySelector('.split-container');
        if (!container) return;
        
        requestPanel.classList.remove('minimized');
        responsePanel.classList.remove('minimized');
        
        // Calculate half width of container, accounting for divider width (6px)
        const containerWidth = container.offsetWidth;
        const dividerWidth = divider ? 6 : 0;
        const availableWidth = containerWidth - dividerWidth;
        const halfWidth = availableWidth / 2;
        
        // Set both panels to half width
        requestPanel.style.flex = `0 0 ${halfWidth}px`;
        responsePanel.style.flex = `0 0 ${halfWidth}px`;
        
        if (divider) divider.style.display = '';
        if (window.updateResponsiveClasses) {
            window.updateResponsiveClasses();
        }
    }

    function restoreResponsePanel() {
        if (!requestPanel || !responsePanel) return;
        const container = document.querySelector('.split-container');
        if (!container) return;
        
        requestPanel.classList.remove('minimized');
        responsePanel.classList.remove('minimized');
        
        // Calculate half width of container, accounting for divider width (6px)
        const containerWidth = container.offsetWidth;
        const dividerWidth = divider ? 6 : 0;
        const availableWidth = containerWidth - dividerWidth;
        const halfWidth = availableWidth / 2;
        
        // Set both panels to half width
        requestPanel.style.flex = `0 0 ${halfWidth}px`;
        responsePanel.style.flex = `0 0 ${halfWidth}px`;
        
        if (divider) divider.style.display = '';
        if (window.updateResponsiveClasses) {
            window.updateResponsiveClasses();
        }
    }

    if (divider && requestPanel && responsePanel) {
        divider.addEventListener('mousedown', (e) => {
            isDragging = true;
            divider.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const container = document.querySelector('.split-container');
            const containerRect = container.getBoundingClientRect();
            const newWidth = e.clientX - containerRect.left;
            const containerWidth = containerRect.width;

            // Check if request panel should be minimized (dragged too far left)
            if (newWidth <= MIN_PANEL_WIDTH) {
                minimizeRequestPanel();
                return;
            }

            // Check if response panel should be minimized (dragged too far right)
            if (newWidth >= containerWidth - MIN_PANEL_WIDTH) {
                minimizeResponsePanel();
                return;
            }

            // Normal resize
            requestPanel.classList.remove('minimized');
            responsePanel.classList.remove('minimized');
            requestPanel.style.flex = `0 0 ${newWidth}px`;
            responsePanel.style.flex = `1`;
            if (divider) divider.style.display = '';
            
            // Save width for potential restore
            savedRequestWidth = newWidth;
            
            // Update responsive classes with throttling for smooth updates
            if (window.throttledUpdateResponsiveClasses) {
                window.throttledUpdateResponsiveClasses();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                divider.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                // Final update after resize completes
                setTimeout(() => {
                    if (window.updateResponsiveClasses) {
                        window.updateResponsiveClasses();
                    }
                }, 0);
            }
        });

        // Click handlers to restore minimized panels
        requestPanel.addEventListener('click', (e) => {
            if (requestPanel.classList.contains('minimized')) {
                // When minimized, all children are hidden, so any click on the panel should restore it
                restoreRequestPanel();
                e.stopPropagation();
            }
        });

        responsePanel.addEventListener('click', (e) => {
            if (responsePanel.classList.contains('minimized')) {
                // When minimized, all children are hidden, so any click on the panel should restore it
                restoreResponsePanel();
                e.stopPropagation();
            }
        });
    }

    // Export functions for use by other modules
    window.dividerModule = {
        minimizeRequestPanel,
        minimizeResponsePanel,
        restoreRequestPanel,
        restoreResponsePanel
    };

})();

