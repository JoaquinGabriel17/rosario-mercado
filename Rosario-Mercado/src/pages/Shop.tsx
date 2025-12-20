import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function Shop(){


    const user = useUserStore((state) => state.user);
    const navigate = useNavigate()

    return(
        <div className="text-center">
            <h2 className="border-t-2 border-b-2 border-[#1E40AF] text-3xl">
                Mi tienda
            </h2>
            <div className="mt-4 flex flex-col items-center px-10">
                {user && !user.phoneNumber && !user.businessHours && !user.address &&
                    <h3 className="m-4 border-2 border-red-700 p-2 rounded-xl max-w-2xl"
                    >Para comenzar a vender te recomendamos completar la información adicional de la cuenta. Esto ayudará a los compradores a contactarte mas facilmente.</h3>
                }
                <Button className="min-w-2xs mt-4"
                    onClick={() => navigate("/user/edit")}
                >Editar información de la cuenta</Button>

                <Button onClick={() => navigate("/products")}
                    className="min-w-2xs mt-4"
                >Mis productos</Button>

                <Button onClick={() => navigate("/categories")}
                    className="min-w-2xs mt-4"
                >Categorías</Button>

                <Button
                    onClick={() => navigate("/dashboard")}
                >Menú principal</Button>
            </div>
        </div>
    )
}