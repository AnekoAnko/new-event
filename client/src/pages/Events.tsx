import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, MapPin } from 'lucide-react';
import axios from 'axios';
import type { IEvent } from '../types/types';

type Tab = 'all' | 'myEvents' | 'myRegistrations';

const Events = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [myRegisteredEvents, setMyRegisteredEvents] = useState<IEvent[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('https://new-event-server.onrender.com/api/events');
        setEvents(data);
        setLoading(false);
      } catch {
        setError('Не вдалося завантажити події');
        setLoading(false);
      }
    };

    const fetchMyRegistrations = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await axios.get('https://new-event-server.onrender.com/api/users/my-registrations');
        setMyRegisteredEvents(data);
      } catch (err) {
        console.error('Не вдалося завантажити мої реєстрації', err);
      }
    };

    fetchAllEvents();
    fetchMyRegistrations();
  }, [isAuthenticated]);

  const filteredEvents = (): IEvent[] => {
    if (activeTab === 'all') {
      return events;
    }
    
    if (activeTab === 'myEvents') {
      return events.filter(event => event.creatorId === user?.id);
    }

    if (activeTab === 'myRegistrations') {
      return myRegisteredEvents;
    }

    return events;
  };

  const eventsToShow = filteredEvents();

  return (
    <>
      <Link
        to="/"
        className="inline-block text-gray-700 hover:text-blue-600 hover:underline mt-10"
      >
        ← На головну
      </Link>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Події</h1>
            <p className="text-gray-600">Перегляньте події та приєднуйтесь до спільноти.</p>
          </div>
          {isAuthenticated && (
            <Link to="/create-event" className="btn-primary text-lg px-6 py-2 mt-4 sm:mt-0 cursor-pointer">
              Створити подію
            </Link>
          )}
        </div>

        {/* Вкладки фільтрації */}
        <div className="flex space-x-6 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-semibold cursor-pointer rounded-md transition ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            }`}
          >
            Усі події
          </button>

          {isAuthenticated && (
            <>
              <button
                onClick={() => setActiveTab('myEvents')}
                className={`px-4 py-2 font-semibold cursor-pointer rounded-md transition ${
                  activeTab === 'myEvents'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
              >
                Мої події
              </button>
              <button
                onClick={() => setActiveTab('myRegistrations')}
                className={`px-4 py-2 font-semibold cursor-pointer rounded-md transition ${
                  activeTab === 'myRegistrations'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
              >
                На які я зареєстрований
              </button>
            </>
          )}
        </div>

        {/* Контент */}
        {loading ? (
          <p className="text-center text-gray-500">Завантаження...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : eventsToShow.length === 0 ? (
          <p className="text-center text-gray-500">
            {activeTab === 'myEvents' && 'У вас поки немає створених подій.'}
            {activeTab === 'myRegistrations' && 'Ви не зареєстровані на жодну подію.'}
            {activeTab === 'all' && 'Подій поки немає.'}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsToShow.map((event: IEvent) => (
              <div
                key={event.id}
                className="flex flex-col justify-between border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200 min-h-[220px] bg-white"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h2>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <CalendarDays className="w-4 h-4 mr-2 text-blue-600" />
                    {new Date(event.date).toLocaleDateString('uk-UA')}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-block text-blue-600 font-medium hover:underline"
                  >
                    Детальніше →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
