import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [watchlist, setWatchlist] = useLocalStorage('mdp_watchlist', []);
  const [watched, setWatched] = useLocalStorage('mdp_watched', []);
  const [ratings, setRatings] = useLocalStorage('mdp_ratings', {});
  const [favorites, setFavorites] = useLocalStorage('mdp_favorites', []);
  const [recentSearches, setRecentSearches] = useLocalStorage('mdp_recent_searches', []);
  const [compareQueue, setCompareQueue] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const toggleWatched = (movie) => {
    setWatched((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const rateMovie = (movieId, rating) => {
    setRatings((prev) => ({ ...prev, [movieId]: rating }));
  };

  const addToCompare = (movie) => {
    setCompareQueue((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      if (prev.length >= 3) return [...prev.slice(1), movie];
      return [...prev, movie];
    });
    setShowCompare(true);
  };

  const removeFromCompare = (movieId) => {
    setCompareQueue((prev) => prev.filter((m) => m.id !== movieId));
  };

  const addRecentSearch = (term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== term);
      return [term, ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);
  const isWatched = (id) => watched.some((m) => m.id === id);
  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <AppContext.Provider value={{
      watchlist, watched, ratings, favorites, recentSearches,
      compareQueue, showCompare, setShowCompare,
      showWatchlist, setShowWatchlist,
      selectedMovie, setSelectedMovie,
      commandPaletteOpen, setCommandPaletteOpen,
      toggleWatchlist, toggleWatched, toggleFavorite,
      rateMovie, addToCompare, removeFromCompare,
      addRecentSearch, clearRecentSearches,
      isInWatchlist, isWatched, isFavorite,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
