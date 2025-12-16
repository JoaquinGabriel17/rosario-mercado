import React from "react";
import type { TicketItemProps } from "./support";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');


export const TicketItem: React.FC<TicketItemProps> = React.memo(({ ticket, onClick }) => (
  <li>
    <button
      onClick={() => onClick(ticket._id)}
      className="w-full text-left px-4 py-4 hover:bg-gray-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition rounded-lg flex flex-col sm:flex-row sm:items-center gap-2"
      aria-label={`Abrir chat del ticket ${ticket.title}`}
    >
      <div className="flex-1">
        <span className="block font-semibold text-gray-800">{ticket.title}</span>
        <span className="block text-sm text-gray-500">
          {dayjs(ticket.createdAt).fromNow()}
        </span>
      </div>
      <span
        className={`text-center inline-block px-2 py-1 text-xs rounded-full ${
          ticket.status === 'open'
            ? 'bg-green-300 text-green-800'
            : ticket.status === 'closed'
            ? 'bg-gray-300 text-gray-600'
            : 'bg-yellow-300 text-yellow-800'
        }`}
      >
        {ticket.status}
      </span>
    </button>
  </li>
));