
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import EditEventPage from './pages/EditEventPage';
import About from './pages/Abouts';


function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <div className="bg-gray-50 min-h-screen flex flex-col">
          {/* <Navbar /> */}
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Event Routes */}
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* Protected Routes */}
              <Route
                path="/create-event"
                element={
                  <PrivateRoute>
                    <CreateEvent />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />  
              <Route
                path="/events/:id/edit"
                element={
                  <PrivateRoute>
                    <EditEventPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <About />
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
