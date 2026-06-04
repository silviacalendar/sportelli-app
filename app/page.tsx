'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import itLocale from '@fullcalendar/core/locales/it';

const GOOGLE_SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/1vJ_w31uFtdzalNQEZlJAQMTHsTIvR5tUMBHNouI-Mck/export?format=csv&gid=0';

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
    end: '13:00',
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
    end: '14:00',
    address: 'Via Sampierdarena, 34',
  },

  'Prà': {
    weekday: 3,
    day: 'Mercoledì',
    start: '09:00',
    end: '13:00',
    address: 'Via Cravasco 32',
  },

  'Prè': {
    weekday: 5,
    day: 'Venerdì',
    start: '09:00',
    end: '13:00',
    address: 'Via Prè, 151 rosso',
  },

  Chiostro: {
    weekday: 4,
    day: 'Giovedì',
    start: '09:00',
    end: '14:30',
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
        '11:45 - 12:30',
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
  console.log('HOME CARICATA');

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

    const [utenti, setUtenti] =
  useState<any[]>([]);

  const [selectedSlot, setSelectedSlot] =
    useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] =
    useState<any>(null);

  const [editingBooking, setEditingBooking] =
    useState<any>(null);

  const [searchUser, setSearchUser] =
    useState('');

  const [error, setError] = useState('');

  const [phoneError, setPhoneError] =
    useState('');

  const [repeatWeeks, setRepeatWeeks] =
    useState(1);

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

  
  useEffect(() => {console.log('USEEFFECT PARTITO');
    Papa.parse(GOOGLE_SHEET_CSV, {
      download: true,
      header: true,
      complete: (results: any) => {
        console.log('CSV CARICATO', results);
  console.log('RISULTATI CSV', results);

  const elenco = (results.data || []).map((row: any) => ({
    nome: row.NOME || '',
    cognome: row.COGNOME || '',
    telefono: row.TELEFONO || '',
    email: row.EMAIL || '',
    bloccato: String(row.BLOCCATO || '').trim().toUpperCase() === 'SI',
  }));

  console.log('ELENCO UTENTI', elenco);

  setUtenti(elenco);
},
    });
  }, []);

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

  const handlePhoneChange = (
    value: string
  ) => {
    const hasLetters = /[a-zA-Z]/.test(
      value
    );

    if (hasLetters) {
      setPhoneError(
        'Nel numero di telefono puoi inserire solo numeri'
      );
    } else {
      setPhoneError('');
    }

    const onlyNumbers =
      value.replace(/\D/g, '');

    setFormData({
      ...formData,
      telefono: onlyNumbers,
    });
  };

  const saveAppointment = () => {
    if (utenteBloccato) return;
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

    if (phoneError) {
      return;
    }

    const updatedAppointments = {
      ...appointments,
    };

    for (
      let i = 0;
      i < repeatWeeks;
      i++
    ) {
      const repeatDate =
        new Date(selectedDate);

      repeatDate.setDate(
        repeatDate.getDate() + i * 7
      );

      const key =
        `${selectedSportello}-${formatDate(
          repeatDate
        )}-${selectedSlot}`;

      updatedAppointments[key] = {
        ...formData,
        prenotatoDa:
          utenteLoggato,
      };
    }

    setAppointments(
      updatedAppointments
    );

    setSelectedSlot(null);

    setFormData({
      nome: '',
      cognome: '',
      telefono: '',
      email: '',
      intervento: '',
    });

    setRepeatWeeks(1);

    setError('');

    setPhoneError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-8 text-center">
          Agenda Sportelli test 123
        </h1>

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

            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              locale={itLocale}
              height="auto"
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
                            <div className="mt-3 text-lg font-bold">
                              👤{' '}
                              {
                                booking.nome
                              }{' '}
                              {
                                booking.cognome
                              }
                            </div>
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

          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">

            <h2 className="text-3xl font-bold mb-4">
              Nuovo Appuntamento
            </h2>

            <input
              type="text"
              placeholder="Cerca utente..."
              value={searchUser}
              onChange={(e) =>
                setSearchUser(
                  e.target.value
                )
              }
              className="w-full p-3 border rounded-xl mb-4"
            />

            {searchUser && (
              <div className="border rounded-xl mb-4">

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

            {utenteBloccato && (
              <div className="bg-red-600 text-white p-3 rounded-xl mb-4 font-bold">
                ⚠️ ATTENZIONE! Utente bloccato. Non è possibile prenotare appuntamenti con questo utente. Verificare su portale.
              </div>
            )}

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

              <div>
                <input
                  type="text"
                  placeholder="Telefono *"
                  value={
                    formData.telefono
                  }
                  onChange={(e) =>
                    handlePhoneChange(
                      e.target.value
                    )
                  }
                  className="w-full p-3 border rounded-xl"
                />

                {phoneError && (
                  <div className="text-red-600 text-sm font-semibold mt-1">
                    {phoneError}
                  </div>
                )}
              </div>

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

              <div>

                <label className="font-bold">
                  Ripeti per settimane
                </label>

                <input
                  type="number"
                  min="1"
                  max="52"
                  value={
                    repeatWeeks
                  }
                  onChange={(e) =>
                    setRepeatWeeks(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full p-3 border rounded-xl mt-2"
                />

              </div>

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
    </main>
  );
}