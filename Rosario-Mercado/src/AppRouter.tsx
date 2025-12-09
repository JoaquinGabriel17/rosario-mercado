import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard.tsx";

const AppRouter = () => {
  return (
    <Routes>
        {/* Rutas que usan el layout con Navbar */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* Rutas sin Navbar */}


        {/* Not found */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />

        
    </Routes>
  );
};

export default AppRouter;
