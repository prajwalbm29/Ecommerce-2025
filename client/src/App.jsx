import { RouterProvider } from 'react-router-dom'
import router from './router'
import { AuthProvider } from './Context/auth'
import "antd/dist/reset.css";
import { SearchProvider } from './Context/Search';
import { CategoryProvider } from './hooks/useCategory';

function App() {
  return (
    <CategoryProvider>
      <AuthProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </AuthProvider>
    </CategoryProvider>
  )
}

export default App
