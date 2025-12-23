import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";



export default function Dashboard () {
    

    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();



    return(
      <div className="text-center">

        <h2 className="w-full border-t-2 border-b-2 border-[#1E40AF] text-3xl">
          Menú principal
        </h2>


        <div className="items-center  px-20 flex flex-col p-4">
          <Button className="mt-4 py-6 min-w-2xs"
            onClick={() => navigate(`/users/${user?.id}`)}
          >Mi perfil
          </Button>
          <Button className="mt-4 py-6 min-w-2xs"
            onClick={() => navigate("/user/edit")}
          >Editar información de la cuenta</Button>
          
          {/*
                    <Button className="mt-4 py-6 min-w-2xs"
                        onClick={() => setActiveView("purchases")}
                    >Mis compras</Button>
                    */}

          <Button className="mt-4 py-6 min-w-2xs bg-green-600"
            onClick={() => navigate("/shop")}
          >Mi tienda - Empezar a vender</Button>

          <Button
            className="mt-4 py-6 min-w-2xs"
            onClick={() => navigate("/support")}
          >Soporte - Ayuda</Button>
        </div>

        <Button
          className="bg-red-600"
          onClick={() => { logout(); navigate('/') }}
        >Cerrar sesión</Button>



      </div>
    )

}