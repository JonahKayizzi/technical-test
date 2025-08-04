import ProtectedRoute from '@/screens/auth/protected-route.page';
import ProductListPage from '@/screens/products/product-list.page';

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductListPage />
    </ProtectedRoute>
  );
}
