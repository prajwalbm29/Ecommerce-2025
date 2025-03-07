import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import About from './pages/About';
import LoginPage from './pages/Auth/LoginPage';
import Pagenotfound from './pages/Pagenotfound';
import Policy from './pages/Policy';
import Category from './pages/Category';
import Register from './pages/Auth/Register';
import Dashboard from './pages/User/Dashboard';
import PrivateRoute from './components/Routes/Pivate';
import ForgotPasssword from './pages/Auth/ForgotPassword';
import AdminRoute from './components/Routes/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateCategory from './pages/Admin/CreateCategory';
import CreateProducts from './pages/Admin/CreateProducts';
import Users from './pages/Admin/Users';
import Profile from './pages/User/Profile';
import Orders from './pages/User/Orderes';
import Products from './pages/Admin/Products';

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
    {
        path: '/dashboard',
        element: <PrivateRoute />,
        children: [
            {
                path: "user",
                element: <Dashboard />
            },
            {
                path: "user/profile",
                element: <Profile />
            },
            {
                path: "user/orders",
                element: <Orders />
            }
        ]        
    },
    {
        path: '/dashboard',
        element: <AdminRoute />,
        children: [
            {
                path: "admin",
                element: <AdminDashboard />
            },
            {
                path: "admin/create-category",
                element: <CreateCategory />
            },
            {
                path: "admin/create-product",
                element: <CreateProducts />
            },
            {
                path: "admin/users",
                element: <Users />
            },
            {
                path: "admin/products",
                element: <Products />
            }
        ]        
    },
    {
        path: '/forgot-password',
        element: <ForgotPasssword />,
        errorElement: <Pagenotfound />
    }
])

export default router;