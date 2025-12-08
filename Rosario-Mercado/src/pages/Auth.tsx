import Login from "../components/Login";
import Register from "../components/Register";
import { useState } from "react";

function Auth(){

    const [isLogin, setIsLogin] = useState(true);

    return(
        <div className="text-[#1E293B] w-full flex justify-center mt-10 flex-col items-center">
            <div className="w-full p-6 flex flex-row justify-center items-center ">
            
            <button
                onClick={() => setIsLogin(true)}
                className={ isLogin ? "w-1/2 border-r-2 border-[#2563EB] border-2 rounded p-2"
                    : "w-1/2 border-gray-300 border-2 rounded p-2"
                }
            >Iniciar sesión</button>
            <button 
                onClick={() => setIsLogin(false)}
                className={ isLogin ? "w-1/2 border-gray-300 border-2 rounded p-2"
                    : "w-1/2 border-r-2 border-[#2563EB] border-2 rounded p-2"
                }
            >Crear cuenta</button>
            </div>
            {isLogin ? <Login /> : <Register />}
        </div>
    );
}

export default Auth;