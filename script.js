// DOM Elements
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const mobileToggleBtn = document.getElementById('mobileToggleBtn');
const mainContent = document.getElementById('mainContent');

// State management
let isCollapsed = false;
let isMobile = window.innerWidth <= 768;

// Initialize sidebar state
function initializeSidebar() {
    // Check if user has a preference stored
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
        isCollapsed = JSON.parse(savedState);
        updateSidebarState();
    }
    
    // Update mobile state
    updateMobileState();
}

// Update sidebar collapsed state
function updateSidebarState() {
    if (isMobile) {
        // Mobile behavior
        if (isCollapsed) {
            sidebar.classList.add('open');
        } else {
            sidebar.classList.remove('open');
        }
    } else {
        // Desktop behavior
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('sidebar-collapsed');
        }
    }
    
    // Save state to localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
}

// Update mobile state
function updateMobileState() {
    isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: sidebar is hidden by default
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
        if (!isCollapsed) {
            sidebar.classList.remove('open');
        }
    } else {
        // Desktop: use collapsed state
        sidebar.classList.remove('open');
        updateSidebarState();
    }
}

// Toggle sidebar function
function toggleSidebar() {
    isCollapsed = !isCollapsed;
    updateSidebarState();
}

// Close sidebar on mobile when clicking outside
function handleOutsideClick(event) {
    if (isMobile && isCollapsed && !sidebar.contains(event.target) && !mobileToggleBtn.contains(event.target)) {
        isCollapsed = false;
        updateSidebarState();
    }
}

// Handle window resize
function handleResize() {
    const wasMobile = isMobile;
    updateMobileState();
    
    // If switching between mobile and desktop, reset state appropriately
    if (wasMobile !== isMobile) {
        if (isMobile) {
            // Switched to mobile - close sidebar
            isCollapsed = false;
            updateSidebarState();
        } else {
            // Switched to desktop - use saved preference
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState !== null) {
                isCollapsed = JSON.parse(savedState);
                updateSidebarState();
            }
        }
    }
}

// Add smooth hover effects for navigation items
function addHoverEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!isCollapsed || isMobile) {
                this.style.transform = 'translateX(5px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Add click effects for buttons
function addButtonEffects() {
    const buttons = document.querySelectorAll('.toggle-btn, .mobile-toggle-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Keyboard navigation support
function addKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        // Toggle sidebar with Ctrl/Cmd + B
        if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
            event.preventDefault();
            toggleSidebar();
        }
        
        // Close sidebar with Escape key (mobile only)
        if (event.key === 'Escape' && isMobile && isCollapsed) {
            isCollapsed = false;
            updateSidebarState();
        }
    });
}

// Add active state management for navigation
function addActiveStateManagement() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // On mobile, close sidebar after navigation
            if (isMobile) {
                setTimeout(() => {
                    isCollapsed = false;
                    updateSidebarState();
                }, 150);
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    addHoverEffects();
    addButtonEffects();
    addKeyboardSupport();
    addActiveStateManagement();
    addLogoUploadFunctionality();
    
    // Event listeners
    toggleBtn.addEventListener('click', toggleSidebar);
    mobileToggleBtn.addEventListener('click', toggleSidebar);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleOutsideClick);
    
    // Add logo upload functionality
function addLogoUploadFunctionality() {
    const logoImg = document.getElementById('logoImg');
    const clearBtn = document.getElementById('clearLogoBtn');
    
    // Function to reset logo to default state
    function resetLogo() {
        const defaultLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23f0f0f0' stroke='%23ccc' stroke-width='2' stroke-dasharray='4,2'/%3E%3Ctext x='16' y='20' text-anchor='middle' font-family='Arial' font-size='10' fill='%23999'%3E📷%3C/text%3E%3C/svg%3E";
        logoImg.src = defaultLogo;
        localStorage.removeItem('sidebarLogo');
        // Restore pulsing animation
        logoImg.style.animation = 'pulse 2s infinite';
        logoImg.style.border = '2px dashed rgba(255, 255, 255, 0.6)';
        logoImg.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        // Hide clear button
        clearBtn.classList.remove('show');
    }
    
    // Function to update logo display state
    function updateLogoState(isUploaded) {
        if (isUploaded) {
            // Show clear button
            clearBtn.classList.add('show');
        } else {
            // Hide clear button
            clearBtn.classList.remove('show');
        }
    }
    
    // Add click event to logo for upload
    logoImg.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoImg.src = e.target.result;
                    localStorage.setItem('sidebarLogo', e.target.result);
                    // Remove pulsing animation after upload
                    logoImg.style.animation = 'none';
                    logoImg.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                    logoImg.style.backgroundColor = 'transparent';
                    updateLogoState(true);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
    
    // Add click event to clear button
    clearBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent logo click event
        resetLogo();
        updateLogoState(false);
    });
    
    // Add right-click context menu for clear option
    logoImg.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (localStorage.getItem('sidebarLogo')) {
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item" onclick="clearLogo()">
                    <i class="fas fa-trash"></i> Clear Logo
                </div>
            `;
            contextMenu.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 8px 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                min-width: 120px;
            `;
            
            const menuItem = contextMenu.querySelector('.context-menu-item');
            menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #333;
                font-size: 14px;
            `;
            
            menuItem.addEventListener('click', function() {
                resetLogo();
                updateLogoState(false);
                document.body.removeChild(contextMenu);
            });
            
            document.body.appendChild(contextMenu);
            
            // Remove context menu when clicking elsewhere
            setTimeout(() => {
                document.addEventListener('click', function removeMenu() {
                    if (document.body.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener('click', removeMenu);
                });
            }, 0);
        }
    });
    
    // Load saved logo on initialization
    const savedLogo = localStorage.getItem('sidebarLogo');
    if (savedLogo) {
        logoImg.src = savedLogo;
        // Remove pulsing animation if logo is already uploaded
        logoImg.style.animation = 'none';
        logoImg.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        logoImg.style.backgroundColor = 'transparent';
        updateLogoState(true);
    } else {
        updateLogoState(false);
    }
    
    // Add hover effect to indicate it's clickable
    logoImg.style.cursor = 'pointer';
    logoImg.title = 'Click to upload logo, right-click to clear';
    
    // Make clearLogo function globally available
    window.clearLogo = function() {
        resetLogo();
        updateLogoState(false);
    };
}

// Add some visual feedback for interactions
    console.log('🚀 Collapsible Sidebar initialized successfully!');
    console.log('💡 Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar');
    console.log('🖼️ Click on the logo to upload a custom logo image');
});

// Export functions for potential external use
window.SidebarController = {
    toggle: toggleSidebar,
    isCollapsed: () => isCollapsed,
    isMobile: () => isMobile
};
