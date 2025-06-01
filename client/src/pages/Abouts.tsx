import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">Про нас</h1>
      <p className="text-lg text-gray-700 mb-4">
        Цей проєкт розроблений однією людиною в рамках університетського курсу з теми <strong>«Веб технології»</strong>.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Додаток створений для зручної реєстрації та управління подіями.
      </p>
      <p className="text-lg text-gray-700">
        Він дозволяє користувачам знаходити цікаві події, реєструватися на них і організовувати власні заходи. Мета проєкту — допомогти об’єднати спільноту та зробити процес участі у подіях простим і доступним.
      </p>

      <div className="mt-10 text-center">
        <Link
          to="/"
          className="inline-block text-blue-600 hover:underline font-semibold"
        >
          ← Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export default About;
