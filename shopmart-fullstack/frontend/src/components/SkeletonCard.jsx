export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-thumb" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line w-40" />
        <div className="skeleton skeleton-line w-90" />
        <div className="skeleton skeleton-line w-60" />
      </div>
    </div>
  );
}
