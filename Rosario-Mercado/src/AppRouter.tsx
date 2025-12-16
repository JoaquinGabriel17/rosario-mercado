import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import ProductDashboard from "./pages/ProductDashboard.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Shop from "./pages/Shop.tsx";
import ResetPassword from "./components/account/ResetPassword.tsx";
import ForgotPassword from "./components/account/ForgotPassword.tsx";
import Profile from "./components/account/Profile.tsx";
import ProductDetails from "./pages/ProductDetail.tsx";
import Support from "./pages/Support.tsx";
import Chat from "./components/support/Chat.tsx";
import ViewAllTickets from "./components/support/ViewAllTickets.tsx";



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
            <Route path="/users/:id" element={<Profile />} /> 
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/support" element={<Support/>} />
            <Route path="/support/tickets" element={<ViewAllTickets/>}/>
            
        </Route>
        {/* Rutas sin Navbar */}
        <Route path="/forgot-password" element={ <ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/tickets/:ticketId/chat" element={<Chat/>} />


        {/* Not found */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />

        
    </Routes>
  );
};

export default AppRouter;
