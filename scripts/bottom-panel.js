/**
 * Bruno UI - Bottom Panel Logic
 * Handles bottom panel resize functionality
 */

(function() {
    'use strict';

    const bottomPanelContainer = document.getElementById('bottomPanelContainer');
    const bottomPanelResizer = document.getElementById('bottomPanelResizer');
    const contentArea = document.querySelector('.content-area');
    const splitContainer = document.querySelector('.split-container');
    let isBottomDragging = false;
    let bottomPanelHeight = 36; // Default height in pixels (4px resizer + 32px panel)
    const MIN_PANEL_HEIGHT = 36; // Minimum height to keep buttons visible (4px resizer + 32px panel)

    function updateSplitContainerPadding() {
        if (splitContainer && bottomPanelContainer) {
            splitContainer.style.paddingBottom = `${bottomPanelHeight}px`;
        }
    }

    if (bottomPanelContainer && bottomPanelResizer && contentArea) {
        // Set initial height
        bottomPanelContainer.style.height = `${bottomPanelHeight}px`;
        updateSplitContainerPadding();

        // Resize on drag
        bottomPanelResizer.addEventListener('mousedown', (e) => {
            isBottomDragging = true;
            bottomPanelResizer.classList.add('dragging');
            document.body.style.cursor = 'row-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isBottomDragging) return;

            const contentAreaRect = contentArea.getBoundingClientRect();
            const newHeight = contentAreaRect.bottom - e.clientY;

            // Set min/max heights - minimum keeps buttons visible
            const minHeight = MIN_PANEL_HEIGHT; // Keep buttons visible
            const maxHeight = contentAreaRect.height * 0.7; // Max 70% of content area height

            if (newHeight >= minHeight && newHeight <= maxHeight) {
                bottomPanelHeight = newHeight;
                bottomPanelContainer.style.height = `${newHeight}px`;
                bottomPanelContainer.classList.remove('minimized');
                updateSplitContainerPadding();
            } else if (newHeight < minHeight) {
                // Prevent collapsing below minimum - keep at minimum height
                bottomPanelHeight = minHeight;
                bottomPanelContainer.style.height = `${minHeight}px`;
                bottomPanelContainer.classList.remove('minimized');
                updateSplitContainerPadding();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isBottomDragging) {
                isBottomDragging = false;
                bottomPanelResizer.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    // Export functions for use by other modules
    window.bottomPanelModule = {
        updateSplitContainerPadding
    };

})();

