import { RouterProvider } from 'react-router-dom'
import router from './router'
import { AuthProvider } from './Context/auth'
import "antd/dist/reset.css";
import { SearchProvider } from './Context/Search';
import { CategoryProvider } from './hooks/useCategory';
import { CartProvider } from './Context/cart';

function App() {
  return (
    <CategoryProvider>
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </CategoryProvider>
  )
}

export default App
