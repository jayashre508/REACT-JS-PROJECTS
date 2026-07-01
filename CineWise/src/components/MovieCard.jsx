import { useApp } from '../context/AppContext';

const MovieCard = ({ movie, onClick }) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;
  const { toggleWatchlist, toggleFavorite, addToCompare, isInWatchlist, isFavorite, setSelectedMovie } = useApp();

  const inWatchlist = isInWatchlist(movie.id);
  const fav = isFavorite(movie.id);

  const open = () => { if (onClick) onClick(); else setSelectedMovie(movie); };

  return (
    <div className="movie-card group">
      <div className="relative cursor-pointer" onClick={open}>
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
          alt={title}
          className="rounded-lg h-auto w-full"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`card-action-btn ${inWatchlist ? 'text-purple-400' : 'text-white'}`}
          >
            {inWatchlist ? '✓' : '+'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
            title={fav ? 'Unfavorite' : 'Favorite'}
            className="card-action-btn"
          >
            {fav ? '❤️' : '🤍'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addToCompare(movie); }}
            title="Add to Compare"
            className="card-action-btn"
          >
            ⚖️
          </button>
        </div>
      </div>

      <div className="mt-4 cursor-pointer" onClick={open}>
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
          {inWatchlist && <span className="text-purple-400 text-xs ml-auto">✓ List</span>}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
