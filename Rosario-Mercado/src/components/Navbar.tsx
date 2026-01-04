import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../store/userStore";
import { Button } from './ui/Button';
import { useTicketsStore } from '../store/ticketsStore';

function Navbar() {

    const user = useUserStore((state) => state.user);
    const { openTickets } = useTicketsStore();

    const navigate = useNavigate();

    return (
        <nav className='bg-[#FFFFFF] flex justify-between items-center p-4 text-[#1E293B] rounded-b-3xl border-b-2 border-b-blue-600 mb-2' >
            <button
                onClick={() => navigate(-1)}
                className="flex items-center hover:text-gray-900 rounded bg-blue-600 p-4 text-white"
            >
                {/* Flecha SVG */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {/* Texto opcional */}
                <span className="text-sm font-medium">Volver</span>
            </button>
            <h1 className="text-3xl font-bold">Agora</h1>
            {user ? (
                <Button
                    onClick={() => navigate('/dashboard')}
                >
                    {openTickets.length > 0 && user?.role === "admin" ? "Mi cuenta  🚨" : "Mi cuenta"}
                </Button>
            )
                :
                (
                    <Button
                        onClick={() => navigate('/auth')}
                    >Iniciar sesión</Button>
                )
            }


        </nav>
    )
}

export default Navbar;