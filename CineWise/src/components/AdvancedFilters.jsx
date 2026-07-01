const GENRES = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' }, { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' }, { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' },
];

const AdvancedFilters = ({ filters, onChange }) => {
  const toggle = (id) => {
    const genres = filters.genres.includes(id)
      ? filters.genres.filter((g) => g !== id)
      : [...filters.genres, id];
    onChange({ ...filters, genres });
  };

  return (
    <div className="advanced-filters">
      <div className="flex flex-wrap gap-2 mb-4">
        {GENRES.map((g) => (
          <button
            key={g.id}
            onClick={() => toggle(g.id)}
            className={`filter-chip ${filters.genres.includes(g.id) ? 'filter-chip-active' : ''}`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 items-center">
        <label className="filter-label">
          From
          <input
            type="number" min="1900" max="2025"
            value={filters.yearFrom}
            onChange={(e) => onChange({ ...filters, yearFrom: e.target.value })}
            className="filter-input w-24"
          />
        </label>
        <label className="filter-label">
          To
          <input
            type="number" min="1900" max="2025"
            value={filters.yearTo}
            onChange={(e) => onChange({ ...filters, yearTo: e.target.value })}
            className="filter-input w-24"
          />
        </label>
        <label className="filter-label">
          Min Rating
          <input
            type="number" min="0" max="10" step="0.5"
            value={filters.minRating}
            onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
            className="filter-input w-20"
          />
        </label>
        <label className="filter-label">
          Sort By
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            className="filter-input"
          >
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default AdvancedFilters;
