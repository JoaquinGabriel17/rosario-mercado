import { useNavigate } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    return (
        <nav className='bg-[#FFFFFF] flex justify-between items-center p-4 text-[#1E293B] border-b-4 border-b-[#2563EB]' >
            <h2>Rosario Mercado</h2>
            <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => navigate('/auth')}
            >Iniciar sesión</button>
            <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => navigate('/')}
            >Inicio</button>
        </nav>
    )
}

export default Navbar;