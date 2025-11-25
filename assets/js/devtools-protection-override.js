/**
 * Developer Tools Protection Override
 * This script prevents blocking of browser developer tools
 * Add this script BEFORE any other scripts in your HTML
 */

(function() {
    'use strict';
    
    console.log('%c✓ DevTools Protection Override Active', 'color: #0f0; font-weight: bold;');
    
    // 1. Stop all keyboard event blocking at the capture phase
    document.addEventListener('keydown', function(e) {
        // Developer tools shortcuts
        if (
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || // Ctrl+Shift+J  
            (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) || // Ctrl+Shift+C
            (e.key === 'F12') ||                                              // F12
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))                  // Ctrl+U (view source)
        ) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            console.log('%cDevTools shortcut allowed: ' + e.key, 'color: #0ff;');
        }
    }, true); // Capture phase - runs before other listeners
    
    // 2. Prevent context menu blocking
    document.addEventListener('contextmenu', function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }, true);
    
    // 3. Override window.location to block redirects
    const originalLocation = window.location.href;
    let redirectCount = 0;
    
    Object.defineProperty(window, 'location', {
        get: function() {
            return window.location;
        },
        set: function(value) {
            if (typeof value === 'string' && (value.includes('404') || value.includes('error'))) {
                console.warn('%cBlocked redirect to: ' + value, 'color: #f00; font-weight: bold;');
                redirectCount++;
                if (redirectCount > 2) {
                    console.error('%cMultiple redirect attempts blocked!', 'color: #f00; font-weight: bold;');
                }
                return false;
            }
            window.location.href = value;
        }
    });
    
    // 4. Prevent debugger statements
    const noop = function() {};
    Object.defineProperty(window, 'debugger', {
        get: () => noop,
        set: noop
    });
    
    // 5. Monitor and block suspicious scripts
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT') {
                    const src = node.src || '';
                    const content = node.textContent || '';
                    
                    if (
                        src.includes('anti-debug') ||
                        src.includes('devtools-detect') ||
                        (content.includes('debugger;') && content.includes('setInterval')) ||
                        (content.includes('window.location') && content.includes('404'))
                    ) {
                        console.warn('%c⚠ Suspicious script blocked:', 'color: #f80; font-weight: bold;', src || 'inline');
                        node.remove();
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    console.log('%c✓ Inspector Protection Complete - DevTools should work normally', 'color: #0f0; font-weight: bold;');
    
})();
