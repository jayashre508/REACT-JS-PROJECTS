import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

const InsightsDashboard = ({ movieList }) => {
  const { watchlist, watched, ratings, favorites } = useApp();

  const allMovies = useMemo(() => [...new Map([...watchlist, ...watched, ...movieList].map((m) => [m.id, m])).values()], [watchlist, watched, movieList]);

  const genreCounts = useMemo(() => {
    const counts = {};
    allMovies.forEach((m) => {
      (m.genre_ids || []).forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
    });
    return counts;
  }, [allMovies]);

  const GENRE_MAP = { 28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',14:'Fantasy',27:'Horror',9648:'Mystery',10749:'Romance',878:'Sci-Fi',53:'Thriller',10752:'War' };

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, count]) => ({ name: GENRE_MAP[id] || `Genre ${id}`, count }));

  const maxGenreCount = topGenres[0]?.count || 1;

  const ratingBuckets = useMemo(() => {
    const buckets = { '0-4': 0, '4-6': 0, '6-7': 0, '7-8': 0, '8-10': 0 };
    movieList.forEach((m) => {
      const r = m.vote_average || 0;
      if (r < 4) buckets['0-4']++;
      else if (r < 6) buckets['4-6']++;
      else if (r < 7) buckets['6-7']++;
      else if (r < 8) buckets['7-8']++;
      else buckets['8-10']++;
    });
    return buckets;
  }, [movieList]);

  const maxBucket = Math.max(...Object.values(ratingBuckets), 1);

  const userRatedMovies = Object.entries(ratings)
    .map(([id, r]) => ({ movie: allMovies.find((m) => m.id === parseInt(id)), rating: r }))
    .filter((x) => x.movie)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  if (allMovies.length === 0 && movieList.length === 0) return null;

  return (
    <section className="insights-section">
      <h2>📊 Discovery Insights</h2>
      <div className="insights-grid">

        <div className="insight-card">
          <h3 className="insight-title">Trending Genres</h3>
          <div className="space-y-2 mt-3">
            {topGenres.map((g) => (
              <div key={g.name}>
                <div className="flex justify-between text-xs text-gray-400 mb-0.5"><span>{g.name}</span><span>{g.count}</span></div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(g.count / maxGenreCount) * 100}%` }} />
                </div>
              </div>
            ))}
            {topGenres.length === 0 && <p className="text-gray-500 text-sm">Browse movies to see genre trends.</p>}
          </div>
        </div>

        <div className="insight-card">
          <h3 className="insight-title">Rating Distribution</h3>
          <div className="flex items-end gap-2 mt-3 h-24">
            {Object.entries(ratingBuckets).map(([label, count]) => (
              <div key={label} className="flex flex-col items-center flex-1 gap-1">
                <div className="w-full bg-yellow-400/80 rounded-t" style={{ height: `${(count / maxBucket) * 80}px`, minHeight: count > 0 ? '4px' : '0' }} />
                <span className="text-gray-500 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h3 className="insight-title">Your Top Rated</h3>
          {userRatedMovies.length === 0 ? (
            <p className="text-gray-500 text-sm mt-3">Rate movies to see your top picks.</p>
          ) : (
            <div className="space-y-2 mt-3">
              {userRatedMovies.map(({ movie, rating }) => (
                <div key={movie.id} className="flex items-center gap-2">
                  <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w45${movie.poster_path}` : '/no-movie.png'} alt={movie.title} className="w-8 h-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">{movie.title}</p>
                    <p className="text-yellow-400 text-xs">{'★'.repeat(rating)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="insight-card">
          <h3 className="insight-title">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              { label: 'Watchlist', value: watchlist.length, icon: '🎬' },
              { label: 'Watched', value: watched.length, icon: '👁' },
              { label: 'Favorites', value: favorites.length, icon: '❤️' },
              { label: 'Rated', value: Object.keys(ratings).length, icon: '⭐' },
            ].map((s) => (
              <div key={s.label} className="stat-chip">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-white font-bold text-lg">{s.value}</span>
                <span className="text-gray-400 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default InsightsDashboard;
