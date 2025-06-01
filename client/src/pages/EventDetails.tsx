import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import type { IEvent } from '../types/types';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Отримуємо user
  const [event, setEvent] = useState<IEvent>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://new-event-server.onrender.com/api/events/${id}`);
        if (res.data) {
          setEvent(res.data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
        console.error('Помилка завантаження події:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`https://new-event-server.onrender.com/api/events/${id}/registration-status`);
        setIsRegistered(res.data.registered);
      } catch (err) {
        console.error('Помилка перевірки реєстрації:', err);
      }
    };

    fetchEvent();
    if (user) checkRegistration();
  }, [id, user]);

  const handleRegister = async () => {
    try {
      setActionLoading(true);
      await axios.post(`https://new-event-server.onrender.com/api/events/${id}/register`);
      setIsRegistered(true);
    } catch (err) {
      console.error('Помилка при реєстрації:', err);
    } finally {
      setActionLoading(false);
    }
  };

  console.log(isRegistered)

  const handleUnregister = async () => {
    try {
      setActionLoading(true);
      await axios.delete(`https://new-event-server.onrender.com/api/events/${id}/register`);
      setIsRegistered(false);
    } catch (err) {
      console.error('Помилка при скасуванні реєстрації:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-lg text-gray-600">
        Завантаження події...
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Подія не знайдена</h2>
        <p className="mb-6">Вибачте, подія, яку ви шукаєте, не існує або була видалена.</p>
        <Link to="/events" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Повернутися до подій
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-600 mb-8 gap-4 sm:gap-10">
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-base font-medium">{new Date(event.date).toLocaleDateString('uk-UA')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-base font-medium">{event.location}</span>
          </div>
        </div>

        <p className="text-lg text-gray-800 leading-relaxed mb-10">{event.description}</p>

        {user && (
          <div className="mb-6 space-y-4">
            {/* Якщо користувач не є творцем — показати кнопки реєстрації/скасування */}
            {user.id !== event.creatorId && (
              isRegistered ? (
                <button
                  onClick={handleUnregister}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-red-700 transition"
                  disabled={actionLoading}
                >
                  Скасувати реєстрацію
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                  disabled={actionLoading}
                >
                  Зареєструватися
                </button>
              )
            )}

            {/* Якщо користувач — творець події, показати кнопку редагування */}
            {user.id === event.creatorId && (
              <Link
                to={`/events/${event.id}/edit`}
                className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
              >
                Редагувати подію
              </Link>
            )}
          </div>
        )}


        <Link to="/events" className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
          ← Назад до подій
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;
