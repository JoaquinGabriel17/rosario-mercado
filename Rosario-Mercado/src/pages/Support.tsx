import { useUserStore } from "../store/userStore";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTicketsStore } from "../store/ticketsStore";

export default function Support(){

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { openTickets } = useTicketsStore();

    
    
      return (
        <div className="">    
            <div className="flex flex-col items-center">
              
                <h1 className="text-3xl m-6">Soporte - Asistencia</h1>
                <Button
                    className=""
                    onClick={() => navigate("/support/create")}    
                >Abrir una nueva solicitud</Button>
                <Button
                    onClick={() => navigate("/support/tickets")}
                >Ver todos mis tickets</Button>
                {user?.role === "admin" && 
                <Button 
                  onClick={() => navigate("/support/tickets/admin")}
                >{openTickets.length > 0 && user?.role === "admin" ?  "Ver todos los tickets 🚨" : "Ver todos los tickets"}</Button>
                }
            </div>

        </div>
      );
    }