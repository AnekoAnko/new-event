import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://new-event-server.onrender.com/api/users/profile');
        setProfile(res.data);
        setNewName(res.data.name);
      } catch (err) {
        console.error('Помилка завантаження профілю:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleSave = async () => {
    if (newName.trim().length < 2) {
      setError('Ім\'я має бути мінімум 2 символи.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await axios.put('https://new-event-server.onrender.com/api/users/profile', { name: newName.trim() });
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      setError('Не вдалося оновити ім\'я. Спробуйте пізніше.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-gray-500 animate-pulse">
        Завантаження профілю...
      </p>
    );
  if (!isAuthenticated)
    return (
      <p className="text-center mt-20 text-lg text-red-500">
        Будь ласка, увійдіть у систему.
      </p>
    );
  if (!profile)
    return (
      <p className="text-center mt-20 text-lg text-red-500">
        Не вдалося завантажити дані профілю.
      </p>
    );

  return (
    <>
      <Link
          to="/"
          className="inline-block text-gray-700 hover:text-blue-600 hover:underline mt-10"
        >
        ← На головну
      </Link>
      <div className="max-w-md mx-auto px-6 py-12 bg-white rounded-lg shadow-lg border border-gray-200">

        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
            Профіль користувача
        </h1>

        <div className="space-y-8 text-gray-700">
            {/* Ім'я */}
            <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-800" htmlFor="name-input">
                Ім'я:
            </label>

            {isEditing ? (
                <>
                <input
                    id="name-input"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={saving}
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    maxLength={50}
                    autoFocus
                />
                <div className="mt-3 flex space-x-3">
                    <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
                    >
                    {saving ? 'Збереження...' : 'Зберегти'}
                    </button>
                    <button
                    onClick={() => {
                        setIsEditing(false);
                        setNewName(profile.name);
                        setError('');
                    }}
                    disabled={saving}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 transition cursor-pointer"
                    >
                    Відмінити
                    </button>
                </div>
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                </>
            ) : (
                <div className="flex items-center justify-between">
                <p className="text-gray-900 font-medium">{profile.name}</p>
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:underline text-sm font-semibold cursor-pointer"
                    aria-label="Редагувати ім'я"
                >
                    Редагувати
                </button>
                </div>
            )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-800">Email:</label>
            <p className="text-gray-900 truncate">{profile.email}</p>
            </div>


            {/* Дата реєстрації */}
            <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-800">Зареєстровано:</label>
            <p className="text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                })}
            </p>
            </div>
        </div>
        </div>
    </>
  );
};

export default Profile;
