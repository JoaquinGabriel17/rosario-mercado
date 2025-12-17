// src/components/Profile.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../ui/Loading';
import { useUserStore } from '../../store/userStore';
import CopyInfoButton from '../../utils/CopyInfoButton';

type User = {
  _id: string;
  name: string;
  email: string;
  whatsappAvailable?: boolean;
  delivery?: boolean;
  isSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
  businessHours?: string;
  phoneNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
};

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userLog = useUserStore((state) => state.user);
  const navigate = useNavigate()


  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!id) {
      setError('ID de usuario no especificado');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendUrl}/users/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLog?.token}`,
          },
          signal,
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error('Usuario no encontrado');
          if (res.status === 403) throw new Error('Sin permiso para ver este usuario');
          throw new Error(`Error en la petición: ${res.status}`);
        }
        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    return () => controller.abort();
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-gray-600">No hay datos para mostrar.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-sm rounded-md">
    {loading && <Loading></Loading>}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded bg-gray-50">
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm text-gray-800 break-all">{user.email}</p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <p className="text-xs text-gray-500">Teléfono</p>
          <p className="text-sm text-gray-800">{user.phoneNumber ?? '—'}</p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <p className="text-xs text-gray-500">Disponibilidad WhatsApp</p>
          <p className={`text-sm font-medium ${user.whatsappAvailable ? 'text-green-600' : 'text-gray-600'}`}>
            {user.whatsappAvailable ? 'Disponible' : 'No disponible'}
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <p className="text-xs text-gray-500">Delivery</p>
          <p className={`text-sm font-medium ${user.delivery ? 'text-green-600' : 'text-gray-600'}`}>
            {user.delivery ? 'Ofrece delivery' : 'No ofrece delivery'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
                    {user.phoneNumber && (
                      <CopyInfoButton phoneNumber={user.phoneNumber} textInButton="Copiar número de teléfono" />
                    )}
                    {user.whatsappAvailable && user.phoneNumber && (
                      <a
                        href={`https://wa.me/${user.phoneNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 border bg-green-600 text-white rounded hover:bg-green-700 text-center"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Detalles</h2>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Horario de disponibilidad</span>: {user.businessHours ?? '—'}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Redes sociales</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          {user.facebookUrl ? (
            <a
              href={user.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Facebook
            </a>
          ) : (
            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded text-sm">Facebook no disponible</span>
          )}

          {user.instagramUrl ? (
            <a
              href={user.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
            >
              Instagram
            </a>
          ) : (
            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded text-sm">Instagram no disponible</span>
          )}
        </div>
      </section>
    </div>
  );
}