import { useState, useEffect } from 'react';
import { auth } from './firebase/firebase';
import Home from './pages/Home';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-100 to-teal-100'}`}>
      <Toaster />
      {user ? <Home user={user} theme={theme} setTheme={setTheme} /> : <Login />}
    </div>
  );
}

export default App;