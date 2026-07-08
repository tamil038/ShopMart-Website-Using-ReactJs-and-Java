import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function LoaderBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [location]);

  if (!loading) return null;

  return (
    <div className="flight-bar" aria-hidden="true">
      <div className="track"></div>
      <div className="spark">✦</div>
    </div>
  );
}
