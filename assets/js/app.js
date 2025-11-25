/**
 * FossBOX Main Application
 * Consolidated application logic for the movie database site
 */

class FossBOX {
  constructor() {
    this.API_KEY = window.TMDB_API_KEY || '';
    this.currentMovies = [];
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeCarousel();
      this.initializeSearch();
      this.initializeFilters();
      this.loadFeaturedContent();
    });
  }

  // Carousel functionality
  async initializeCarousel() {
    const carousel = document.getElementById('featured-carousel');
    const captionEl = document.getElementById('carousel-caption');
    const prevBtn = document.getElementById('car-prev');
    const nextBtn = document.getElementById('car-next');

    if (!carousel) return;

    try {
      const movies = await this.fetchNowPlayingMovies();
      this.populateCarousel(movies, carousel, captionEl);
      this.setupCarouselNavigation(carousel, captionEl, prevBtn, nextBtn);
    } catch (error) {
      console.error('Failed to initialize carousel:', error);
      this.showFallbackCarousel(carousel, captionEl);
    }
  }

  async fetchNowPlayingMovies() {
    if (!this.API_KEY) {
      throw new Error('API key not configured');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.API_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return (data.results || []).slice(0, 10);
  }

  populateCarousel(movies, carousel, captionEl) {
    // Clear existing slides
    carousel.querySelectorAll('.slide').forEach(el => el.remove());

    const items = movies.length ? movies : [
      { title: 'Welcome to FossBOX', backdrop_path: null }
    ];

    items.forEach((movie, index) => {
      const slide = document.createElement('div');
      slide.className = `slide${index === 0 ? ' active' : ''}`;
      
      const bgImage = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : `https://via.placeholder.com/1600x600/1b1b1b/ffffff?text=${encodeURIComponent(movie.title || 'FossBOX')}`;
      
      slide.style.backgroundImage = `url('${bgImage}')`;
      slide.dataset.title = movie.title || 'Featured Content';
      carousel.appendChild(slide);
    });

    // Set initial caption
    if (captionEl && items.length > 0) {
      captionEl.textContent = items[0].title || 'Featured Content';
    }
  }

  setupCarouselNavigation(carousel, captionEl, prevBtn, nextBtn) {
    let currentIndex = 0;
    let autoPlayTimer;

    const getSlides = () => Array.from(carousel.querySelectorAll('.slide'));

    const showSlide = (index) => {
      const slides = getSlides();
      if (slides.length === 0) return;

      slides[currentIndex].classList.remove('active');
      currentIndex = (index + slides.length) % slides.length;
      slides[currentIndex].classList.add('active');
      
      if (captionEl) {
        captionEl.textContent = slides[currentIndex].dataset.title || 'Featured Content';
      }
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    const startAutoPlay = () => {
      this.stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 5000);
    };

    this.stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    // Event listeners
    nextBtn?.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });

    // Start autoplay
    startAutoPlay();

    // Pause on hover
    carousel.addEventListener('mouseenter', this.stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  showFallbackCarousel(carousel, captionEl) {
    const slide = document.createElement('div');
    slide.className = 'slide active';
    slide.style.backgroundImage = "url('https://via.placeholder.com/1600x600/1b1b1b/ffffff?text=FossBOX')";
    slide.dataset.title = 'Welcome to FossBOX';
    carousel.appendChild(slide);
    
    if (captionEl) {
      captionEl.textContent = 'Welcome to FossBOX';
    }
  }

  // Search functionality
  initializeSearch() {
    const searchForm = document.getElementById('corner-search-form');
    const searchInput = document.getElementById('corner-search-input');

    if (!searchForm) return;

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        this.performSearch(query);
      }
    });
  }

  async performSearch(query) {
    try {
      const movies = await this.searchMovies(query);
      this.displaySearchResults(movies);
    } catch (error) {
      console.error('Search failed:', error);
      this.showSearchError();
    }
  }

  async searchMovies(query) {
    if (!this.API_KEY) {
      throw new Error('API key not configured');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  displaySearchResults(movies) {
    const movieList = document.getElementById('movie-list');
    if (!movieList) return;

    movieList.innerHTML = '';

    if (movies.length === 0) {
      movieList.innerHTML = '<p>No movies found matching your search.</p>';
      return;
    }

    movies.slice(0, 20).forEach(movie => {
      const movieElement = this.createMovieElement(movie);
      movieList.appendChild(movieElement);
    });
  }

  createMovieElement(movie) {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-item';
    movieDiv.style.cursor = 'pointer';
    
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/200x300/333/fff?text=No+Image';

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';

    // Determine if it's a TV show or movie
    const isTV = movie.name || movie.first_air_date || movie.media_type === 'tv';
    const mediaType = isTV ? 'tv' : 'movie';
    const title = movie.title || movie.name || 'Unknown';

    movieDiv.innerHTML = `
      <img src="${posterUrl}" alt="${title}" loading="lazy">
      <div class="movie-info">
        <h4>${title}</h4>
        <p class="movie-year">${releaseYear} • ${mediaType.toUpperCase()}</p>
        <p class="movie-overview">${movie.overview ? movie.overview.substring(0, 150) + '...' : 'No description available.'}</p>
      </div>
    `;

    // Add click handler to go to player
    movieDiv.addEventListener('click', () => {
      const playerUrl = `player.html?tmdb=${movie.id}&type=${mediaType}`;
      window.location.href = playerUrl;
    });

    return movieDiv;
  }

  showSearchError() {
    const movieList = document.getElementById('movie-list');
    if (movieList) {
      movieList.innerHTML = '<p>Search failed. Please try again later.</p>';
    }
  }

  // Filter functionality
  initializeFilters() {
    const filterForm = document.getElementById('refine-form');
    if (!filterForm) return;

    const filterInputs = filterForm.querySelectorAll('select');
    filterInputs.forEach(input => {
      input.addEventListener('change', () => this.applyFilters());
    });
  }

  applyFilters() {
    const filterForm = document.getElementById('refine-form');
    if (!filterForm) return;

    const formData = new FormData(filterForm);
    const filters = {
      language: formData.get('language'),
      year: formData.get('year'),
      genre: formData.get('genre')
    };

    // Filter out empty values
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    console.log('Applying filters:', filters);
    // In a real app, you would fetch filtered results here
    // For now, just log the filters
  }

  // Load featured content for the sidebar boxes
  async loadFeaturedContent() {
    try {
      const [topMovies, topTV] = await Promise.all([
        this.fetchTopMovies(),
        this.fetchTopTV()
      ]);

      this.populateTopLinks('links-top-movies', topMovies);
      this.populateTopLinks('links-top-tv', topTV);
      this.populateTopLinks('links-top-anime', []); // Placeholder
      this.populateTopLinks('links-featured-content', topMovies.slice(0, 3));

    } catch (error) {
      console.error('Failed to load featured content:', error);
    }
  }

  async fetchTopMovies() {
    if (!this.API_KEY) return [];

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return (data.results || []).slice(0, 6);
    } catch (error) {
      console.error('Failed to fetch top movies:', error);
      return [];
    }
  }

  async fetchTopTV() {
    if (!this.API_KEY) return [];

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${this.API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return (data.results || []).slice(0, 6);
    } catch (error) {
      console.error('Failed to fetch top TV shows:', error);
      return [];
    }
  }

  populateTopLinks(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = '<p class="no-content">No content available</p>';
      return;
    }

    items.forEach(item => {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'top-item-link';
      
      const posterUrl = item.poster_path || item.backdrop_path
        ? `https://image.tmdb.org/t/p/w200${item.poster_path || item.backdrop_path}`
        : 'https://via.placeholder.com/40x40/333/fff?text=?';

      const title = item.title || item.name || 'Unknown';
      const year = item.release_date || item.first_air_date 
        ? new Date(item.release_date || item.first_air_date).getFullYear()
        : '';

      // Determine if it's a TV show or movie based on which properties exist
      const isTV = item.name || item.first_air_date;
      const mediaType = isTV ? 'tv' : 'movie';

      link.innerHTML = `
        <img src="${posterUrl}" alt="${title}" loading="lazy">
        <div>
          <div class="item-title">${title}</div>
          <div class="item-year">${year}</div>
        </div>
      `;

      // Add click handler to go to player
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const playerUrl = `player.html?tmdb=${item.id}&type=${mediaType}`;
        window.location.href = playerUrl;
      });

      container.appendChild(link);
    });
  }
}

// Header Search Functionality
class HeaderSearch {
  constructor() {
    this.searchForm = document.getElementById('headerSearchForm');
    this.searchInput = document.getElementById('headerSearchInput');
    this.searchResults = document.getElementById('headerSearchResults');
    this.debounceTimer = null;
    
    if (this.searchForm && this.searchInput) {
      this.init();
    }
  }

  init() {
    // Handle form submission
    this.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch(this.searchInput.value.trim());
    });

    // Handle input with debouncing
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      clearTimeout(this.debounceTimer);
      
      if (query.length < 2) {
        this.hideResults();
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });

    // Handle clicks outside to close results
    document.addEventListener('click', (e) => {
      if (!this.searchForm.contains(e.target)) {
        this.hideResults();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideResults();
        this.searchInput.blur();
      }
    });
  }

  async performSearch(query) {
    if (!query) return;

    const API_KEY = window.TMDB_API_KEY || window.FossBOXConfig?.api?.tmdb?.key;
    if (!API_KEY) {
      this.showError('Search unavailable');
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.displayResults(data.results.slice(0, 8)); // Show top 8 results
      
    } catch (error) {
      console.error('Search failed:', error);
      this.showError('Search failed');
    }
  }

  displayResults(results) {
    if (!results || results.length === 0) {
      this.searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No results found</div>';
      this.showResults();
      return;
    }

    const resultsHTML = results.map(item => {
      const title = item.title || item.name || 'Unknown Title';
      const year = item.release_date || item.first_air_date 
        ? new Date(item.release_date || item.first_air_date).getFullYear()
        : '';
      const mediaType = item.media_type === 'tv' ? 'TV Show' : 'Movie';
      const posterUrl = item.poster_path 
        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
        : 'https://via.placeholder.com/40x60/333/fff?text=No+Image';

      return `
        <div class="search-result-item" data-id="${item.id}" data-type="${item.media_type || 'movie'}" data-title="${encodeURIComponent(title)}">
          <img src="${posterUrl}" alt="${title}" class="search-result-poster" loading="lazy">
          <div class="search-result-info">
            <div class="search-result-title">${title}</div>
            <div class="search-result-meta">${mediaType}${year ? ` • ${year}` : ''}</div>
          </div>
        </div>
      `;
    }).join('');

    this.searchResults.innerHTML = resultsHTML;
    
    // Add click handlers
    this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const type = item.dataset.type;
        const title = decodeURIComponent(item.dataset.title);
        
        // Navigate to player
        window.location.href = `player.html?id=${id}&type=${type}&title=${encodeURIComponent(title)}`;
      });
    });

    this.showResults();
  }

  showError(message) {
    this.searchResults.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">${message}</div>`;
    this.showResults();
  }

  showResults() {
    this.searchResults.style.display = 'block';
  }

  hideResults() {
    this.searchResults.style.display = 'none';
  }
}

// Random Content Manager
class RandomContentManager {
  constructor() {
    this.init();
  }

  init() {
    // Load initial random content
    this.loadRandomMovies();
    this.loadRandomTV();
    this.setupButtons();
  }

  setupButtons() {
    const refreshMoviesBtn = document.getElementById('refresh-movies-btn');
    const refreshTVBtn = document.getElementById('refresh-tv-btn');
    const refreshAllBtn = document.getElementById('refresh-all-btn');

    if (refreshMoviesBtn) {
      refreshMoviesBtn.addEventListener('click', () => {
        this.loadRandomMovies();
        this.animateButton(refreshMoviesBtn);
      });
    }

    if (refreshTVBtn) {
      refreshTVBtn.addEventListener('click', () => {
        this.loadRandomTV();
        this.animateButton(refreshTVBtn);
      });
    }

    if (refreshAllBtn) {
      refreshAllBtn.addEventListener('click', () => {
        this.loadRandomMovies();
        this.loadRandomTV();
        this.animateButton(refreshAllBtn);
      });
    }
  }

  animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }

  async loadRandomMovies() {
    const grid = document.getElementById('random-movies-grid');
    if (!grid) return;

    try {
      // Show loading state
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">🎬 Loading random movies...</div>';

      const API_KEY = window.TMDB_API_KEY || window.FossBOXConfig?.api?.tmdb?.key;
      if (!API_KEY) {
        throw new Error('API key not configured');
      }

      // Get a random page between 1-20 for variety
      const randomPage = Math.floor(Math.random() * 20) + 1;
      
      // Mix different categories for more variety
      const categories = ['popular', 'top_rated', 'now_playing'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${randomCategory}?api_key=${API_KEY}&language=en-US&page=${randomPage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Shuffle and take 35 random movies for 7x5 grid
      const shuffledMovies = this.shuffleArray(data.results).slice(0, 35);
      
      this.displayRandomContent(shuffledMovies, grid, 'movie');

    } catch (error) {
      console.error('Failed to load random movies:', error);
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">Failed to load movies. Try again!</div>';
    }
  }

  async loadRandomTV() {
    const grid = document.getElementById('random-tv-grid');
    if (!grid) return;

    try {
      // Show loading state
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">📺 Loading random TV shows...</div>';

      const API_KEY = window.TMDB_API_KEY || window.FossBOXConfig?.api?.tmdb?.key;
      if (!API_KEY) {
        throw new Error('API key not configured');
      }

      // Get a random page between 1-20 for variety
      const randomPage = Math.floor(Math.random() * 20) + 1;
      
      // Mix different categories for more variety
      const categories = ['popular', 'top_rated', 'on_the_air'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${randomCategory}?api_key=${API_KEY}&language=en-US&page=${randomPage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Shuffle and take 35 random TV shows for 7x5 grid
      const shuffledShows = this.shuffleArray(data.results).slice(0, 35);;
      
      this.displayRandomContent(shuffledShows, grid, 'tv');

    } catch (error) {
      console.error('Failed to load random TV shows:', error);
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">Failed to load TV shows. Try again!</div>';
    }
  }

  displayRandomContent(items, grid, type) {
    // Hide ads when content loads
    const adId = grid.id.replace('-grid', '-ad');
    const ad = document.getElementById(adId);
    if (ad) {
      ad.style.display = 'none';
    }

    if (!items || items.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">No content found.</div>';
      return;
    }

    grid.innerHTML = '';

    items.forEach(item => {
      const contentElement = this.createContentElement(item, type);
      grid.appendChild(contentElement);
    });
  }

  createContentElement(item, type) {
    const div = document.createElement('div');
    div.className = 'movie-item';
    div.style.cursor = 'pointer';
    
    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/200x300/333/fff?text=No+Image';

    const title = item.title || item.name || 'Unknown Title';
    const releaseYear = item.release_date || item.first_air_date 
      ? new Date(item.release_date || item.first_air_date).getFullYear() 
      : 'Unknown';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

    div.innerHTML = `
      <img src="${posterUrl}" alt="${title}" loading="lazy">
      <div class="movie-info">
        <h4>${title}</h4>
        <p class="movie-year">${releaseYear} • ⭐ ${rating}</p>
        <p class="movie-overview">${item.overview ? item.overview.substring(0, 80) + '...' : 'No description available.'}</p>
      </div>
    `;

    // Add click handler to go to player
    div.addEventListener('click', () => {
      const playerUrl = `player.html?tmdb=${item.id}&type=${type}&title=${encodeURIComponent(title)}`;
      window.location.href = playerUrl;
    });

    return div;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Initialize the application
window.FossBOX = new FossBOX();
window.HeaderSearch = new HeaderSearch();

// Initialize random content manager on homepage
if (document.getElementById('random-movies-grid')) {
  window.RandomContentManager = new RandomContentManager();
}