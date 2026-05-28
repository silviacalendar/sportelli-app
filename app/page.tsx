'use client';

import { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import itLocale from '@fullcalendar/core/locales/it';

const utenti = [
  {
    nome: 'Mario',
    cognome: 'Rossi',
    telefono: '3331234567',
    email: 'mario@email.it',
  },

  {
    nome: 'Giulia',
    cognome: 'Bianchi',
    telefono: '3337654321',
    email: 'giulia@email.it',
  },
];

const sportelli: any = {
  Bolzaneto: {
    weekday: 1,
    day: 'Lunedì',
    start: '09:00',
    end: '13:00',
    address: 'Via Pastorino, 8',
  },

  ValBisagno: {
    weekday: 2,
    day: 'Martedì',
    start: '09:30',
    end: '11:45',
    address:
      "Piazza Unità d'Italia (presso uffici Arte)",
  },

  'Posta Vecchia': {
    weekday: 2,
    day: 'Martedì',
    start: '12:30',
    end: '17:00',
    address: 'Via della Posta Vecchia, 10r',
  },

  Sampierdarena: {
    weekday: 3,
    day: 'Mercoledì',
    start: '09:00',
    end: '13:30',
    address: 'Via Sampierdarena, 34',
  },

  'Prà': {
    weekday: 3,
    day: 'Mercoledì',
    start: '09:00',
    end: '12:45',
    address: 'Via Cravasco 32',
  },

  'Prè': {
    weekday: 5,
    day: 'Venerdì',
    start: '09:00',
    end: '12:45',
    address: 'Via Prè, 151 rosso',
  },

  Chiostro: {
    weekday: 4,
    day: 'Giovedì',
    start: '09:00',
    end: '14:15',
    address:
      'Via Santa Maria di Castello, 33',
  },
};

const festivita: any = {
  '2026-01-01': 'Capodanno',
  '2026-01-06': 'Epifania',
  '2026-04-06': 'Pasquetta',
  '2026-04-25': 'Liberazione',
  '2026-05-01': 'Festa del Lavoro',
  '2026-06-02': 'Festa della Repubblica',
  '2026-08-15': 'Ferragosto',
  '2026-11-01': 'Ognissanti',
  '2026-12-08': 'Immacolata',
  '2026-12-25': 'Natale',
  '2026-12-26': 'Santo Stefano',
};

function formatDate(date: Date) {
  const day = String(
    date.getDate()
  ).padStart(2, '0');

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatISO(date: Date) {
  return date.toISOString().split('T')[0];
}

function generateSlots(
  sportello: string
) {
  switch (sportello) {
    case 'Bolzaneto':
      return [
        '09:00 - 09:45',
        '09:45 - 10:30',
        '10:30 - 11:15',
        '11:15 - 12:00',
        '12:00 - 12:45',
      ];

    case 'ValBisagno':
      return [
        '09:30 - 10:15',
        '10:15 - 11:00',
        '11:00 - 11:45',
      ];

    case 'Posta Vecchia':
      return [
        '12:30 - 13:15',
        '13:15 - 14:00',
        '14:00 - 14:45',
        '14:45 - 15:30',
        '15:30 - 16:15',
        '16:15 - 17:00',
      ];

    case 'Sampierdarena':
      return [
        '09:00 - 09:45',
        '09:45 - 10:30',
        '10:30 - 11:15',
        '11:15 - 12:00',
        '12:00 - 12:45',
        '12:45 - 13:30',
      ];

    case 'Prà':
      return [
        '09:00 - 09:45',
        '09:45 - 10:30',
        '10:30 - 11:15',
        '11:15 - 12:00',
        '12:00 - 12:45',
      ];

    case 'Prè':
      return [
        '09:00 - 09:45',
        '09:45 - 10:30',
        '10:30 - 11:15',
        '11:15 - 12:00',
        '12:00 - 12:45',
      ];

    case 'Chiostro':
      return [
        '09:00 - 09:45',
        '09:45 - 10:30',
        '10:30 - 11:15',
        '11:15 - 12:00',
        '12:00 - 12:45',
        '12:45 - 13:30',
        '13:30 - 14:15',
      ];

    default:
      return [];
  }
}

export default function Home() {
  const [utenteLoggato] = useState(
    'Operatore Admin'
  );

  const [
    selectedSportello,
    setSelectedSportello,
  ] = useState('Bolzaneto');

  const [selectedDate, setSelectedDate] =
    useState<any>(null);

  const [appointments, setAppointments] =
    useState<any>({});

  const [selectedSlot, setSelectedSlot] =
    useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] =
    useState<any>(null);

  const [searchUser, setSearchUser] =
    useState('');

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    intervento: '',
  });

  const currentSportello =
    sportelli[selectedSportello];

  const slots = generateSlots(
    selectedSportello
  );

  const today = new Date();

  const isSelectedDate = (
    date: Date
  ) => {
    if (!selectedDate) return false;

    return (
      formatISO(date) ===
      formatISO(selectedDate)
    );
  };

  const getFirstAvailableDate = (
    sportello: any
  ) => {
    const date = new Date();

    for (let i = 0; i < 365; i++) {
      const weekday =
        date.getDay();

      const iso =
        formatISO(date);

      if (
        weekday ===
          sportello.weekday &&
        !festivita[iso] &&
        date >= today
      ) {
        return new Date(date);
      }

      date.setDate(date.getDate() + 1);
    }
  };

  useEffect(() => {
    const firstDate =
      getFirstAvailableDate(
        currentSportello
      );

    setSelectedDate(firstDate);
  }, [selectedSportello]);

  const filteredUsers = utenti.filter(
    (utente) =>
      `${utente.nome} ${utente.cognome}`
        .toLowerCase()
        .includes(searchUser.toLowerCase())
  );

  const selectUser = (utente: any) => {
    setFormData({
      ...formData,
      nome: utente.nome,
      cognome: utente.cognome,
      telefono: utente.telefono,
      email: utente.email,
    });

    setSearchUser('');
  };

  const saveAppointment = () => {
    if (
      !formData.nome ||
      !formData.cognome ||
      !formData.telefono ||
      !formData.email ||
      !formData.intervento
    ) {
      setError(
        'Compila tutti i campi obbligatori'
      );

      return;
    }

    setAppointments({
      ...appointments,

      [
        `${selectedSportello}-${formatDate(
          selectedDate
        )}-${selectedSlot}`
      ]: {
        ...formData,
        prenotatoDa:
          utenteLoggato,
      },
    });

    setSelectedSlot(null);

    setFormData({
      nome: '',
      cognome: '',
      telefono: '',
      email: '',
      intervento: '',
    });

    setError('');
  };

  const deleteAppointment = (
    key: string
  ) => {
    const conferma = confirm(
      'Sei sicuro di voler cancellare questo appuntamento?'
    );

    if (!conferma) return;

    const updated =
      { ...appointments };

    delete updated[key];

    setAppointments(updated);

    setSelectedBooking(null);
  };

  const handleDateClick = (
    info: any
  ) => {
    const clickedDate =
      new Date(info.dateStr);

    const weekday =
      clickedDate.getDay();

    const iso =
      formatISO(clickedDate);

    if (
      clickedDate < today
    )
      return;

    if (
      festivita[iso]
    )
      return;

    if (
      weekday !==
      currentSportello.weekday
    )
      return;

    setSelectedDate(clickedDate);
  };

  const validEvents = [];

  for (
    let d = new Date();
    d <= new Date('2026-12-31');
    d.setDate(d.getDate() + 1)
  ) {
    const weekday = d.getDay();

    const iso =
      formatISO(d);

    if (
      weekday ===
        currentSportello.weekday &&
      !festivita[iso]
    ) {
      validEvents.push({
        start: iso,
        display: 'background',
        backgroundColor: '#bbf7d0',
      });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-8 text-center">
          Agenda Sportelli
        </h1>

        <div className="mb-6 bg-white rounded-3xl p-4 shadow-xl text-lg">
          👤 Operatore loggato:{' '}
          <strong>{utenteLoggato}</strong>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          {Object.keys(sportelli).map(
            (sportello) => (
              <button
                key={sportello}
                onClick={() =>
                  setSelectedSportello(
                    sportello
                  )
                }
                className={`p-5 rounded-3xl text-left transition-all shadow-lg border-2 ${
                  selectedSportello ===
                  sportello
                    ? 'bg-blue-500 text-white border-blue-500 scale-105'
                    : 'bg-white hover:bg-blue-100 border-transparent'
                }`}
              >
                <div className="text-2xl font-bold">
                  {sportello}
                </div>

                <div className="mt-2">
                  {
                    sportelli[sportello]
                      .day
                  }{' '}
                  •{' '}
                  {
                    sportelli[sportello]
                      .start
                  }{' '}
                  -{' '}
                  {
                    sportelli[sportello]
                      .end
                  }
                </div>

                <div className="mt-2 text-sm">
                  📍{' '}
                  {
                    sportelli[sportello]
                      .address
                  }
                </div>
              </button>
            )
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl p-6 shadow-xl">

            <div className="flex gap-4 mb-6 text-sm flex-wrap">

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-300 rounded"></div>
                Prenotabile
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                Chiuso / passato
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-300 rounded"></div>
                Festività
              </div>

            </div>

            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              locale={itLocale}
              height="auto"
              dateClick={
                handleDateClick
              }
              events={[
                ...validEvents,

                ...Object.entries(
                  festivita
                ).map(
                  ([date, name]) => ({
                    title:
                      String(name),
                    start: date,
                    color: '#ef4444',
                  })
                ),
              ]}
              dayCellClassNames={(
                arg
              ) => {
                const weekday =
                  arg.date.getDay();

                const iso =
                  formatISO(
                    arg.date
                  );

                if (
                  arg.date <
                  today
                ) {
                  return [
                    'bg-gray-300 text-gray-500',
                  ];
                }

                if (
                  festivita[
                    iso
                  ]
                ) {
                  return [
                    'bg-red-300 text-black font-bold',
                  ];
                }

                if (
                  weekday !==
                  currentSportello.weekday
                ) {
                  return [
                    'bg-gray-200 text-gray-500',
                  ];
                }

                if (
                  isSelectedDate(
                    arg.date
                  )
                ) {
                  return [
                    'bg-blue-500 text-white font-bold border-4 border-blue-700 scale-105',
                  ];
                }

                return [
                  'bg-green-200 hover:bg-green-300 cursor-pointer transition-all',
                ];
              }}
            />
          </div>

          <div>

            {selectedDate && (
              <>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl p-6 shadow-2xl mb-6 border-4 border-blue-300">

                  <div className="text-3xl font-bold">
                    {selectedSportello}
                  </div>

                  <div className="mt-4 text-2xl font-extrabold bg-white text-blue-700 inline-block px-5 py-3 rounded-2xl shadow-lg">
                    📅{' '}
                    {formatDate(
                      selectedDate
                    )}
                  </div>

                  <div className="mt-4 text-lg">
                    🕒{' '}
                    {
                      currentSportello.start
                    }{' '}
                    -{' '}
                    {
                      currentSportello.end
                    }
                  </div>

                  <div className="mt-4 text-sm bg-white/20 rounded-xl p-3">
                    Giorno attualmente selezionato per la prenotazione
                  </div>

                </div>

                <div className="grid gap-4">

                  {slots.map(
                    (
                      slot: string
                    ) => {
                      const key =
                        `${selectedSportello}-${formatDate(
                          selectedDate
                        )}-${slot}`;

                      const booking =
                        appointments[key];

                      return (
                        <div
                          key={slot}
                          className={`p-5 rounded-3xl shadow-lg ${
                            booking
                              ? 'bg-red-200'
                              : 'bg-white'
                          }`}
                        >
                          <div className="text-2xl font-bold">
                            {slot}
                          </div>

                          {booking ? (
                            <>
                              <div className="mt-3 text-lg font-bold">
                                👤{' '}
                                {
                                  booking.nome
                                }{' '}
                                {
                                  booking.cognome
                                }
                              </div>

                              <button
                                onClick={() =>
                                  setSelectedBooking(
                                    {
                                      ...booking,
                                      key,
                                      slot,
                                    }
                                  )
                                }
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold"
                              >
                                Dettagli appuntamento
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="mt-2 text-gray-500">
                                Disponibile
                              </div>

                              <button
                                onClick={() =>
                                  setSelectedSlot(
                                    slot
                                  )
                                }
                                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                              >
                                Prenota
                              </button>
                            </>
                          )}
                        </div>
                      );
                    }
                  )}

                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">

            <h2 className="text-3xl font-bold mb-2">
              Nuovo Appuntamento
            </h2>

            <div className="mb-6 text-gray-600">
              {selectedSportello} •{' '}
              {formatDate(
                selectedDate
              )}{' '}
              • {selectedSlot}
            </div>

            <div className="mb-4">

              <input
                type="text"
                placeholder="Cerca utente..."
                value={searchUser}
                onChange={(e) =>
                  setSearchUser(
                    e.target.value
                  )
                }
                className="w-full p-3 border rounded-xl"
              />

              {searchUser && (
                <div className="border rounded-xl mt-2 max-h-40 overflow-y-auto">

                  {filteredUsers.map(
                    (
                      utente,
                      index
                    ) => (
                      <div
                        key={index}
                        onClick={() =>
                          selectUser(
                            utente
                          )
                        }
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        {
                          utente.nome
                        }{' '}
                        {
                          utente.cognome
                        }
                      </div>
                    )
                  )}

                </div>
              )}

            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nome *"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nome:
                      e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="text"
                placeholder="Cognome *"
                value={formData.cognome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cognome:
                      e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="text"
                placeholder="Telefono *"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telefono:
                      e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl"
              />

              <textarea
                placeholder="Motivo intervento *"
                value={
                  formData.intervento
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intervento:
                      e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl h-28"
              />

            </div>

            <div className="flex gap-4 mt-6">

              <button
                onClick={
                  saveAppointment
                }
                className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-bold"
              >
                Salva
              </button>

              <button
                onClick={() =>
                  setSelectedSlot(
                    null
                  )
                }
                className="flex-1 bg-gray-300 hover:bg-gray-400 p-3 rounded-xl font-bold"
              >
                Annulla
              </button>

            </div>

          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">

            <h2 className="text-3xl font-bold mb-6">
              Dettaglio appuntamento
            </h2>

            <div className="space-y-3 text-lg">

              <div>
                👤{' '}
                {
                  selectedBooking.nome
                }{' '}
                {
                  selectedBooking.cognome
                }
              </div>

              <div>
                📞{' '}
                {
                  selectedBooking.telefono
                }
              </div>

              <div>
                ✉️{' '}
                {
                  selectedBooking.email
                }
              </div>

              <div>
                📝{' '}
                {
                  selectedBooking.intervento
                }
              </div>

              <div>
                👨‍💼 Prenotato da:{' '}
                {
                  selectedBooking.prenotatoDa
                }
              </div>

            </div>

            <div className="flex gap-4 mt-8">

              <button
                onClick={() =>
                  deleteAppointment(
                    selectedBooking.key
                  )
                }
                className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-bold"
              >
                Cancella
              </button>

              <button
                onClick={() =>
                  setSelectedBooking(
                    null
                  )
                }
                className="flex-1 bg-gray-300 hover:bg-gray-400 p-3 rounded-xl font-bold"
              >
                Chiudi
              </button>

            </div>

          </div>
        </div>
      )}
    </main>
  );
}