/**
 * FossBOX Configuration
 * Central configuration for the movie database application
 */

// API Configuration
window.TMDB_API_KEY = '1b1e8c8ea80ee123f859132397514abb';

// Application Configuration
window.FossBOXConfig = {
  // API Settings
  api: {
    tmdb: {
      baseUrl: 'https://api.themoviedb.org/3',
      imageBaseUrl: 'https://image.tmdb.org/t/p',
      key: window.TMDB_API_KEY
    }
  },

  // UI Settings
  ui: {
    carousel: {
      autoPlayInterval: 5000,
      maxSlides: 10
    },
    search: {
      debounceDelay: 300,
      maxResults: 20
    },
    pagination: {
      itemsPerPage: 35
    }
  },

  // Site Information
  site: {
    name: 'FossBOX',
    url: 'www.fossbox.cc',
    description: 'Your go-to source for discovering movies and TV shows',
    version: '2.0.0'
  }
};