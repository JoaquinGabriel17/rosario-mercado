import { useState } from "react";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import EditAccount from "../components/account/EditAccount";
import Purchases from "../components/account/Purchases";
import Support from "../components/Support";

export default function Dashboard () {
    
    const [activeView, setActiveView] = useState<"menu" | "purchases" | "accountInfo" | "support" >("menu");

    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();


    const back = () => setActiveView("menu");



    return(
        <div className="text-center">
        
              {/* ---------- MENU PRINCIPAL ---------- */}
              {activeView === "menu" && (
                <>
                  <h2 className="w-full border-t-2 border-b-2 border-[#1E40AF] text-3xl">
                    Menú principal
                  </h2>

        
                  <div className="items-center  px-20 flex flex-col p-4">
                    <Button className="mt-4 py-6 min-w-2xs"
                        onClick={() => setActiveView("accountInfo")}
                    >Editar información de la cuenta</Button>
                  {/*
                    <Button className="mt-4 py-6 min-w-2xs"
                        onClick={() => setActiveView("purchases")}
                    >Mis compras</Button>
                    */}

                    <Button className="mt-4 py-6 min-w-2xs"
                        onClick={() => navigate("/shop")}
                    >Mi tienda - Empezar a vender</Button>

                    <Button 
                        className="mt-4 py-6 min-w-2xs"
                        onClick={() => setActiveView("support")}    
                    >Soporte - Ayuda</Button>
                    </div>

                  <Button 
                    className="bg-red-600"
                    onClick={() => {logout(); navigate('/')}}
                  >Cerrar sesión</Button>

                </>
              )}
        
              
        
              {/* Aquí en el futuro agregar los otros componentes */}
              {activeView === "accountInfo" && user && (
          <>
            <div className="flex justify-start pl-2">
              <Button onClick={back}>Volver</Button>
            </div>
            <EditAccount />
          </>
        )}
        {activeView === "purchases" && user && (
          <>
            <div className="flex justify-start pl-2">
              <Button onClick={back}>Volver</Button>
            </div>
            <Purchases />
          </>
        )}
        {activeView === "support" && user && (
          <>
            <div className="flex justify-start pl-2">
              <Button onClick={back}>Volver</Button>
            </div>
            <Support />
          </>
        )}
      </div>
    )

}