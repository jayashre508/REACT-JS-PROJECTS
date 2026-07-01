import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OPTS = { method: 'GET', headers: { accept: 'application/json', Authorization: `Bearer ${API_KEY}` } };

const Bar = ({ value, max, color = 'bg-purple-500' }) => (
  <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
    <div className={`${color} h-1.5 rounded-full`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
  </div>
);

const ComparePanel = () => {
  const { showCompare, setShowCompare, compareQueue, removeFromCompare } = useApp();
  const [details, setDetails] = useState({});

  useEffect(() => {
    compareQueue.forEach((movie) => {
      if (!details[movie.id]) {
        fetch(`${API_BASE_URL}/movie/${movie.id}?append_to_response=credits`, OPTS)
          .then((r) => r.json())
          .then((d) => setDetails((prev) => ({ ...prev, [movie.id]: d })))
          .catch(console.error);
      }
    });
  }, [compareQueue]);

  if (!showCompare || compareQueue.length === 0) return null;

  const movies = compareQueue.map((m) => details[m.id] || m);
  const maxRating = 10;
  const maxPop = Math.max(...movies.map((m) => m.popularity || 0), 1);
  const maxRuntime = Math.max(...movies.map((m) => m.runtime || 0), 1);

  return (
    <div className="panel-overlay" onClick={() => setShowCompare(false)}>
      <div className="compare-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">⚖️ Compare Movies</h2>
          <button onClick={() => setShowCompare(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${movies.length}, 1fr)` }}>
          {movies.map((movie) => (
            <div key={movie.id} className="compare-card">
              <button onClick={() => removeFromCompare(movie.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-400 text-sm">✕</button>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : '/no-movie.png'}
                alt={movie.title}
                className="w-full rounded-lg object-cover mb-3"
              />
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-3">{movie.title}</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-gray-400"><span>Rating</span><span className="text-white font-bold">{movie.vote_average?.toFixed(1) || 'N/A'}</span></div>
                  <Bar value={movie.vote_average || 0} max={maxRating} color="bg-yellow-400" />
                </div>
                <div>
                  <div className="flex justify-between text-gray-400"><span>Popularity</span><span className="text-white font-bold">{Math.round(movie.popularity || 0)}</span></div>
                  <Bar value={movie.popularity || 0} max={maxPop} color="bg-purple-500" />
                </div>
                {movie.runtime > 0 && (
                  <div>
                    <div className="flex justify-between text-gray-400"><span>Runtime</span><span className="text-white font-bold">{movie.runtime} min</span></div>
                    <Bar value={movie.runtime || 0} max={maxRuntime} color="bg-blue-400" />
                  </div>
                )}
                {movie.genres?.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-1">Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.map((g) => <span key={g.id} className="filter-chip text-xs py-0.5">{g.name}</span>)}
                    </div>
                  </div>
                )}
                {movie.release_date && <p className="text-gray-400">📅 {movie.release_date.split('-')[0]}</p>}
                {movie.credits?.cast?.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-1">Top Cast</p>
                    <p className="text-gray-300">{movie.credits.cast.slice(0, 3).map((c) => c.name).join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePanel;
