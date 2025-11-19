/**
 * Bruno UI - Dropdown Menu Interactions
 * Handles all dropdown menu interactions for response tabs and controls
 */

(function() {
    'use strict';

    const tabsDropdownBtn = document.getElementById('tabsDropdownBtn');
    const tabsDropdownMenu = document.getElementById('tabsDropdownMenu');
    const controlsDropdownBtn = document.getElementById('controlsDropdownBtn');
    const controlsDropdownMenu = document.getElementById('controlsDropdownMenu');
    const requestMoreTabsBtn = document.getElementById('requestMoreTabsBtn');
    const requestMoreTabsMenu = document.getElementById('requestMoreTabsMenu');

    // Response Dropdowns Management
    function updateResponseDropdowns() {
        const responseBar = document.getElementById('responseBar');
        const responseTabs = document.getElementById('responseTabs');
        const responseTabsDropdown = document.getElementById('responseTabsDropdown');
        const responseControlsMain = document.querySelector('.response-controls-main');
        const responseControlsDropdown = document.getElementById('responseControlsDropdown');
        const responsePanel = document.getElementById('responsePanel');
        
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

    // Request Tabs More Dropdown
    if (requestMoreTabsBtn && requestMoreTabsMenu) {
        requestMoreTabsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Update dropdown before showing to ensure it has current hidden tabs
            if (window.updateRequestTabsMoreDropdown) {
                window.updateRequestTabsMoreDropdown();
            }
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
        const formatDropdownMenu = document.getElementById('formatDropdownMenu');
        const formatDropdownBtn = document.getElementById('formatDropdownBtn');
        if (formatDropdownMenu && !formatDropdownMenu.contains(e.target) && !formatDropdownBtn?.contains(e.target)) {
            formatDropdownMenu.classList.remove('show');
            if (formatDropdownBtn) {
                formatDropdownBtn.classList.remove('active');
            }
        }
        if (requestMoreTabsMenu && !requestMoreTabsMenu.contains(e.target) && !requestMoreTabsBtn?.contains(e.target)) {
            requestMoreTabsMenu.classList.remove('show');
            if (requestMoreTabsBtn) {
                requestMoreTabsBtn.classList.remove('active');
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
                if (window.updateRequestTabsMoreDropdown) {
                    window.updateRequestTabsMoreDropdown();
                }
            }, 0);
        });
    });

    // Export functions for use by other modules
    window.updateResponseDropdowns = updateResponseDropdowns;

})();

