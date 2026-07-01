const SkeletonCard = () => (
  <div className="movie-card animate-pulse">
    <div className="bg-light-100/10 rounded-lg w-full h-64" />
    <div className="mt-4 space-y-2">
      <div className="bg-light-100/10 rounded h-4 w-3/4" />
      <div className="bg-light-100/10 rounded h-3 w-1/2" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </ul>
);

export default SkeletonCard;
