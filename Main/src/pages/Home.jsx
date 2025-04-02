import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import HistoryPanel from '../components/HistoryPanel';
import ThemeToggle from '../components/ThemeToggle';
import { motion } from 'framer-motion';

function Home({ user, theme, setTheme }) {
  const [language, setLanguage] = useState('en');

  return (
    <div className="flex flex-col items-center p-8">
      <motion.div
        className="flex justify-between w-full max-w-5xl mb-6 overflow-y-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
          {language === 'en' ? 'Thirukural AI' : 'திருக்குறள் AI'}
        </h1>
        <div className="flex gap-4">
          <select
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
          </select>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </motion.div>
      <div className="flex w-full max-w-5xl gap-6">
        <ChatWindow user={user} language={language} theme={theme} />
        <HistoryPanel user={user} language={language} theme={theme} />
      </div>
    </div>
  );
}

export default Home;