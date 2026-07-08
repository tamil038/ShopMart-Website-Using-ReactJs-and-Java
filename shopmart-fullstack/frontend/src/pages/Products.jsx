import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Fitness', 'Beauty'];

export default function Products() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const term = searchParams.get('term') || '';
  const sort = searchParams.get('sort') || 'relevance';

  const [termInput, setTermInput] = useState(term);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .getProducts({ category, term, sort })
      .then(setResults)
      .catch((err) => {
        setResults([]);
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  }, [category, term, sort, toast]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setTermInput(term);
  }, [term]);

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value && value !== 'All') next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  }

  // debounce the free-text search input
  useEffect(() => {
    const t = setTimeout(() => {
      if (termInput !== term) updateParams({ term: termInput });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termInput]);

  function reset() {
    setSearchParams({});
  }

  return (
    <main className="page container">
      <div className="page-head">
        <h1>Explore the Collection</h1>
        <p>
          {loading ? 'Searching…' : `${results.length} product${results.length === 1 ? '' : 's'} found`}
        </p>
      </div>

      <div className="toolbar">
        <div className="search">
          <span aria-hidden="true">🔎</span>
          <input
            type="search"
            placeholder="Search products, categories..."
            value={termInput}
            onChange={(e) => setTermInput(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} aria-label="Sort products">
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? 'active' : ''}`}
            onClick={() => updateParams({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="empty card">
          <p>No products match your search.</p>
          <button className="btn btn-outline" onClick={reset}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
