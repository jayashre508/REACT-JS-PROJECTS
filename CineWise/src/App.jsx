import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search';
import { SkeletonGrid } from './components/SkeletonCard';
import MovieCard from './components/MovieCard';
import MoodPicker from './components/MoodPicker';
import AdvancedFilters from './components/AdvancedFilters';
import MovieModal from './components/MovieModal';
import WatchlistPanel from './components/WatchlistPanel';
import ComparePanel from './components/ComparePanel';
import InsightsDashboard from './components/InsightsDashboard';
import SmartRecommendations from './components/SmartRecommendations';
import CommandPalette from './components/CommandPalette';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { useApp } from './context/AppContext';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: { accept: 'application/json', Authorization: `Bearer ${API_KEY}` },
};

const DEFAULT_FILTERS = { genres: [], yearFrom: '', yearTo: '', minRating: '', sortBy: 'popularity.desc' };

function App() {
  // ── original state ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  // ── new state ────────────────────────────────────────────────────
  const [activeMood, setActiveMood] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const insightsRef = useRef(null);

  const {
    setShowWatchlist, setShowCompare, compareQueue,
    setSelectedMovie, addRecentSearch, setCommandPaletteOpen,
  } = useApp();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // ── original fetch logic (preserved) ────────────────────────────
  const fetchMovies = async (query = '', mood = null, activeFilters = DEFAULT_FILTERS) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      let endpoint;
      if (query) {
        endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
      } else {
        const params = new URLSearchParams({ sort_by: activeFilters.sortBy || 'popularity.desc' });
        if (mood) mood.genres.forEach((g) => params.append('with_genres', g));
        else if (activeFilters.genres.length > 0) params.set('with_genres', activeFilters.genres.join(','));
        if (activeFilters.yearFrom) params.set('primary_release_date.gte', `${activeFilters.yearFrom}-01-01`);
        if (activeFilters.yearTo) params.set('primary_release_date.lte', `${activeFilters.yearTo}-12-31`);
        if (activeFilters.minRating) params.set('vote_average.gte', activeFilters.minRating);
        endpoint = `${API_BASE_URL}/discover/movie?${params.toString()}`;
      }

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
        addRecentSearch(query);
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies, please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  // ── original effects (preserved) ────────────────────────────────
  useEffect(() => { fetchMovies(debouncedSearchTerm, activeMood, filters); }, [debouncedSearchTerm, activeMood, filters]);
  useEffect(() => { loadTrendingMovies(); }, []);

  // ── keyboard shortcuts ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'w' || e.key === 'W') setShowWatchlist(true);
      if (e.key === 'c' || e.key === 'C') { if (compareQueue.length > 0) setShowCompare(true); }
      if (e.key === 'f' || e.key === 'F') setShowFilters((v) => !v);
      if (e.key === 'i' || e.key === 'I') { setShowInsights((v) => !v); setTimeout(() => insightsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [compareQueue, setShowCompare, setShowWatchlist]);

  const handleCommand = (id) => {
    if (id === 'watchlist') setShowWatchlist(true);
    if (id === 'compare') { if (compareQueue.length > 0) setShowCompare(true); }
    if (id === 'insights') { setShowInsights(true); setTimeout(() => insightsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = filters.genres.length > 0 || filters.yearFrom || filters.yearTo || filters.minRating || filters.sortBy !== 'popularity.desc';

  return (
    <main>
      <div className="wrapper">

        {/* ── original header (preserved) ── */}
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies You'll Love</span></h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* ── toolbar ── */}
        <div className="toolbar">
          <button onClick={() => setShowWatchlist(true)} className="toolbar-btn" title="W">
            🎬 My Movies
          </button>
          <button onClick={() => setShowFilters((v) => !v)} className={`toolbar-btn ${showFilters || hasActiveFilters ? 'toolbar-btn-active' : ''}`} title="F">
            🎛 Filters {hasActiveFilters && <span className="filter-dot" />}
          </button>
          <button onClick={() => { setShowInsights((v) => !v); setTimeout(() => insightsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`toolbar-btn ${showInsights ? 'toolbar-btn-active' : ''}`} title="I">
            📊 Insights
          </button>
          {compareQueue.length > 0 && (
            <button onClick={() => setShowCompare(true)} className="toolbar-btn toolbar-btn-compare">
              ⚖️ Compare ({compareQueue.length})
            </button>
          )}
          <button onClick={() => setCommandPaletteOpen(true)} className="toolbar-btn ml-auto" title="⌘K">
            ⌘K
          </button>
        </div>

        {/* ── mood picker ── */}
        <MoodPicker onSelect={setActiveMood} activeMood={activeMood} />

        {/* ── advanced filters ── */}
        {showFilters && (
          <div className="filters-panel">
            <div className="flex justify-between items-center mb-3">
              <span className="text-light-200 text-sm font-medium">Advanced Filters</span>
              {hasActiveFilters && (
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-xs text-red-400 hover:text-red-300">Reset</button>
              )}
            </div>
            <AdvancedFilters filters={filters} onChange={setFilters} />
          </div>
        )}

        {/* ── original trending section (preserved) ── */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_URL} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── smart recommendations ── */}
        <SmartRecommendations movieList={movieList} onMovieClick={setSelectedMovie} />

        {/* ── original all movies section (preserved, skeleton replaces Spinner) ── */}
        <section className="all-movies">
          <h2>
            {activeMood ? `${activeMood.label} Movies` : searchTerm ? `Results for "${debouncedSearchTerm}"` : 'All Movies'}
          </h2>

          {isLoading ? (
            <SkeletonGrid />
          ) : errorMessage ? (
            <div className="empty-state">
              <p className="text-5xl mb-3">🎬</p>
              <p className="text-red-400">{errorMessage}</p>
            </div>
          ) : movieList.length === 0 ? (
            <div className="empty-state">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-gray-400">No movies found. Try a different search or mood.</p>
            </div>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
              ))}
            </ul>
          )}
        </section>

        {/* ── insights dashboard ── */}
        {showInsights && (
          <div ref={insightsRef}>
            <InsightsDashboard movieList={movieList} />
          </div>
        )}

      </div>

      {/* ── global overlays ── */}
      <MovieModal />
      <WatchlistPanel />
      <ComparePanel />
      <CommandPalette onCommand={handleCommand} />
    </main>
  );
}

export default App;
