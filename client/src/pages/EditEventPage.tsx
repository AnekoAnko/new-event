/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import type { IEvent } from '../types/types';

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<IEvent>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  // Стан для показу модалки
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          date: response.data.date?.slice(0, 16) || '',
          location: response.data.location || '',
        });
      } catch {
        toast.error('Не вдалося завантажити подію');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/events/${id}`, { ...formData });
      toast.success('Подію оновлено!');
      navigate(`/events/${id}`);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((error: any) => toast.error(error.msg));
      } else {
        toast.error('Помилка при оновленні події');
      }
    }
  };

  // Функція для відкриття модалки
  const openDeleteModal = () => setShowDeleteModal(true);

  // Відміна видалення (закриття модалки)
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Підтвердження видалення
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/events/${id}`);
      toast.success('Подію видалено!');
      navigate('/');
    } catch (err: any) {
      toast.error('Помилка при видаленні події');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p className="text-center py-10 text-lg">Завантаження...</p>;

  return (
    <>
      <Link
        to="/"
        className="inline-block text-gray-700 hover:text-blue-600 hover:underline mt-10"
      >
        ← На головну
      </Link>
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Редагувати подію</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Назва події
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Опис
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Дата та час
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Місце проведення
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-4 py-2"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer font-semibold px-6 py-2 rounded-md transition duration-200"
            >
              💾 Зберегти зміни
            </button>

            <button
              type="button"
              onClick={openDeleteModal}
              className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold px-6 py-2 rounded-md transition duration-200"
            >
              🗑️ Видалити подію
            </button>
          </div>
        </form>
      </div>

      {/* Модалка підтвердження видалення */}
      {showDeleteModal && (
        <div
          className="fixed bg-white inset-0 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()} 
          >
            <h2 className="text-xl font-semibold mb-4">Підтвердьте видалення</h2>
            <p className="mb-6">Ви дійсно хочете видалити цю подію? Цю дію неможливо скасувати.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded cursor-pointer bg-gray-300 hover:bg-gray-400 transition"
              >
                Cкасувати
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded cursor-pointer bg-red-600 text-white hover:bg-red-700 transition"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditEventPage;
