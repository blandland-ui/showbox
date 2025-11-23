/**
 * FossBOX Mobile JavaScript
 * Mobile-optimized functionality
 */

class MobileApp {
  constructor() {
    this.currentSection = 'movies';
    this.isNavOpen = false;
    this.currentPage = 1;
    this.totalPages = 999;
    this.init();
  }

  init() {
    this.setupMobileNav();
    this.setupSectionToggle();
    this.setupSearch();
    this.setupPagination();
    this.loadFeaturedContent();
  }

  setupMobileNav() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');

    const openNav = () => {
      nav.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isNavOpen = true;
    };

    const closeNav = () => {
      nav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      this.isNavOpen = false;
    };

    menuToggle?.addEventListener('click', openNav);
    closeBtn?.addEventListener('click', closeNav);
    overlay?.addEventListener('click', closeNav);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isNavOpen) {
        closeNav();
      }
    });
  }

  setupSectionToggle() {
    const toggleBtns = document.querySelectorAll('.mobile-toggle-btn');
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        
        // Update active button
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Switch sections
        this.currentSection = section;
        this.showSection(section);
      });
    });
  }

  showSection(section) {
    const moviesSections = document.querySelectorAll('.movies-section');
    const tvSections = document.querySelectorAll('.tv-section');
    
    if (section === 'movies') {
      moviesSections.forEach(el => el.classList.remove('hidden'));
      tvSections.forEach(el => el.classList.add('hidden'));
    } else {
      moviesSections.forEach(el => el.classList.add('hidden'));
      tvSections.forEach(el => el.classList.remove('hidden'));
    }
  }

  setupSearch() {
    const searchForm = document.querySelector('.mobile-search-form');
    const searchInput = document.querySelector('.mobile-search-form input');
    let searchTimeout;

    searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
          this.performSearch(query);
        }, window.FossBOXMobileConfig.ui.search.debounceDelay);
      }
    });

    searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  async performSearch(query) {
    // Implement mobile search functionality
    console.log('Mobile search:', query);
  }

  setupPagination() {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageNumbers = document.querySelectorAll('.mobile-page-number');

    // Previous page button
    prevBtn?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1);
      }
    });

    // Next page button
    nextBtn?.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
      }
    });

    // Page number buttons
    pageNumbers.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        this.goToPage(page);
      });
    });
  }

  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;
    
    this.currentPage = pageNumber;
    this.updatePaginationUI();
    this.loadContentForPage(pageNumber);
  }

  updatePaginationUI() {
    // Update current page display
    const currentPageSpan = document.getElementById('currentPageNumber');
    if (currentPageSpan) {
      currentPageSpan.textContent = this.currentPage;
    }

    // Update prev/next buttons
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentPage <= 1;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= this.totalPages;
    }

    // Update page number buttons
    this.updatePageNumbers();
  }

  updatePageNumbers() {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    if (!pageNumbersContainer) return;

    const currentPage = this.currentPage;
    const totalPages = this.totalPages;
    
    let pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const range = 1; // Show 1 page before and after current
    const start = Math.max(2, currentPage - range);
    const end = Math.min(totalPages - 1, currentPage + range);
    
    // Add dots if there's a gap after page 1
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add dots if there's a gap before last page
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if different from first)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Generate HTML
    pageNumbersContainer.innerHTML = pages.map(page => {
      if (page === '...') {
        return '<span class="mobile-page-dots">...</span>';
      } else {
        const isActive = page === currentPage ? 'active' : '';
        return `<button class="mobile-page-btn mobile-page-number ${isActive}" data-page="${page}">${page}</button>`;
      }
    }).join('');
    
    // Re-attach event listeners to new buttons
    pageNumbersContainer.querySelectorAll('.mobile-page-number').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        this.goToPage(page);
      });
    });
  }

  async loadContentForPage(page) {
    // Override this method in child classes to load specific content
    console.log(`Loading content for page ${page}`);
    
    // Update the content loading based on current section
    if (this.currentSection === 'movies') {
      await this.loadMoviesPage(page);
    } else if (this.currentSection === 'tv') {
      await this.loadTVShowsPage(page);
    }
  }

  async loadMoviesPage(page) {
    const API_KEY = window.FossBOXMobileConfig.api.tmdb.key;
    const moviesGrid = document.getElementById('mobile-movies-grid');
    
    if (!moviesGrid || !API_KEY) return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`
      );
      const data = await response.json();
      
      const movies = data.results.slice(0, window.FossBOXMobileConfig.ui.sections.maxItems);
      this.renderMovies(movies, moviesGrid);
      
      // Update total pages based on API response
      if (data.total_pages && data.total_pages < this.totalPages) {
        this.totalPages = Math.min(data.total_pages, 999);
        const totalPagesSpan = document.getElementById('totalPages');
        if (totalPagesSpan) {
          totalPagesSpan.textContent = this.totalPages;
        }
      }
    } catch (error) {
      console.error('Error loading movies page:', error);
      moviesGrid.innerHTML = '<div class="loading">Failed to load movies</div>';
    }
  }

  async loadTVShowsPage(page) {
    const API_KEY = window.FossBOXMobileConfig.api.tmdb.key;
    const tvGrid = document.getElementById('mobile-tv-grid');
    
    if (!tvGrid || !API_KEY) return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`
      );
      const data = await response.json();
      
      const shows = data.results.slice(0, window.FossBOXMobileConfig.ui.sections.maxItems);
      this.renderTVShows(shows, tvGrid);
      
      // Update total pages based on API response
      if (data.total_pages && data.total_pages < this.totalPages) {
        this.totalPages = Math.min(data.total_pages, 999);
        const totalPagesSpan = document.getElementById('totalPages');
        if (totalPagesSpan) {
          totalPagesSpan.textContent = this.totalPages;
        }
      }
    } catch (error) {
      console.error('Error loading TV shows page:', error);
      tvGrid.innerHTML = '<div class="loading">Failed to load TV shows</div>';
    }
  }

  async loadFeaturedContent() {
    try {
      await this.loadMovies();
      await this.loadTVShows();
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  async loadMovies() {
    const API_KEY = window.FossBOXMobileConfig.api.tmdb.key;
    const moviesGrid = document.getElementById('mobile-movies-grid');
    
    if (!moviesGrid || !API_KEY) return;

    try {
      // Load from multiple pages to ensure we have enough movies for +2 rows
      const page1Response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
      );
      const page1Data = await page1Response.json();
      
      const page2Response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=2`
      );
      const page2Data = await page2Response.json();
      
      // Combine results and take the required number
      const allMovies = [...page1Data.results, ...page2Data.results];
      const movies = allMovies.slice(0, window.FossBOXMobileConfig.ui.sections.maxItems);
      this.renderMovies(movies, moviesGrid);
    } catch (error) {
      console.error('Error loading movies:', error);
      moviesGrid.innerHTML = '<div class="loading">Failed to load movies</div>';
    }
  }

  async loadTVShows() {
    const API_KEY = window.FossBOXMobileConfig.api.tmdb.key;
    const tvGrid = document.getElementById('mobile-tv-grid');
    
    if (!tvGrid || !API_KEY) return;

    try {
      // Load from multiple pages to ensure we have enough TV shows for +2 rows
      const page1Response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=1`
      );
      const page1Data = await page1Response.json();
      
      const page2Response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=2`
      );
      const page2Data = await page2Response.json();
      
      // Combine results and take the required number
      const allShows = [...page1Data.results, ...page2Data.results];
      const shows = allShows.slice(0, window.FossBOXMobileConfig.ui.sections.maxItems);
      this.renderTVShows(shows, tvGrid);
    } catch (error) {
      console.error('Error loading TV shows:', error);
      tvGrid.innerHTML = '<div class="loading">Failed to load TV shows</div>';
    }
  }

  renderMovies(movies, container) {
    container.innerHTML = movies.map(movie => {
      const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
        : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="185" height="278" fill="%23333"><rect width="100%" height="100%"/><text x="50%" y="50%" fill="%23666" text-anchor="middle" dy=".3em">No Image</text></svg>';
      
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
      
      return `
        <div class="mobile-movie-item" onclick="openMovie(${movie.id}, 'movie', '${encodeURIComponent(movie.title)}')">
          <img src="${posterUrl}" alt="${movie.title}" class="mobile-movie-poster" loading="lazy">
          <div class="mobile-movie-info">
            <h4 class="mobile-movie-title">${movie.title}</h4>
            <p class="mobile-movie-year">${year}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTVShows(shows, container) {
    container.innerHTML = shows.map(show => {
      const posterUrl = show.poster_path 
        ? `https://image.tmdb.org/t/p/w185${show.poster_path}`
        : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="185" height="278" fill="%23333"><rect width="100%" height="100%"/><text x="50%" y="50%" fill="%23666" text-anchor="middle" dy=".3em">No Image</text></svg>';
      
      const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A';
      
      return `
        <div class="mobile-movie-item" onclick="openMovie(${show.id}, 'tv', '${encodeURIComponent(show.name)}')">
          <img src="${posterUrl}" alt="${show.name}" class="mobile-movie-poster" loading="lazy">
          <div class="mobile-movie-info">
            <h4 class="mobile-movie-title">${show.name}</h4>
            <p class="mobile-movie-year">${year}</p>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Global functions
function openMovie(id, type, title) {
  const playerUrl = `player.html?id=${id}&type=${type}&title=${encodeURIComponent(title)}`;
  window.location.href = playerUrl;
}

// Initialize mobile app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MobileApp();
});