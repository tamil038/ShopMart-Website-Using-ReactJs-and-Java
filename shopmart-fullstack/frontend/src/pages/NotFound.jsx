import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="center container">
      <div className="art">🛍️</div>
      <h1>404</h1>
      <p>This page must have sold out.</p>
      <Link to="/home" className="btn btn-primary">
        Back to Home
      </Link>
    </main>
  );
}
