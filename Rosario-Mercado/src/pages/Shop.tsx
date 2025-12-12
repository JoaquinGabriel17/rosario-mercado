import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useState } from "react";
import EditAccount from "../components/account/EditAccount";
import Categories from "../components/Categories";

export default function Shop(){

    const [activeView, setActiveView] = useState<"menu" | "editAccount" | "categories">("menu");

    const back = () => setActiveView("menu");

    const user = useUserStore((state) => state.user);
    const navigate = useNavigate()

    return(
        <div className="text-center">
            {activeView === "menu" && (
                <>
            <h2 className="border-t-2 border-b-2 border-[#1E40AF] text-3xl">
                Mi tienda
            </h2>
            <div className="mt-4 flex flex-col items-center px-10"> 
                {user && !user.phoneNumber && !user.businessHours && !user.address &&
                    <h3 className="m-4 border-2 border-red-700 p-2 rounded-xl max-w-2xl"
                    >Para comenzar a vender te recomendamos completar la información adicional de la cuenta. Esto ayudará a los compradores a contactarte mas facilmente.</h3>
                }
                <Button className="min-w-2xs mt-4"
                    onClick={() => setActiveView("editAccount")}
                >Información de la cuenta</Button>

                <Button onClick={() => navigate("/products")}
                className="min-w-2xs mt-4"
                >Mis productos</Button>

                <Button onClick={() => setActiveView("categories")}
                className="min-w-2xs mt-4"
                >Categorías</Button>

                <Button
                onClick={() => navigate("/dashboard")}
            >Menú principal</Button>
            </div>
            </>
            )}

            {activeView === "editAccount" && (
                <>
                    <div className="flex justify-start pl-2">
                        <Button onClick={back}>Volver</Button>
                    </div>
                    <EditAccount></EditAccount>
                </>
            )}
            {activeView === "categories" && (
                <>
                    <div className="flex justify-start pl-2">
                        <Button onClick={back}>Volver</Button>
                    </div>
                    <Categories></Categories>
                </>
            )}
            
        </div>
    )
}