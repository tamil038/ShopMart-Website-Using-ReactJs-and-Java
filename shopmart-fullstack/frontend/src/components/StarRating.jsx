export default function StarRating({ rating = 0, count = 0, showCount = true }) {
  const rounded = Math.round(rating);
  return (
    <span className="star-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'inline-flex', gap: 1, fontSize: '0.95em' }} aria-label={`${rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ color: i < rounded ? 'var(--sm-yellow-dark)' : 'var(--sm-border)' }}>
            ★
          </span>
        ))}
      </span>
      {showCount && (
        <span style={{ color: 'var(--sm-muted)', fontSize: '0.85em', fontWeight: 600 }}>({count})</span>
      )}
    </span>
  );
}
