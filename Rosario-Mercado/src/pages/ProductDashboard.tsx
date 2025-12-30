import { useUserStore } from "../store/userStore";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

function ProductDashboard() {

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2 className="w-full border-t-2 border-b-2 border-[#1E40AF] text-3xl">
            Productos
      </h2>
      <div className="flex flex-col p-4">
        <Button onClick={() => navigate('/products/create')}>➕ Crear producto</Button>
        <Button onClick={() => navigate(`/products/user/${user?.id}`)}>📦 Ver productos</Button>
        <Button onClick={() => navigate(`/products/user/${user?.id}`)}>✏️ Editar producto</Button>
        <Button className="bg-red-700" onClick={() => navigate('/products/delete')}>🗑️ Eliminar producto</Button>
      </div>
    </div>
  );
}

export default ProductDashboard;
