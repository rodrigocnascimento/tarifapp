export async function getProduct(barcode) {
  const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const json = await res.json();
  return json.product;
}

export async function getProductsByCategory(category, limit = 5) {
  const res = await fetch(`https://world.openfoodfacts.org/category/${category}.json`);
  if (!res.ok) throw new Error('Failed to fetch category');
  const json = await res.json();
  return json.products?.slice(0, limit) || [];
}
