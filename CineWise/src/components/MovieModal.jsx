import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OPTS = { method: 'GET', headers: { accept: 'application/json', Authorization: `Bearer ${API_KEY}` } };

const StarRating = ({ movieId }) => {
  const { ratings, rateMovie } = useApp();
  const current = ratings[movieId] || 0;
  return (
    <div className="flex gap-1 mt-2">
      {[1,2,3,4,5].map((s) => (
        <button key={s} onClick={() => rateMovie(movieId, s)} className={`text-xl ${s <= current ? 'text-yellow-400' : 'text-gray-600'}`}>★</button>
      ))}
      {current > 0 && <span className="text-gray-400 text-sm ml-1">({current}/5)</span>}
    </div>
  );
};

const MovieModal = () => {
  const { selectedMovie, setSelectedMovie, toggleWatchlist, toggleWatched, toggleFavorite, addToCompare, isInWatchlist, isWatched, isFavorite } = useApp();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!selectedMovie) { setDetails(null); return; }
    fetch(`${API_BASE_URL}/movie/${selectedMovie.id}?append_to_response=credits`, OPTS)
      .then((r) => r.json())
      .then(setDetails)
      .catch(console.error);
  }, [selectedMovie]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelectedMovie(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSelectedMovie]);

  if (!selectedMovie) return null;

  const movie = details || selectedMovie;
  const cast = details?.credits?.cast?.slice(0, 6) || [];
  const genres = details?.genres || [];
  const runtime = details?.runtime;
  const inWatchlist = isInWatchlist(selectedMovie.id);
  const watched = isWatched(selectedMovie.id);
  const fav = isFavorite(selectedMovie.id);

  return (
    <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setSelectedMovie(null)}>✕</button>

        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : '/no-movie.png'}
            alt={movie.title}
            className="w-full sm:w-48 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-2xl font-bold">{movie.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {genres.map((g) => <span key={g.id} className="filter-chip">{g.name}</span>)}
            </div>
            <div className="flex gap-4 mt-3 text-gray-400 text-sm flex-wrap">
              {movie.release_date && <span>📅 {movie.release_date.split('-')[0]}</span>}
              {runtime && <span>⏱ {runtime} min</span>}
              {movie.vote_average && <span>⭐ {movie.vote_average.toFixed(1)}</span>}
              {movie.vote_count && <span>🗳 {movie.vote_count.toLocaleString()} votes</span>}
            </div>
            <p className="text-gray-300 text-sm mt-3 leading-relaxed line-clamp-4">{movie.overview}</p>
            <StarRating movieId={selectedMovie.id} />

            {cast.length > 0 && (
              <div className="mt-3">
                <p className="text-light-200 text-xs uppercase tracking-wider mb-1">Cast</p>
                <p className="text-gray-300 text-sm">{cast.map((c) => c.name).join(', ')}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => toggleWatchlist(selectedMovie)} className={`action-btn ${inWatchlist ? 'action-btn-active' : ''}`}>
                {inWatchlist ? '✓ Watchlist' : '+ Watchlist'}
              </button>
              <button onClick={() => toggleWatched(selectedMovie)} className={`action-btn ${watched ? 'action-btn-active' : ''}`}>
                {watched ? '👁 Watched' : '👁 Mark Watched'}
              </button>
              <button onClick={() => toggleFavorite(selectedMovie)} className={`action-btn ${fav ? 'action-btn-fav' : ''}`}>
                {fav ? '❤️ Favorited' : '🤍 Favorite'}
              </button>
              <button onClick={() => { addToCompare(selectedMovie); setSelectedMovie(null); }} className="action-btn">
                ⚖️ Compare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
