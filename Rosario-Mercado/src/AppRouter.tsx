import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import ProductDashboard from "./pages/ProductDashboard.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Shop from "./pages/Shop.tsx";
import ResetPassword from "./components/account/ResetPassword.tsx";
import ForgotPassword from "./components/account/ForgotPassword.tsx";

const AppRouter = () => {
  return (
    <Routes>
        {/* Rutas que usan el layout con Navbar */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products" element={<ProductDashboard />} />
        </Route>
        {/* Rutas sin Navbar */}
        <Route path="/forgot-password" element={ <ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>


        {/* Not found */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />

        
    </Routes>
  );
};

export default AppRouter;
