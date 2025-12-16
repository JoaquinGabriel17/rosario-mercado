import { useState } from 'react';
import Loading from '../ui/Loading';
import Alert from '../ui/Alert';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { Button } from '../ui/Button';
import type { TicketFormData } from '../../types/support';

export default function CreateTicket() {
    const [formData, setFormData] = useState<TicketFormData>({
        title: '',
        description: '',
    });
    const user = useUserStore((state) => state.user);

    const [errors, setErrors] = useState<Partial<TicketFormData>>({});
    const [loading, setLoading] = useState<boolean>(false)
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "info" as "info" | "success" | "error",
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    /*setLoading(false)
    setAlert({
      open: true,
      message: "Producto creado con éxito",
      type: "success",
    });*/

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        try {
            setLoading(true);
            e.preventDefault();
            if (!formData.title || !formData.description) {
                setLoading(false);
                setAlert({
                    open: true,
                    message: "Debe completar todos los campos obligatorios",
                    type: "error",
                });
                return;
            };

            const response = await axios.post(`${backendUrl}/tickets`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
            });
            if (response.status == 201) {
                setAlert({
                    open: true,
                    message: "Solicitud creada correctamente, la podrás ver en tus solicitudes",
                    type: "success",
                });
                setFormData({ title: '', description: '' });
            }

        } catch (error) {
            console.log(error)
            setAlert({
                open: true,
                message: "Error al crear solicitud",
                type: "error",
            });
        }
        finally {
            setLoading(false)
        }
    };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
         {loading && <Loading></Loading>}
    {alert && <Alert
  open={alert.open}
  message={alert.message}
  type={alert.type}
  onClose={() => setAlert({ ...alert, open: false })}/>}
      <h2 className="text-2xl font-semibold mb-4">Crear Ticket de Soporte</h2>

      <form >
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
              errors.description ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <Button
            onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Enviar Ticket
        </Button>
      </form>
    </div>
  );
}