/**
 * FossBOX Mobile Configuration
 * Configuration optimized for mobile experience
 */

// API Configuration
window.TMDB_API_KEY = '1b1e8c8ea80ee123f859132397514abb';

// Mobile Application Configuration
window.FossBOXMobileConfig = {
  // API Settings
  api: {
    tmdb: {
      baseUrl: 'https://api.themoviedb.org/3',
      imageBaseUrl: 'https://image.tmdb.org/t/p',
      key: window.TMDB_API_KEY
    }
  },

  // Mobile UI Settings
  ui: {
    search: {
      debounceDelay: 500,
      maxResults: 15
    },
    pagination: {
      itemsPerPage: 15
    },
    sections: {
      maxItems: 15 // Increased from 8 to show +2 rows (+7 more items)
    }
  },

  // Site Information
  site: {
    name: 'FossBOX Mobile',
    url: 'm.fossbox.cc',
    description: 'Mobile-optimized movie and TV discovery',
    version: '1.0.0'
  }
};