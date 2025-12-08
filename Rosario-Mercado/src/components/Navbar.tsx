import { useNavigate } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

    return (
        <nav className='bg-red-500'>
            <h2>Rosario Mercado</h2>
            <button
                onClick={() => navigate('/auth')}
            >Iniciar sesión</button>
            <button
                onClick={() => navigate('/')}
            >Inicio</button>
        </nav>
    )
}

export default Navbar;