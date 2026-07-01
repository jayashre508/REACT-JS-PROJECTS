const MOODS = [
  { label: '😂 Laugh', genres: [35] },
  { label: '😱 Thrill', genres: [27, 53] },
  { label: '❤️ Romance', genres: [10749] },
  { label: '🚀 Adventure', genres: [12, 878] },
  { label: '🧠 Think', genres: [9648, 99] },
  { label: '😢 Cry', genres: [18] },
  { label: '💥 Action', genres: [28] },
  { label: '🧒 Family', genres: [16, 10751] },
];

const MoodPicker = ({ onSelect, activeMood }) => (
  <div className="mood-picker">
    <p className="text-light-200 text-sm mb-3">What's your mood?</p>
    <div className="flex flex-wrap gap-2">
      {MOODS.map((mood) => (
        <button
          key={mood.label}
          onClick={() => onSelect(activeMood?.label === mood.label ? null : mood)}
          className={`mood-btn ${activeMood?.label === mood.label ? 'mood-btn-active' : ''}`}
        >
          {mood.label}
        </button>
      ))}
    </div>
  </div>
);

export default MoodPicker;
