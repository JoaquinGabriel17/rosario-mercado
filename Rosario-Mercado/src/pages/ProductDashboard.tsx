import { useState } from "react";
import CreateProduct from "../components/products/CreateProduct";
import UserProducts from "../components/products/UserProducts";
import { useUserStore } from "../store/userStore";
import EditProducts from "../components/products/EditProducts";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

function ProductDashboard() {
  const [activeView, setActiveView] = useState<"menu" | "create" | "view" | "edit" | "delete" >("menu");
  const [ productIdToEdit, setProductIdToEdit ] = useState<string>('')

  const user = useUserStore((state) => state.user);
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
              <Button
                key={btn.label}
                className={btn.view === "delete" ? "bg-red-700 mt-4" : 
                "mt-4 px-6 py-4 rounded-lg bg-blue-600 text-white font-medium active:scale-95 transition-all duration-150 shadow-sm"}
                onClick={() => setActiveView(btn.view as any)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
          <Button onClick={() => navigate('/shop')} >Volver al menú de mi tienda</Button>          
        </>
      )}

      {/* ---------- CREAR PRODUCTO ---------- */}
      {activeView === "create" && (
        <>
          <Button className="m-1 px-6 py-2 rounded-lg bg-blue-600 text-white"
            onClick={back}>
            Volver
          </Button>

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
    </div>
  );
}

export default ProductDashboard;
