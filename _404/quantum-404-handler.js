// Quantum 404 Error Handler for GitHub Pages
// This script provides a smooth 404 error handling experience

(function() {
    'use strict';
    
    // Global 404 Error Handler
    function handle404Error(url) {
        console.log('🚀 Quantum 404 detected for URL:', url);
        console.log('🌌 Redirecting to quantum dimension...');
        
        // Add a small delay for a smoother transition
        setTimeout(() => {
            window.location.href = '_404/404.html';
        }, 500);
    }

    // Enhanced navigation function with 404 handling
    function navigateToPage(url) {
        // Show a loading indicator if available
        const body = document.body;
        body.style.cursor = 'wait';
        
        // Check if the URL exists by making a HEAD request
        fetch(url, { method: 'HEAD' })
            .then(response => {
                body.style.cursor = 'default';
                if (response.ok) {
                    window.location.href = url;
                } else {
                    handle404Error(url);
                }
            })
            .catch(error => {
                body.style.cursor = 'default';
                console.error('Navigation error:', error);
                handle404Error(url);
            });
    }

    // Override all existing navigation to use safe navigation
    function addSafeNavigationToLinks() {
        // Find all internal links (not starting with http and not anchors)
        const internalLinks = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's a special link or already handled
                if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || this.hasAttribute('data-safe-nav')) {
                    return;
                }
                
                e.preventDefault();
                navigateToPage(href);
                
                // Mark as handled
                this.setAttribute('data-safe-nav', 'true');
            });
        });
    }

    // Handle browser navigation errors (back/forward)
    window.addEventListener('popstate', function(event) {
        // If the current page doesn't exist, redirect to 404
        fetch(window.location.pathname, { method: 'HEAD' })
            .catch(() => {
                handle404Error(window.location.pathname);
            });
    });

    // Handle unhandled errors that might indicate missing resources
    window.addEventListener('error', function(event) {
        // Check if it's a 404-type error
        if (event.filename && (event.filename.includes('.html') || event.filename.includes('.js') || event.filename.includes('.css'))) {
            console.warn('Resource loading error detected:', event.filename);
            // Don't redirect immediately for resource errors, just log them
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addSafeNavigationToLinks();
            console.log('🔮 Quantum 404 protection activated!');
        });
    } else {
        addSafeNavigationToLinks();
        console.log('🔮 Quantum 404 protection activated!');
    }

    // Make the navigation function globally available
    window.quantumNavigate = navigateToPage;
    window.quantum404Handler = handle404Error;

    // Fun console message
    console.log(`
    🌌 QuantumInsights 404 Protection Loaded 🌌
    
    Features:
    • Automatic 404 detection
    • Smooth redirection to quantum 404 page
    • Safe navigation for all internal links
    • Error handling with quantum humor
    
    "In a quantum superposition of found and not found,
     until observed... then it's definitely our fun 404 page!" 🐱📦
    `);

})();
