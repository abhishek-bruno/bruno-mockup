/**
 * Bruno UI - Sidebar Logic
 * Handles sidebar resize, collapse, and tab switching
 */

(function() {
    'use strict';

    const sidebar = document.getElementById('sidebar');
    const sidebarResizer = document.getElementById('sidebarResizer');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebarExpandBtn = document.getElementById('sidebarExpandBtn');
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const collectionsView = document.getElementById('collectionsView');
    const historyView = document.getElementById('historyView');
    const sidebarSearchInput = document.getElementById('sidebarSearchInput');
    let isSidebarDragging = false;
    let sidebarWidth = 240; // Default width in pixels
    const MIN_SIDEBAR_WIDTH = 150;
    const MAX_SIDEBAR_WIDTH = 600;
    const COLLAPSED_SIDEBAR_WIDTH = 0;

    // Sidebar Tab Switching (Collections/History)
    if (sidebarTabs.length > 0 && collectionsView && historyView) {
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.getAttribute('data-view');
                
                // Update active tab
                sidebarTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show/hide views
                if (view === 'collections') {
                    collectionsView.style.display = 'block';
                    historyView.style.display = 'none';
                    if (sidebarSearchInput) {
                        sidebarSearchInput.placeholder = 'Search requests ...';
                    }
                } else if (view === 'history') {
                    collectionsView.style.display = 'none';
                    historyView.style.display = 'block';
                    if (sidebarSearchInput) {
                        sidebarSearchInput.placeholder = 'Search history ...';
                    }
                }
            });
        });
    }

    // Sidebar Resize and Collapse Logic
    if (sidebar && sidebarResizer) {
        // Set initial width
        sidebar.style.width = `${sidebarWidth}px`;

        // Resize on drag
        sidebarResizer.addEventListener('mousedown', (e) => {
            isSidebarDragging = true;
            sidebarResizer.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isSidebarDragging) return;

            const mainLayout = document.querySelector('.main-layout');
            if (!mainLayout) return;

            const mainLayoutRect = mainLayout.getBoundingClientRect();
            const newWidth = e.clientX - mainLayoutRect.left;

            if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
                sidebarWidth = newWidth;
                sidebar.style.width = `${newWidth}px`;
                sidebar.classList.remove('collapsed');
                if (sidebarExpandBtn) {
                    sidebarExpandBtn.style.display = 'none';
                }
            } else if (newWidth < MIN_SIDEBAR_WIDTH) {
                // Collapse if dragged too far left
                collapseSidebar();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isSidebarDragging) {
                isSidebarDragging = false;
                sidebarResizer.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    function collapseSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('collapsed');
        sidebar.style.width = `${COLLAPSED_SIDEBAR_WIDTH}px`;
        if (sidebarExpandBtn) {
            sidebarExpandBtn.style.display = 'block';
        }
        if (sidebarCollapseBtn) {
            sidebarCollapseBtn.innerHTML = '<i class="ti ti-chevron-right"></i>';
            sidebarCollapseBtn.title = 'Expand Sidebar';
        }
    }

    function expandSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('collapsed');
        sidebar.style.width = `${sidebarWidth || 240}px`;
        if (sidebarExpandBtn) {
            sidebarExpandBtn.style.display = 'none';
        }
        if (sidebarCollapseBtn) {
            sidebarCollapseBtn.innerHTML = '<i class="ti ti-chevron-left"></i>';
            sidebarCollapseBtn.title = 'Collapse Sidebar';
        }
    }

    // Collapse button handler - toggle collapse/expand
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                expandSidebar();
            } else {
                collapseSidebar();
            }
        });
    }

    // Expand button handler
    if (sidebarExpandBtn) {
        sidebarExpandBtn.addEventListener('click', () => {
            expandSidebar();
        });
    }

    // Export functions for use by other modules
    window.sidebarModule = {
        collapseSidebar,
        expandSidebar
    };

})();

