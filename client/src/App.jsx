import { RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import router from './router'

function App() {
  return <RouterProvider router={router} />
}

export default App
