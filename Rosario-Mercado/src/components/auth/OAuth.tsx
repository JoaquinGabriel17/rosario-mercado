import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

const backendURL = import.meta.env.VITE_BACKEND_URL

const OAuth: React.FC = () => {

    const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const user = useUserStore((state) => state.user);
  

  // Usamos useRef para evitar doble llamada en React.StrictMode
  const processedRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('STATE'); // validar que coincida con el que enviaste

    if(state !== "pasando-me-la-me-huevos") {
        setStatus('error');
        return;
    }

    if (code && !processedRef.current) {
      processedRef.current = true;
      linkAccount(code);
    } else if (!code) {
      setStatus('error');
    }
  }, [searchParams]);

  const linkAccount = async (code: string) => {
    try {
      // Llamada a TU backend
      await axios.post(`${backendURL}/users/linkMP`, {
        code,
      },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          },
        });
      
      setStatus('success');
      // Redirigir después de unos segundos
      setTimeout(() => navigate('/dashboard'), 3000);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

   return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Vinculando tu cuenta...</h2>
            <p className="text-gray-500">Por favor espera un momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800">¡Éxito!</h2>
            <p className="text-gray-600 mt-2">Tu cuenta ha sido vinculada correctamente.</p>
            <p className="text-sm text-gray-400 mt-4">Redirigiendo...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-gray-800">Algo salió mal</h2>
            <p className="text-gray-600 mt-2">No pudimos vincular tu cuenta. Intenta nuevamente.</p>
            <button 
              onClick={() => navigate('/settings')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuth;