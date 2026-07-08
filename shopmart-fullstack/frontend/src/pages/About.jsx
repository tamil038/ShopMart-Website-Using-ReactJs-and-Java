export default function About() {
  return (
    <main className="page container">
      <h1>About ShopMart</h1>
      <div className="hero-card">
        <p className="lead">
          Founded in 2026, ShopMart exists for one simple reason: shopping should feel easy, honest, and
          genuinely rewarding — not like a chore.
        </p>
      </div>
      <div className="grid">
        <div className="card">
          <span className="icon">⚡</span>
          <h3>Fast by design</h3>
          <p>From browsing to doorstep, we cut every unnecessary step so orders land quicker.</p>
        </div>
        <div className="card">
          <span className="icon">🎯</span>
          <h3>Curated, not cluttered</h3>
          <p>Every product on ShopMart is picked for quality — we'd rather stock less and stock well.</p>
        </div>
        <div className="card">
          <span className="icon">🤝</span>
          <h3>Built on trust</h3>
          <p>Transparent pricing, honest reviews, and easy 7-day returns on everything we sell.</p>
        </div>
      </div>
    </main>
  );
}
