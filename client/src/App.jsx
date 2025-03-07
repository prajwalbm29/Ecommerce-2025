import { RouterProvider } from 'react-router-dom'
import router from './router'
import { AuthProvider } from './Context/auth'
import "antd/dist/reset.css";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
