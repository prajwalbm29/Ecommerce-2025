import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import About from './pages/About';
import LoginPage from './pages/Auth/LoginPage';
import Pagenotfound from './pages/Pagenotfound';
import Policy from './pages/Policy';
import Category from './pages/Category';
import Register from './pages/Auth/Register';

const router = createBrowserRouter([
    {
        path:'/login',
        element: <LoginPage />,
        errorElement: <Pagenotfound />
    },
    {
        path: '/register',
        element: <Register />,
        errorElement: <Pagenotfound />
    },
    {
        path: 'policy',
        element: <Policy />,
        errorElement: <Pagenotfound />
    },
    {
        path: "*",
        element: <Pagenotfound />
    },
    {
        path: '/',
        element: <HomePage />,
        errorElement: <Pagenotfound />
    },
    {
        path: '/about',
        element: <About />,
        errorElement: <Pagenotfound />
    },
    {
        path: '/contact',
        element: <Contact />,
        errorElement: <Pagenotfound />
    },
    {
        path: '/category',
        element: <Category />,
        errorElement: <Pagenotfound />
    },
])

export default router;