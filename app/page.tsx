'use client';

import { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Home() {
  const [events, setEvents] = useState([
    {
      title: 'Appuntamento',
      date: '2026-05-27',
    },
  ]);

  const handleDateClick = (arg: any) => {
    const title = prompt('Nome appuntamento');

    if (title) {
      setEvents([
        ...events,
        {
          title,
          date: arg.dateStr,
        },
      ]);
    }
  };

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Calendario Appuntamenti
      </h1>

      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          height="80vh"
        />
      </div>
    </main>
  );
}