import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MovieCard from './MovieCard';

const SmartRecommendations = ({ movieList, onMovieClick }) => {
  const { watchlist, watched, ratings, favorites } = useApp();

  const seenIds = useMemo(() => new Set([...watchlist, ...watched, ...favorites].map((m) => m.id)), [watchlist, watched, favorites]);

  const favoriteGenres = useMemo(() => {
    const counts = {};
    const sources = [...watchlist, ...favorites];
    // Boost genres from highly-rated movies
    Object.entries(ratings).forEach(([id, r]) => {
      if (r >= 4) {
        const movie = movieList.find((m) => m.id === parseInt(id));
        if (movie) sources.push(movie);
      }
    });
    sources.forEach((m) => (m.genre_ids || []).forEach((g) => { counts[g] = (counts[g] || 0) + 1; }));
    return counts;
  }, [watchlist, favorites, ratings, movieList]);

  const recommended = useMemo(() => {
    if (Object.keys(favoriteGenres).length === 0) return [];
    return movieList
      .filter((m) => !seenIds.has(m.id))
      .map((m) => ({
        ...m,
        score: (m.genre_ids || []).reduce((acc, g) => acc + (favoriteGenres[g] || 0), 0) + (m.vote_average || 0) * 0.5,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [movieList, seenIds, favoriteGenres]);

  if (recommended.length === 0) return null;

  return (
    <section className="all-movies">
      <h2>✨ Recommended For You</h2>
      <ul>
        {recommended.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
        ))}
      </ul>
    </section>
  );
};

export default SmartRecommendations;
