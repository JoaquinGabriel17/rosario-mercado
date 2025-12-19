import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Message } from '../../types/support';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { Button } from '../ui/Button';
import Loading from '../ui/Loading';
import Alert from '../ui/Alert';

export default function Chat() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const user = useUserStore((state) => state.user);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate()
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "info" as "info" | "success" | "error",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ticketStatus, setTicketStatus] = useState<string>("")

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${backendUrl}/tickets/${ticketId}/messages`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        if (res.status !== 200) throw new Error('Error al obtener mensajes');
        const data: Message[] = await res.data.messages;
        const status = await res.data.ticketInfo.status;
        setTicketStatus(status);
        setMessages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchMessages();
  }, [ticketId]);

  //Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (!newMessage.trim()) {
      setLoading(false)
      setAlert({ open: true, message: "Debe ingresar un mensaje para enviar", type: "error", });
      return;
    };

    try {
      const res = await axios.post(`${backendUrl}/tickets/${ticketId}/messages`, JSON.stringify({ message: newMessage, status: (user?.role === "user" ? "open" : ticketStatus ) }), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        }
      });
      if (res.status !== 201) throw new Error('Error al enviar mensaje');
      const savedMessage: Message = await res.data;
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
    } catch (err: any) {
      setError(err.message);
    }
    finally {
      setLoading(false)
    }
  };

  //Cambiar estado de ticket
  const handleChangeStatus = (status: string) => {
    setTicketStatus(status);
    setIsOpen(false);
  }

  if (loading) return <Loading></Loading>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
      <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-white shadow rounded">
          {alert && <Alert
              open={alert.open}
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ ...alert, open: false })} />}
          <div className='bg-white w-full border-b-2 px-2 flex flex-row justify-between'>
              
              <Button onClick={() => navigate(-1)} >Volver</Button>
              {user?.role === 'admin' && <Button onClick={() => setIsOpen(!isOpen)}>{ticketStatus}</Button>}
              
              
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isOpen && 
                <ul className='absolute z-999 bg-white border rounded p-6 text-center right-2 top-20'>
                  <li onClick={() => handleChangeStatus("closed")} className='border-blue-600 border-2 p-2 rounded w-full mt-1 cursor-pointer'>Cerrado</li>
                  <li onClick={() => handleChangeStatus("open")} className='border-blue-600 border-2 p-2 rounded w-full mt-1 cursor-pointer'>Abierto</li>
                  <li onClick={() => handleChangeStatus("in_progress")} className='border-blue-600 border-2 p-2 rounded w-full mt-1 cursor-pointer'>En progreso</li>
                </ul>
              }

        {!messages.length && <p className='text-center text-2xl'>Aún no hay mensajes en el ticket</p>}
        {messages.map(msg => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === 'admin' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs wrap-break-words ${
                msg.senderId === 'admin'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-green-500 text-white'
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t flex items-center space-x-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}