interface Product {
  id: string;
  name: string;
  amount: number;
  comment?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for Netlify compatibility
let productsStorage: Product[] = [];

export async function readProducts(): Promise<Product[]> {
  return productsStorage;
}

export async function writeProducts(products: Product[]): Promise<void> {
  productsStorage = products;
}

export async function getUserProducts(userId: string): Promise<Product[]> {
  const products = await readProducts();
  return products.filter(product => product.userId === userId);
}

export async function addProduct(product: Product): Promise<Product> {
  const products = await readProducts();
  products.push(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await readProducts();
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeProducts(products);
  return products[index];
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const products = await readProducts();
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) return false;

  products.splice(index, 1);
  await writeProducts(products);
  return true;
}

export async function reorderProducts(
  userId: string,
  productIds: string[]
): Promise<boolean> {
  const products = await readProducts();
  const userProducts = products.filter(p => p.userId === userId);

  const validProductIds = userProducts.map(p => p.id);
  const allValid = productIds.every(id => validProductIds.includes(id));

  if (!allValid) {
    return false;
  }

  const reorderedProducts = productIds
    .map(id => userProducts.find(p => p.id === id))
    .filter((product): product is Product => product !== undefined);

  const otherProducts = products.filter(p => p.userId !== userId);
  const newProducts = [...otherProducts, ...reorderedProducts];

  await writeProducts(newProducts);
  return true;
}
