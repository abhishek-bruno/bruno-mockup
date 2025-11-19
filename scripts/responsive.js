/**
 * Bruno UI - Responsive Tabs Logic
 * Handles responsive behavior for request and response tabs
 */

(function() {
    'use strict';

    const requestTabsPanel = document.getElementById('requestTabsPanel');
    const responseBar = document.getElementById('responseBar');
    const requestPanel = document.getElementById('requestPanel');
    const responsePanel = document.getElementById('responsePanel');
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
        if (window.updateResponseDropdowns) {
            window.updateResponseDropdowns();
        }
        
        // Update request tabs "More" dropdown after a brief delay to allow CSS to apply
        setTimeout(() => {
            updateRequestTabsMoreDropdown();
        }, 0);
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
            if (window.updateResponseDropdowns) {
                window.updateResponseDropdowns();
            }
            // Sync active tab state in dropdown
            const activeTab = document.querySelector('.response-tab.active');
            const tabsDropdownMenu = document.getElementById('tabsDropdownMenu');
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

    // Export functions for use by other modules
    window.updateResponsiveClasses = updateResponsiveClasses;
    window.throttledUpdateResponsiveClasses = throttledUpdateResponsiveClasses;
    window.updateRequestTabsMoreDropdown = updateRequestTabsMoreDropdown;

})();

