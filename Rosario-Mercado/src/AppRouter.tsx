import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MainLayout from "./layouts/MainLayout";

const AppRouter = () => {
  return (
    <Routes>
        {/* Rutas que usan el layout con Navbar */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
        </Route>
        {/* Rutas sin Navbar */}


        {/* Not found */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />

        
    </Routes>
  );
};

export default AppRouter;
