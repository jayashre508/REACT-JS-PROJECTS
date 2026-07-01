import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const COMMANDS = [
  { id: 'watchlist', label: '🎬 Open Watchlist', keys: ['W'] },
  { id: 'compare', label: '⚖️ Open Compare', keys: ['C'] },
  { id: 'insights', label: '📊 Scroll to Insights', keys: [] },
  { id: 'top', label: '⬆️ Scroll to Top', keys: [] },
];

const CommandPalette = ({ onCommand }) => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (commandPaletteOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen((v) => !v); }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const run = (id) => { setCommandPaletteOpen(false); onCommand(id); };

  return (
    <div className="modal-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="command-input"
          onKeyDown={(e) => { if (e.key === 'Enter' && filtered.length > 0) run(filtered[0].id); }}
        />
        <ul className="mt-2">
          {filtered.map((cmd) => (
            <li key={cmd.id}>
              <button onClick={() => run(cmd.id)} className="command-item">
                <span>{cmd.label}</span>
                {cmd.keys.length > 0 && <kbd className="command-kbd">{cmd.keys.join('+')}</kbd>}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-gray-600 text-xs mt-3 text-center">⌘K to open · Esc to close</p>
      </div>
    </div>
  );
};

export default CommandPalette;
