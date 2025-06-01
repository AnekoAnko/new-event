import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Plus, Search, User } from 'lucide-react';

const Header = () => (
  <header className="bg-white shadow-md py-4">
    <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        NewEvent
      </Link>
      <nav className="space-x-6">
        <Link to="/events" className="text-gray-700 hover:text-blue-600 transition">
          Події
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
          Про нас
        </Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-100 py-8 mt-20">
    <div className="mx-auto px-4 text-center text-gray-600 text-sm">
      <p>© 2025 NewEvent. Всі права захищені.</p>

    </div>
  </footer>
);

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Ласкаво просимо до <span className="text-blue-600">NewEvent</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Створюйте, знаходьте та реєструйтеся на події, які вас цікавлять. 
            Приєднуйтеся до спільноти та не пропускайте важливі моменти!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/events" className="btn-primary text-lg px-8 py-3 flex items-center justify-center">
              <Search className="inline-block w-5 h-5 mr-2" />
              Переглянути події
            </Link>

            {!isAuthenticated ? (
              <Link to="/create-event" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center">
                <Plus className="inline-block w-5 h-5 mr-2" />
                Створити подію
              </Link>
            ) : (
              <>
                <Link to="/profile" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center">
                  <User className="inline-block w-5 h-5 mr-2" />
                  Профіль
                </Link>
                <Link to="/create-event" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center">
                  <Plus className="inline-block w-5 h-5 mr-2" />
                  Створити подію
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Створюйте події</h3>
            <p className="text-gray-600">
              Легко створюйте та організовуйте власні події. Вказуйте дату, місце, 
              опис та кількість учасників.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Знаходьте події</h3>
            <p className="text-gray-600">
              Переглядайте всі доступні події, фільтруйте за датою та місцем. 
              Знаходьте те, що вас цікавить.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Реєструйтесь</h3>
            <p className="text-gray-600">
              Реєструйтесь на події одним кліком. Слідкуйте за своїми реєстраціями 
              та не пропускайте важливі моменти.
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Готові почати?
            </h2>
            <p className="text-gray-600 mb-6">
              Створіть обліковий запис і почніть організовувати події вже сьогодні!
            </p>
            <Link to="/register" className="btn-primary text-xl font-bold text-center cursor-pointer">
              Зареєструватися безкоштовно
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
