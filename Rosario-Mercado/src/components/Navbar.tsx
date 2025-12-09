import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../store/userStore";

function Navbar() {

    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);

    const navigate = useNavigate();

    return (
        <nav className='bg-[#FFFFFF] flex justify-between items-center p-4 text-[#1E293B] border-b-4 border-b-[#2563EB]' >
            <h2 className='text-2xl'>Rosario Mercado</h2>
            {user ? (
                <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium 
active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => navigate('/dashboard')}
                >
                    Mi cuenta
                </button>
            )
            :
            (
                <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium 
active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => navigate('/auth')}
            >Iniciar sesión</button>
            )
        }
            
            <button
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium 
active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => navigate('/')}
            >Inicio</button>
        </nav>
    )
}

export default Navbar;