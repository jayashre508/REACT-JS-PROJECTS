import { useState } from 'react';
import { useApp } from '../context/AppContext';

const TABS = ['Watchlist', 'Watched', 'Favorites'];

const MovieRow = ({ movie, onOpen, onRemove, rating }) => (
  <div className="flex items-center gap-3 py-2 border-b border-white/5">
    <img
      src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : '/no-movie.png'}
      alt={movie.title}
      className="w-10 h-14 rounded object-cover flex-shrink-0 cursor-pointer"
      onClick={() => onOpen(movie)}
    />
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium truncate cursor-pointer hover:text-purple-300" onClick={() => onOpen(movie)}>{movie.title}</p>
      <p className="text-gray-400 text-xs">{movie.release_date?.split('-')[0]}</p>
      {rating && <p className="text-yellow-400 text-xs">{'★'.repeat(rating)}</p>}
    </div>
    <button onClick={() => onRemove(movie)} className="text-gray-600 hover:text-red-400 text-lg flex-shrink-0">✕</button>
  </div>
);

const WatchlistPanel = () => {
  const { showWatchlist, setShowWatchlist, watchlist, watched, favorites, toggleWatchlist, toggleWatched, toggleFavorite, ratings, setSelectedMovie } = useApp();
  const [tab, setTab] = useState('Watchlist');

  if (!showWatchlist) return null;

  const lists = { Watchlist: watchlist, Watched: watched, Favorites: favorites };
  const removers = { Watchlist: toggleWatchlist, Watched: toggleWatched, Favorites: toggleFavorite };
  const current = lists[tab];

  return (
    <div className="panel-overlay" onClick={() => setShowWatchlist(false)}>
      <div className="panel-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">My Movies</h2>
          <button onClick={() => setShowWatchlist(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex gap-1 mb-4">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'tab-btn-active' : ''}`}>
              {t} <span className="text-xs opacity-60">({lists[t].length})</span>
            </button>
          ))}
        </div>

        {current.length === 0 ? (
          <div className="empty-state">
            <p className="text-4xl mb-2">{tab === 'Watchlist' ? '🎬' : tab === 'Watched' ? '👁' : '❤️'}</p>
            <p className="text-gray-400 text-sm">No movies here yet.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] pr-1">
            {current.map((movie) => (
              <MovieRow
                key={movie.id}
                movie={movie}
                rating={ratings[movie.id]}
                onOpen={(m) => { setSelectedMovie(m); setShowWatchlist(false); }}
                onRemove={removers[tab]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPanel;
