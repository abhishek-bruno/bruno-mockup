/**
 * Bruno UI - Main JavaScript
 * Handles interactive functionality for the Bruno mockup
 */

(function() {
    'use strict';

    // ============================================
    // Draggable Divider Logic
    // ============================================
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
        updateResponsiveClasses();
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
        updateResponsiveClasses();
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
        updateResponsiveClasses();
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
        updateResponsiveClasses();
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
            throttledUpdateResponsiveClasses();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                divider.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                // Final update after resize completes
                setTimeout(() => {
                    updateResponsiveClasses();
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

    // ============================================
    // Preview Toggle Logic
    // ============================================
    const previewBtn = document.getElementById('previewBtn');
    const responseContent = document.getElementById('responseContent');
    let isPreviewMode = false;

    if (previewBtn && responseContent) {
        const previewBtnText = previewBtn.querySelector('.preview-btn-text');
        const previewBtnIcon = previewBtn.querySelector('.preview-btn-icon');
        
        previewBtn.addEventListener('click', () => {
            isPreviewMode = !isPreviewMode;
            
            if (isPreviewMode) {
                responseContent.classList.remove('code-mode');
                responseContent.classList.add('preview-mode');
                if (previewBtnText) previewBtnText.textContent = '</> Code';
                if (previewBtnIcon) previewBtnIcon.textContent = '</>';
                previewBtn.style.background = 'none';
                previewBtn.style.borderColor = '#3e3e42';
                previewBtn.style.color = '#d4d4d4';
            } else {
                responseContent.classList.remove('preview-mode');
                responseContent.classList.add('code-mode');
                if (previewBtnText) previewBtnText.textContent = '▶ Preview';
                if (previewBtnIcon) previewBtnIcon.textContent = '▶';
                previewBtn.style.background = 'none';
                previewBtn.style.borderColor = '#3e3e42';
                previewBtn.style.color = '#d4d4d4';
            }
        });
    }

    // ============================================
    // Responsive Tabs Logic
    // ============================================
    const requestTabsPanel = document.getElementById('requestTabsPanel');
    const responseBar = document.getElementById('responseBar');
    let resizeAnimationFrame = null;

    // Function to update the "More" dropdown to only show hidden tabs
    function updateRequestTabsMoreDropdown() {
        const requestMoreTabsMenu = document.getElementById('requestMoreTabsMenu');
        if (!requestMoreTabsMenu || !requestTabsPanel) return;

        const tabItems = requestTabsPanel.querySelectorAll('.request-tab-item');
        const allTabs = Array.from(tabItems);
        
        // Clear existing dropdown items
        requestMoreTabsMenu.innerHTML = '';
        
        // Find tabs that are currently hidden (not visible)
        const hiddenTabs = allTabs.filter(tab => {
            // Check if tab is hidden via CSS (display: none) or not in the layout
            const style = window.getComputedStyle(tab);
            return style.display === 'none' || tab.offsetParent === null;
        });
        
        // Only add hidden tabs to the dropdown
        hiddenTabs.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            const tabText = tab.textContent.trim();
            const isActive = tab.classList.contains('active');
            
            const dropdownItem = document.createElement('div');
            dropdownItem.className = 'dropdown-item' + (isActive ? ' active' : '');
            dropdownItem.setAttribute('data-tab', tabName);
            dropdownItem.textContent = tabText;
            
            // Add click handler
            dropdownItem.addEventListener('click', () => {
                const clickedTabName = dropdownItem.getAttribute('data-tab');
                
                // Query tabs fresh to ensure we have current state
                const currentTabItems = requestTabsPanel.querySelectorAll('.request-tab-item');
                
                // Update active tab in main tabs
                currentTabItems.forEach(t => {
                    t.classList.remove('active');
                    if (t.getAttribute('data-tab') === clickedTabName) {
                        t.classList.add('active');
                    }
                });

                // Update active item in dropdown
                requestMoreTabsMenu.querySelectorAll('.dropdown-item').forEach(ddItem => {
                    ddItem.classList.remove('active');
                });
                dropdownItem.classList.add('active');

                // Close dropdown
                requestMoreTabsMenu.classList.remove('show');
                const requestMoreTabsBtn = document.getElementById('requestMoreTabsBtn');
                if (requestMoreTabsBtn) {
                    requestMoreTabsBtn.classList.remove('active');
                }
                
                // Update dropdown again in case visibility changed
                setTimeout(() => {
                    updateRequestTabsMoreDropdown();
                }, 0);
            });
            
            requestMoreTabsMenu.appendChild(dropdownItem);
        });
    }

    function updateResponsiveClasses() {
        if (!requestPanel || !responsePanel || !requestTabsPanel || !responseBar) {
            return;
        }

        const requestWidth = requestPanel.offsetWidth;
        const responseWidth = responsePanel.offsetWidth;

        // Update request tabs panel with more granular breakpoints
        requestTabsPanel.classList.remove('compact', 'ultra-compact', 'has-overflow');
        
        // Calculate if tabs overflow - measure actual rendered width
        const tabItems = requestTabsPanel.querySelectorAll('.request-tab-item');
        const formatControls = requestTabsPanel.querySelector('.format-controls');
        const moreBtn = requestTabsPanel.querySelector('.more-tabs-btn');
        
        // Get computed styles for accurate measurement
        const computedStyle = window.getComputedStyle(requestTabsPanel);
        const padding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const gap = parseFloat(computedStyle.gap) || 20;
        
        let totalTabsWidth = padding;
        
        // Add format controls width if visible
        if (formatControls && formatControls.offsetParent !== null) {
            totalTabsWidth += formatControls.offsetWidth + gap;
        }
        
        // Add more button width if visible
        if (moreBtn && moreBtn.offsetParent !== null) {
            totalTabsWidth += moreBtn.offsetWidth + gap;
        }
        
        // Add all visible tab widths
        tabItems.forEach(tab => {
            if (tab.offsetParent !== null) {
                totalTabsWidth += tab.offsetWidth + gap;
            }
        });

        const hasOverflow = totalTabsWidth > requestWidth;

        // Apply responsive classes based on width with better breakpoints
        if (requestWidth < 450) {
            requestTabsPanel.classList.add('ultra-compact');
            if (hasOverflow) {
                requestTabsPanel.classList.add('has-overflow');
            }
        } else if (requestWidth < 650) {
            requestTabsPanel.classList.add('compact');
            if (hasOverflow) {
                requestTabsPanel.classList.add('has-overflow');
            }
        } else if (hasOverflow) {
            requestTabsPanel.classList.add('has-overflow');
        }

        // Update response bar
        responseBar.classList.remove('compact', 'ultra-compact');
        if (responseWidth < 500) {
            responseBar.classList.add('ultra-compact');
        } else if (responseWidth < 700) {
            responseBar.classList.add('compact');
        }

        // Update response controls dropdown visibility
        updateResponseDropdowns();
        
        // Update request tabs "More" dropdown after a brief delay to allow CSS to apply
        setTimeout(() => {
            updateRequestTabsMoreDropdown();
        }, 0);
    }

    // ============================================
    // Response Dropdowns Management
    // ============================================
    function updateResponseDropdowns() {
        const responseBar = document.getElementById('responseBar');
        const responseTabs = document.getElementById('responseTabs');
        const responseTabsDropdown = document.getElementById('responseTabsDropdown');
        const responseControlsMain = document.querySelector('.response-controls-main');
        const responseControlsDropdown = document.getElementById('responseControlsDropdown');
        
        if (!responseBar || !responseTabs || !responseTabsDropdown || !responseControlsMain || !responseControlsDropdown) return;

        const responseWidth = responsePanel ? responsePanel.offsetWidth : 0;
        const stats = document.querySelector('.response-stats');
        const controls = document.querySelector('.response-controls');
        const tabsContainer = responseTabs.parentElement;

        // Calculate widths
        const statsWidth = stats ? stats.offsetWidth : 0;
        const padding = 32; // Total horizontal padding
        const gap = 16; // Gap between sections
        
        // First, handle tabs visibility - keep active tab visible, move others to dropdown
        const tabItems = responseTabs.querySelectorAll('.response-tab');
        const activeTab = responseTabs.querySelector('.response-tab.active');
        
        // Show all tabs first to measure their widths
        tabItems.forEach(tab => {
            tab.style.display = '';
        });
        
        // Measure tabs width
        let tabsWidth = 0;
        tabItems.forEach(tab => {
            if (tab.offsetParent !== null) {
                tabsWidth += tab.offsetWidth + 20; // 20px gap between tabs
            }
        });
        
        const tabsDropdownBtn = responseTabsDropdown.querySelector('.tabs-dropdown-btn');
        const tabsDropdownBtnWidth = tabsDropdownBtn ? tabsDropdownBtn.offsetWidth + gap : 0;
        
        // Get all control elements
        const formatSelect = responseControlsMain.querySelector('.format-select');
        const previewBtn = responseControlsMain.querySelector('.preview-btn');
        const controlsDropdownBtn = responseControlsDropdown.querySelector('.controls-dropdown-btn');
        const iconButtons = responseControlsMain.querySelectorAll('.control-icon');
        
        // Calculate widths
        const formatSelectWidth = formatSelect ? formatSelect.offsetWidth : 0;
        const previewBtnWidth = previewBtn ? previewBtn.offsetWidth : 0;
        const controlsDropdownBtnWidth = controlsDropdownBtn ? controlsDropdownBtn.offsetWidth : 0;
        
        // Calculate total width needed for icon buttons
        let iconButtonsWidth = 0;
        iconButtons.forEach(btn => {
            if (btn.offsetParent !== null) {
                iconButtonsWidth += btn.offsetWidth + 8; // 8px gap
            }
        });
        
        // Calculate minimum controls width (format select + preview) - always visible
        const minControlsWidth = formatSelectWidth + previewBtnWidth + (gap * 2);
        
        // First, determine if we should show icons or dropdown
        // We need to estimate this before calculating tab space
        const tabsContainerWidth = tabsContainer ? tabsContainer.offsetWidth : 0;
        const estimatedAvailableWidthForControls = responseWidth - statsWidth - tabsContainerWidth - padding - gap * 2;
        
        // Estimate controls width (use dropdown as default for calculation)
        const estimatedControlsWidth = minControlsWidth + controlsDropdownBtnWidth + gap;
        
        // Calculate available space for tabs (using estimated controls width)
        const availableWidthForTabs = responseWidth - statsWidth - estimatedControlsWidth - padding - gap * 2;
        
        // If tabs overflow, show dropdown and hide non-active tabs
        if (tabsWidth > availableWidthForTabs && responseWidth < 800) {
            // Show dropdown button
            responseTabsDropdown.classList.add('visible');
            
            // Hide non-active tabs, keep active tab visible
            tabItems.forEach(tab => {
                if (tab !== activeTab) {
                    tab.style.display = 'none';
                } else {
                    tab.style.display = '';
                }
            });
            
            // Check if even with just active tab we need dropdown
            const activeTabWidth = activeTab ? activeTab.offsetWidth : 0;
            if (activeTabWidth + tabsDropdownBtnWidth > availableWidthForTabs) {
                // Even active tab doesn't fit, hide it too
                if (activeTab) activeTab.style.display = 'none';
            }
        } else {
            // Show all tabs, hide dropdown
            tabItems.forEach(tab => {
                tab.style.display = '';
            });
            responseTabsDropdown.classList.remove('visible');
            const tabsMenu = document.getElementById('tabsDropdownMenu');
            if (tabsMenu) {
                tabsMenu.classList.remove('show');
            }
        }

        // Handle controls visibility - show icons if space available, else show dropdown
        // Recalculate after tabs visibility is determined
        const actualTabsContainerWidth = tabsContainer ? tabsContainer.offsetWidth : 0;
        const availableWidthForControls = responseWidth - statsWidth - actualTabsContainerWidth - padding - gap * 2;
        
        // Show all icon buttons first to measure
        iconButtons.forEach(btn => {
            btn.style.display = '';
        });
        
        // Recalculate icon buttons width after showing them
        iconButtonsWidth = 0;
        iconButtons.forEach(btn => {
            if (btn.offsetParent !== null) {
                iconButtonsWidth += btn.offsetWidth + 8;
            }
        });
        const totalWidthWithIcons = minControlsWidth + iconButtonsWidth + (gap * 2);
        
        // Decide whether to show icons or dropdown
        if (totalWidthWithIcons <= availableWidthForControls && responseWidth >= 600) {
            // Enough space - show icons, hide dropdown
            iconButtons.forEach(btn => {
                btn.style.display = '';
            });
            responseControlsDropdown.style.display = 'none';
        } else {
            // Not enough space - hide icons, show dropdown
            iconButtons.forEach(btn => {
                btn.style.display = 'none';
            });
            responseControlsDropdown.style.display = 'block';
        }
    }

    // Throttled update for smooth resizing
    function throttledUpdateResponsiveClasses() {
        if (resizeAnimationFrame) {
            cancelAnimationFrame(resizeAnimationFrame);
        }
        resizeAnimationFrame = requestAnimationFrame(() => {
            updateResponsiveClasses();
        });
    }

    // Initial update and window resize handler
    if (requestPanel && responsePanel) {
        updateResponsiveClasses();
        window.addEventListener('resize', throttledUpdateResponsiveClasses);

        // Update on panel resize with throttling
        const resizeObserver = new ResizeObserver(() => {
            throttledUpdateResponsiveClasses();
        });
        
        resizeObserver.observe(requestPanel);
        resizeObserver.observe(responsePanel);
        
        // Initial dropdown update
        setTimeout(() => {
            updateResponseDropdowns();
            // Sync active tab state in dropdown
            const activeTab = document.querySelector('.response-tab.active');
            if (activeTab && tabsDropdownMenu) {
                const tabName = activeTab.getAttribute('data-tab');
                const dropdownItems = tabsDropdownMenu.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-tab') === tabName) {
                        item.classList.add('active');
                    }
                });
            }
            // Initialize request tabs more dropdown
            updateRequestTabsMoreDropdown();
        }, 100);
    }

    // ============================================
    // Sidebar Tab Switching (Collections/History)
    // ============================================
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const collectionsView = document.getElementById('collectionsView');
    const historyView = document.getElementById('historyView');
    const sidebarSearchInput = document.getElementById('sidebarSearchInput');

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

    // ============================================
    // Sidebar Resize and Collapse Logic
    // ============================================
    const sidebar = document.getElementById('sidebar');
    const sidebarResizer = document.getElementById('sidebarResizer');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebarExpandBtn = document.getElementById('sidebarExpandBtn');
    let isSidebarDragging = false;
    let sidebarWidth = 240; // Default width in pixels
    const MIN_SIDEBAR_WIDTH = 150;
    const MAX_SIDEBAR_WIDTH = 600;
    const COLLAPSED_SIDEBAR_WIDTH = 0;

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
            sidebarCollapseBtn.textContent = '▶';
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
            sidebarCollapseBtn.textContent = '◀';
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

    // ============================================
    // Bottom Panel Resize Logic
    // ============================================
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

    // ============================================
    // Dropdown Menu Interactions
    // ============================================
    const tabsDropdownBtn = document.getElementById('tabsDropdownBtn');
    const tabsDropdownMenu = document.getElementById('tabsDropdownMenu');
    const controlsDropdownBtn = document.getElementById('controlsDropdownBtn');
    const controlsDropdownMenu = document.getElementById('controlsDropdownMenu');

    // Tabs dropdown toggle
    if (tabsDropdownBtn && tabsDropdownMenu) {
        tabsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = tabsDropdownMenu.classList.toggle('show');
            tabsDropdownBtn.classList.toggle('active', isOpen);
            
            // Close controls dropdown if open
            if (controlsDropdownMenu) {
                controlsDropdownMenu.classList.remove('show');
                if (controlsDropdownBtn) {
                    controlsDropdownBtn.classList.remove('active');
                }
            }
        });

        // Tab selection from dropdown
        const tabsDropdownItems = tabsDropdownMenu.querySelectorAll('.dropdown-item');
        tabsDropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.getAttribute('data-tab');
                
                // Update active tab in main tabs
                const tabs = document.querySelectorAll('.response-tab');
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.getAttribute('data-tab') === tabName) {
                        tab.classList.add('active');
                        tab.style.display = ''; // Make sure active tab is visible
                    }
                });

                // Update active item in dropdown
                tabsDropdownItems.forEach(ddItem => {
                    ddItem.classList.remove('active');
                });
                item.classList.add('active');

                // Close dropdown
                tabsDropdownMenu.classList.remove('show');
                tabsDropdownBtn.classList.remove('active');

                // Update visibility
                updateResponseDropdowns();
            });
        });
    }

    // Controls dropdown toggle
    if (controlsDropdownBtn && controlsDropdownMenu) {
        controlsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = controlsDropdownMenu.classList.toggle('show');
            controlsDropdownBtn.classList.toggle('active', isOpen);
            
            // Close tabs dropdown if open
            if (tabsDropdownMenu) {
                tabsDropdownMenu.classList.remove('show');
                if (tabsDropdownBtn) {
                    tabsDropdownBtn.classList.remove('active');
                }
            }
        });

        // Control action from dropdown
        const controlItems = controlsDropdownMenu.querySelectorAll('.dropdown-item');
        controlItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                // Handle actions (you can add actual functionality here)
                console.log('Action:', action);
                
                // Close dropdown
                controlsDropdownMenu.classList.remove('show');
                controlsDropdownBtn.classList.remove('active');
            });
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (tabsDropdownMenu && !tabsDropdownMenu.contains(e.target) && !tabsDropdownBtn?.contains(e.target)) {
            tabsDropdownMenu.classList.remove('show');
            if (tabsDropdownBtn) {
                tabsDropdownBtn.classList.remove('active');
            }
        }
        if (controlsDropdownMenu && !controlsDropdownMenu.contains(e.target) && !controlsDropdownBtn?.contains(e.target)) {
            controlsDropdownMenu.classList.remove('show');
            if (controlsDropdownBtn) {
                controlsDropdownBtn.classList.remove('active');
            }
        }
    });

    // Update active tab in dropdown when clicking main tabs
    const responseTabs = document.getElementById('responseTabs');
    if (responseTabs) {
        const mainTabs = responseTabs.querySelectorAll('.response-tab');
        mainTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Update dropdown active state
                if (tabsDropdownMenu) {
                    const dropdownItems = tabsDropdownMenu.querySelectorAll('.dropdown-item');
                    dropdownItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('data-tab') === tabName) {
                            item.classList.add('active');
                        }
                    });
                }
                
                // Update visibility after tab change
                updateResponseDropdowns();
            });
        });
    }

    // ============================================
    // Request Tabs More Dropdown
    // ============================================
    const requestMoreTabsBtn = document.getElementById('requestMoreTabsBtn');
    const requestMoreTabsMenu = document.getElementById('requestMoreTabsMenu');

    if (requestMoreTabsBtn && requestMoreTabsMenu) {
        requestMoreTabsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Update dropdown before showing to ensure it has current hidden tabs
            updateRequestTabsMoreDropdown();
            const isOpen = requestMoreTabsMenu.classList.toggle('show');
            requestMoreTabsBtn.classList.toggle('active', isOpen);
            
            // Close other dropdowns if open
            if (tabsDropdownMenu) {
                tabsDropdownMenu.classList.remove('show');
                if (tabsDropdownBtn) {
                    tabsDropdownBtn.classList.remove('active');
                }
            }
            if (controlsDropdownMenu) {
                controlsDropdownMenu.classList.remove('show');
                if (controlsDropdownBtn) {
                    controlsDropdownBtn.classList.remove('active');
                }
            }
        });
    }

    // Close request tabs dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (requestMoreTabsMenu && !requestMoreTabsMenu.contains(e.target) && !requestMoreTabsBtn?.contains(e.target)) {
            requestMoreTabsMenu.classList.remove('show');
            if (requestMoreTabsBtn) {
                requestMoreTabsBtn.classList.remove('active');
            }
        }
    });

    // Update active tab in request tabs dropdown when clicking main tabs
    const requestTabItems = document.querySelectorAll('.request-tab-item');
    requestTabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update dropdown active state
            if (requestMoreTabsMenu) {
                const dropdownItems = requestMoreTabsMenu.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-tab') === tabName) {
                        item.classList.add('active');
                    }
                });
            }
            
            // Update dropdown contents in case visibility changed
            setTimeout(() => {
                updateRequestTabsMoreDropdown();
            }, 0);
        });
    });

})();

