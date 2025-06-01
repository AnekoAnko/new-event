import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Назва події обов’язкова';
    if (!date) newErrors.date = 'Дата події обов’язкова';
    if (!location.trim()) newErrors.location = 'Місце події обов’язкове';
    if (!description.trim()) newErrors.description = 'Опис події обов’язковий';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const newEvent = { title, date, location, description };

  try {
    const token = localStorage.getItem('token');
    console.log(newEvent);

    const response = await axios.post('/api/events', newEvent, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Створена подія:', response.data);
    navigate('/events');
  } catch (error) {
    console.error('Помилка запиту:', error);

    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (data?.errors) {
        const serverErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.errors.forEach((err: any) => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        alert(data?.error || 'Сталася помилка при створенні події');
      }
    } else {
      alert('Невідома помилка');
    }
  }
};



  return (
    <>
      <Link
          to="/"
          className="inline-block text-gray-700 hover:text-blue-600 hover:underline mt-10"
        >
        ← На головну
      </Link>
      <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Створити нову подію
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-8">
            <label
              htmlFor="title"
              className="block mb-3 text-lg font-semibold text-gray-700"
            >
              Назва події
            </label>
            <input
              id="title"
              type="text"
              placeholder="Введіть назву події"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-5 py-3 rounded-xl border text-lg
                transition
                ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }
                focus:outline-none focus:ring-4
                shadow-sm
                hover:shadow-md
              `}
            />
            {errors.title && (
              <p className="mt-2 text-red-500 text-sm italic">{errors.title}</p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="date"
              className="block mb-3 text-lg font-semibold text-gray-700"
            >
              Дата події
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-5 py-3 rounded-xl border text-lg
                transition
                ${
                  errors.date
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }
                focus:outline-none focus:ring-4
                shadow-sm
                hover:shadow-md
              `}
            />
            {errors.date && (
              <p className="mt-2 text-red-500 text-sm italic">{errors.date}</p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="location"
              className="block mb-3 text-lg font-semibold text-gray-700"
            >
              Місце події
            </label>
            <input
              id="location"
              type="text"
              placeholder="Введіть місце події"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full px-5 py-3 rounded-xl border text-lg
                transition
                ${
                  errors.location
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }
                focus:outline-none focus:ring-4
                shadow-sm
                hover:shadow-md
              `}
            />
            {errors.location && (
              <p className="mt-2 text-red-500 text-sm italic">{errors.location}</p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="description"
              className="block mb-3 text-lg font-semibold text-gray-700"
            >
              Опис події
            </label>
            <textarea
              id="description"
              placeholder="Опишіть подію"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className={`w-full px-5 py-3 rounded-xl border text-lg
                transition
                resize-none
                ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }
                focus:outline-none focus:ring-4
                shadow-sm
                hover:shadow-md
              `}
            />
            {errors.description && (
              <p className="mt-2 text-red-500 text-sm italic">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-extrabold text-lg py-4 rounded-xl
            shadow-md
            transition
            duration-300
            focus:outline-none focus:ring-4 focus:ring-blue-300
            active:scale-95
            "
          >
            Створити подію
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
