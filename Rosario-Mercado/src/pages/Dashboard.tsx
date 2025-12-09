import { useState } from "react";
import CreateProduct from "../components/CreateProduct";

function Dashboard() {
  const [activeView, setActiveView] = useState<"menu" | "create" | "view" | "edit" | "delete">("menu");

  const back = () => setActiveView("menu");

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
              { label: "✏️ Editar producto", view: "edit" },
              { label: "🗑️ Eliminar producto", view: "delete" },
            ].map((btn) => (
              <button
                key={btn.view}
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

      {/* Aquí en el futuro agregás los otros componentes */}
      {activeView === "view" && <div>Ver productos (componente)</div>}
      {activeView === "edit" && <div>Editar productos (componente)</div>}
      {activeView === "delete" && <div>Eliminar productos (componente)</div>}
    </div>
  );
}

export default Dashboard;
