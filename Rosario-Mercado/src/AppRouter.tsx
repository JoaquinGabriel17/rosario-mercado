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
import TicketsAdminView from "./components/support/TicketsAdminView.tsx";
import EditAccount from "./components/account/EditAccount.tsx";
import CreateTicket from "./components/support/CreateTicket.tsx";
import Categories from "./components/Categories.tsx";
import CreateProduct from "./components/products/CreateProduct.tsx";
import UserProducts from "./components/products/UserProducts.tsx";
import EditProducts from "./components/products/EditProducts.tsx";
import DeleteProduct from "./components/products/DeleteProduct.tsx";
/*import { useUserStore } from "./store/userStore.ts";
const user = useUserStore((state) => state.user);*/


const AppRouter = () => {

  

  return (
    <Routes>
      {/* Rutas que usan el layout con Navbar */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        {/* Menú principal */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Soporte - Ayuda */}
        <Route path="/support" element={<Support />} />
        <Route path="/support/tickets" element={<ViewAllTickets />} />
        <Route path="/support/tickets/admin" element={<TicketsAdminView />} />
        <Route path="/support/create" element={<CreateTicket />} />

        {/* Mi tienda - Shop */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />

        {/* Productos */}
        <Route path="/products" element={<ProductDashboard />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/user/:userId" element={<UserProducts />} />
        <Route path="/products/edit/:productId" element={<EditProducts />} />
        <Route path="/products/delete" element={<DeleteProduct />} />
        <Route path="/products/:productId" element={<ProductDetails />} />

        {/* Usuarios - Autenticación */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/user/edit" element={<EditAccount />} />
      </Route>


      {/* Rutas sin Navbar */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/tickets/:ticketId/chat" element={<Chat />} />


      {/* Not found */}
      <Route path="*" element={<h1>Página no encontrada</h1>} />


    </Routes>
  );
};

export default AppRouter;
