import { useState, useEffect } from 'react';
import { getProduct, getProductsByCategory } from '../services/openFoodFacts';

export default function useProductDetails(barcode) {
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const prod = await getProduct(barcode);
        if (!isActive) return;
        setProduct(prod);
        const category = prod?.categories_tags?.[0];
        if (category) {
          const items = await getProductsByCategory(category, 5);
          if (isActive) setSuggestions(items);
        } else {
          if (isActive) setSuggestions([]);
        }
      } catch (e) {
        if (!isActive) return;
        console.warn(e);
        setError(e);
        setProduct(null);
        setSuggestions([]);
      } finally {
        if (isActive) setLoading(false);
      }
    }
    load();
    return () => {
      isActive = false;
    };
  }, [barcode]);

  return { product, suggestions, loading, error };
}
