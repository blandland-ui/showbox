/**
 * ShowBox Authentication Check
 * Include this script at the top of every protected page
 */

(function() {
    const SESSION_KEY = 'showbox_authenticated';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    const AUTH_PAGE = 'auth.html';

    // Check if user is authenticated
    function isAuthenticated() {
        const authData = sessionStorage.getItem(SESSION_KEY);
        
        if (!authData) {
            return false;
        }

        try {
            const { authenticated, timestamp } = JSON.parse(authData);
            const now = new Date().getTime();
            
            // Check if session is still valid
            if (authenticated && (now - timestamp < SESSION_DURATION)) {
                return true;
            }
            
            // Session expired
            sessionStorage.removeItem(SESSION_KEY);
            return false;
        } catch (e) {
            sessionStorage.removeItem(SESSION_KEY);
            return false;
        }
    }

    // If not authenticated, redirect to auth page
    if (!isAuthenticated()) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Don't redirect if already on auth page
        if (currentPage !== AUTH_PAGE) {
            window.location.href = `${AUTH_PAGE}?return=${encodeURIComponent(currentPage)}`;
        }
    }
})();
