import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ThemeToggle({ theme, setTheme }) {
  return (
    <motion.button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-full bg-primary text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </motion.button>
  );
}

export default ThemeToggle;