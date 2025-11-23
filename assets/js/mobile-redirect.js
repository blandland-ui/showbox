/**
 * Mobile Detection and Redirect Script
 * Detects mobile devices and redirects to m.fossbox site
 */

(function() {
  'use strict';
  
  // Check if we're already on mobile site
  if (window.location.hostname.startsWith('m.') || window.location.pathname.startsWith('/m/')) {
    return;
  }
  
  // Check if user has opted to stay on desktop
  if (localStorage.getItem('fossbox-force-desktop') === 'true') {
    return;
  }
  
  // Mobile detection function
  function isMobileDevice() {
    // Check user agent
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'android', 'iphone', 'ipod', 'ipad', 'windows phone', 'blackberry',
      'mobile', 'opera mini', 'webos', 'palm', 'symbian'
    ];
    
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    
    // Check screen size
    const isSmallScreen = window.innerWidth <= 768 || window.screen.width <= 768;
    
    // Check touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUA || (isSmallScreen && isTouchDevice);
  }
  
  // Redirect to mobile site
  function redirectToMobile() {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    
    // Map desktop paths to mobile paths
    let mobilePath = '/m/';
    
    if (currentPath.includes('/pages/movies.html')) {
      mobilePath = '/m/movies.html';
    } else if (currentPath.includes('/pages/tv.html')) {
      mobilePath = '/m/tv.html';
    } else if (currentPath.includes('/pages/cartoons.html')) {
      mobilePath = '/m/cartoons.html';
    } else if (currentPath.includes('/player.html')) {
      // Keep player on main site but optimize
      return;
    } else if (currentPath === '/' || currentPath.includes('index.html')) {
      mobilePath = '/m/index.html';
    }
    
    // Construct mobile URL
    const mobileUrl = window.location.protocol + '//' + 
                     window.location.hostname + 
                     mobilePath + 
                     currentSearch + 
                     currentHash;
    
    // Redirect
    window.location.replace(mobileUrl);
  }
  
  // Add "View Desktop Site" functionality
  function addDesktopSiteOption() {
    // Only add if we're on mobile site
    if (!window.location.pathname.startsWith('/m/')) return;
    
    const desktopLink = document.createElement('div');
    desktopLink.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(163, 252, 19, 0.9);
      color: #000;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      z-index: 1000;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(163, 252, 19, 0.3);
    `;
    desktopLink.textContent = 'Desktop Site';
    desktopLink.onclick = function() {
      localStorage.setItem('fossbox-force-desktop', 'true');
      const desktopUrl = window.location.href.replace('/m/', '/').replace('/m', '/');
      window.location.href = desktopUrl;
    };
    
    document.body.appendChild(desktopLink);
  }
  
  // Main execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (isMobileDevice()) {
        redirectToMobile();
      }
      addDesktopSiteOption();
    });
  } else {
    if (isMobileDevice()) {
      redirectToMobile();
    }
    addDesktopSiteOption();
  }
  
  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      if (isMobileDevice() && !window.location.pathname.startsWith('/m/')) {
        redirectToMobile();
      }
    }, 500);
  });
  
})();