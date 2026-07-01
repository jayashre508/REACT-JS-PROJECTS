import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const Search = ({ searchTerm, setSearchTerm }) => {
  const { recentSearches, clearRecentSearches } = useApp();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const showRecent = focused && !searchTerm && recentSearches.length > 0;

  return (
    <div className="search" style={{ position: 'relative' }}>
      <div>
        <img src="search.svg" alt="search" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-3 text-gray-400 hover:text-white text-lg">✕</button>
        )}
      </div>

      {showRecent && (
        <div className="recent-dropdown">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Recent Searches</span>
            <button onClick={clearRecentSearches} className="text-gray-500 hover:text-red-400 text-xs">Clear</button>
          </div>
          {recentSearches.map((s) => (
            <button
              key={s}
              onClick={() => { setSearchTerm(s); inputRef.current?.focus(); }}
              className="recent-item"
            >
              🕐 {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
