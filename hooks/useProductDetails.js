import { useState, useEffect } from 'react';
import { getProduct, getProductsByCategory } from '../services/openFoodFacts';

export default function useProductDetails(barcode) {
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let isActive = true;
    async function load() {
      try {
        const prod = await getProduct(barcode);
        if (!isActive) return;
        setProduct(prod);
        const category = prod?.categories_tags?.[0];
        if (category) {
          const items = await getProductsByCategory(category, 5);
          if (isActive) setSuggestions(items);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    load();
    return () => {
      isActive = false;
    };
  }, [barcode]);

  return { product, suggestions };
}
