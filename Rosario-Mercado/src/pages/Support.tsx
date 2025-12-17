import { useState } from "react";
import { useUserStore } from "../store/userStore";
import { Button } from "../components/ui/Button";
import CreateTicket from "../components/support/CreateTicket";
import { useNavigate, useParams } from "react-router-dom";

export default function Support(){

    const [activeView, setActiveView] = useState<"menu" | "create" | "view" >("menu");
    const { view } = useParams<{ view: "create" | "view" }>();
    if(view) setActiveView(view)
    const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

      const back = () => setActiveView("menu");
    
    
      return (
        <div className="text-center">
            
    
          {/* ---------- MENU PRINCIPAL ---------- */}
          {activeView === "menu" && (
            <div className="flex flex-col items-center">
                <h1 className="text-3xl m-6">Soporte - Asistencia</h1>
                <Button
                    className=""
                    onClick={() => setActiveView("create")}    
                >Abrir una nueva solicitud</Button>
                <Button
                    onClick={() => navigate("/support/tickets")}
                >Ver todos mis tickets</Button>
                {user?.role === "admin" && 
                <Button 
                  onClick={() => navigate("/support/tickets/admin")}
                >Ver todos los tickets</Button>
                }
            </div>
          )}
    
          {/* ---------- CREAR Ticket ---------- */}
          {activeView === "create" && (
            <>
              <div className="flex justify-start pl-2">
                <Button onClick={back}>Volver</Button>
              </div>
    
              <CreateTicket />
            </>
          )}
    
        </div>
      );
    }