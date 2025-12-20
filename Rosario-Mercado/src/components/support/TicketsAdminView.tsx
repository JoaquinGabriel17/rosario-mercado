import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'dayjs/locale/es';
import { useUserStore } from '../../store/userStore';
import Loading from '../ui/Loading';
import { TicketsArraySchema } from '../../types/support';
import type { Ticket } from '../../types/support';
import { TicketItem } from '../../types/ticketItem';




export const TicketsAdminView: React.FC = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/tickets/all`,{
        headers:{
            Authorization: `Bearer ${user?.token}`
        }
      });
      const validated = TicketsArraySchema.parse(response.data);
      setTickets(validated);
    } catch (err: any) {
      setError('No se pudieron cargar los tickets. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchTickets();
  }, [userId, fetchTickets]);

  const handleTicketClick = (id: string) => {
    navigate(`/tickets/${id}/chat`);
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
        <button
          onClick={fetchTickets}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }



  return (
    <div className="max-w-2xl mx-auto mt-2">
      {loading && <Loading/>}
      {tickets.length ? 
      <>
      <ul className="divide-y divide-gray-200 rounded-lg shadow bg-white">
        {tickets.map(ticket => (
          <TicketItem key={ticket._id} ticket={ticket} onClick={handleTicketClick} />
        ))}
      </ul>
      </>
        :  (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 text-gray-600 rounded-lg text-center">
        
        <p>No tienes tickets aún.</p>
      </div>
    )
    }
    </div>
  );
};

export default TicketsAdminView;