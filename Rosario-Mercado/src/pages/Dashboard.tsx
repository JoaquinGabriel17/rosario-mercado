import { useState } from "react";
import CreateProduct from "../components/products/CreateProduct";
import UserProducts from "../components/products/UserProducts";
import { useUserStore } from "../store/userStore";
import EditProducts from "../components/products/EditProducts";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [activeView, setActiveView] = useState<"menu" | "create" | "view" | "edit" | "delete" >("menu");
  const [ productIdToEdit, setProductIdToEdit ] = useState<string>('')

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();


  const back = () => setActiveView("menu");

  const changeViewToEdit = (productId: string) => {
    setProductIdToEdit(productId)
    setActiveView("edit");
  };


  return (
    <div className="text-center">

      {/* ---------- MENU PRINCIPAL ---------- */}
      {activeView === "menu" && (
        <>
          <h2 className="w-full border-t-2 border-b-2 border-[#1E40AF] text-3xl">
            Productos
          </h2>

          <div className="flex flex-col p-4">
            {/* Mapeamos botones para no repetir código */}
            {[
              { label: "➕ Crear producto", view: "create" },
              { label: "📦 Ver productos", view: "view" },
              { label: "✏️ Editar producto", view: "view" },
              { label: "🗑️ Eliminar producto", view: "delete" },
            ].map((btn) => (
              <button
                key={btn.label}
                className="mt-4 px-6 py-4 rounded-lg bg-blue-600 text-white font-medium active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => setActiveView(btn.view as any)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ---------- CREAR PRODUCTO ---------- */}
      {activeView === "create" && (
        <>
          <button className="m-1 px-6 py-2 rounded-lg bg-blue-600 text-white"
            onClick={back}>
            Volver
          </button>

          <CreateProduct />
        </>
      )}

      {/* Aquí en el futuro agregar los otros componentes */}
      {activeView === "view" && user && (
        <>
          <Button onClick={back}>Volver</Button>
          <UserProducts userId={user.id} onChangeViewToEdit={changeViewToEdit}></UserProducts> 
        </>
      )}
      {activeView === "edit" && user &&(
        <>
          <Button onClick={back}>Volver</Button>
          <EditProducts productId={productIdToEdit} onBack={back}></EditProducts>
        </>
        )}
      {activeView === "delete" && user && (
        <>
          <Button onClick={back}>Volver</Button>
        </>
      )}
      <Button onClick={() => {logout(); navigate('/')}}>Cerrar sesión</Button>
    </div>
  );
}

export default Dashboard;
