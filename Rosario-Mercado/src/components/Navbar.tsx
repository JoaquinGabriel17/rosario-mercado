import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../store/userStore";
import { Button } from './ui/Button';

function Navbar() {

    const user = useUserStore((state) => state.user);

    const navigate = useNavigate();

    return (
        <nav className='bg-[#FFFFFF] flex justify-between items-center p-4 text-[#1E293B] border-b-4 border-b-[#2563EB]' >
            <Button
                onClick={() => navigate('/')}
            >Inicio</Button>
            {user ? (
                <Button
                onClick={() => navigate('/dashboard')}
                >
                    Mi cuenta
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