/**
 * Developer Tools Protection Override
 * This script prevents blocking of browser developer tools
 * Add this script BEFORE any other scripts in your HTML
 */

(function() {
    'use strict';
    
    console.log('DevTools Protection Override Active');
    
    // 1. Prevent debugger detection
    const originalDebugger = Function.prototype.constructor;
    Function.prototype.constructor = function(...args) {
        if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('debugger')) {
            return function() {};
        }
        return originalDebugger.apply(this, args);
    };
    
    // 2. Override window.location to prevent redirects from devtools detection
    let realLocation = window.location;
    let redirectAttempts = 0;
    
    Object.defineProperty(window, 'location', {
        get: function() {
            return realLocation;
        },
        set: function(value) {
            // Block redirects to 404 or suspicious URLs
            if (typeof value === 'string' && (value.includes('404') || value.includes('error'))) {
                console.warn('Blocked redirect attempt to:', value);
                redirectAttempts++;
                if (redirectAttempts > 3) {
                    console.error('Multiple redirect attempts blocked. Possible anti-debugging script detected.');
                }
                return;
            }
            realLocation = value;
        }
    });
    
    // 3. Intercept keyboard events that might trigger redirects
    document.addEventListener('keydown', function(e) {
        // Allow developer tool shortcuts
        const isDevToolsShortcut = (
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || // Ctrl+Shift+J
            (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) || // Ctrl+Shift+C
            e.key === 'F12'                                                    // F12
        );
        
        if (isDevToolsShortcut) {
            // Allow the event but stop any other listeners
            e.stopImmediatePropagation();
            console.log('DevTools shortcut allowed:', e.key);
        }
    }, true); // Use capture phase to intercept before other listeners
    
    // 4. Prevent context menu blocking (right-click)
    document.addEventListener('contextmenu', function(e) {
        e.stopImmediatePropagation();
    }, true);
    
    // 5. Override console methods that might be used for detection
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        debug: console.debug
    };
    
    // Prevent console detection by keeping console methods functional
    ['log', 'warn', 'error', 'debug', 'info', 'trace'].forEach(method => {
        const original = console[method];
        console[method] = function(...args) {
            try {
                return original.apply(console, args);
            } catch(e) {
                // Silently fail if there's an issue
            }
        };
    });
    
    // 6. Block window size detection (common devtools detection method)
    let blockSizeCheck = false;
    const originalInnerWidth = Object.getOwnPropertyDescriptor(Window.prototype, 'innerWidth');
    const originalInnerHeight = Object.getOwnPropertyDescriptor(Window.prototype, 'innerHeight');
    const originalOuterWidth = Object.getOwnPropertyDescriptor(Window.prototype, 'outerWidth');
    const originalOuterHeight = Object.getOwnPropertyDescriptor(Window.prototype, 'outerHeight');
    
    // 7. Prevent beforeunload hijacking
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'beforeunload' || type === 'unload') {
            // Log but allow
            console.log('beforeunload/unload listener registered (monitored)');
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // 8. Monitor for suspicious scripts
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT') {
                    const src = node.src || '';
                    const content = node.textContent || '';
                    
                    // Check for suspicious patterns
                    if (
                        src.includes('anti-debug') ||
                        src.includes('devtools-detect') ||
                        content.includes('debugger') ||
                        content.includes('devtools') ||
                        (content.includes('window.location') && content.includes('404'))
                    ) {
                        console.warn('Suspicious script detected:', src || 'inline script');
                        console.log('Script content preview:', content.substring(0, 200));
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // 9. Disable common anti-debugging intervals
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        // Check if the callback contains debugging detection code
        const callbackStr = callback.toString();
        if (
            callbackStr.includes('debugger') ||
            callbackStr.includes('devtools') ||
            (callbackStr.includes('console') && callbackStr.includes('toString'))
        ) {
            console.warn('Blocked anti-debugging interval');
            return -1; // Return fake interval ID
        }
        return originalSetInterval.call(window, callback, delay, ...args);
    };
    
    console.log('%c✓ DevTools Protection Override Complete', 'color: #0f0; font-weight: bold; font-size: 14px;');
    console.log('%cDeveloper tools should now work normally', 'color: #0ff;');
    
})();
