import { useState, useEffect } from 'react';
import { getQueryHistory } from '../firebase/firebase';
import { motion } from 'framer-motion';

function HistoryPanel({ user, language, theme }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const queries = await getQueryHistory(user.uid);
      setHistory(queries);
    };
    fetchHistory();
  }, [user.uid]);

  return (
    <motion.div
      className={`w-1/3 rounded-2xl h-[750px] overflow-y-scroll shadow-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'glass-effect'}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h2 className="text-xl font-bold text-primary mb-4">
        {language === 'en' ? 'Query History' : 'வினவல் வரலாறு'}
      </h2>
      <div className="space-y-3">
        {history.map((query, idx) => (
          <div key={idx} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <p className="text-sm">{query.query}</p>
            <p className="text-xs text-gray-500">
              {new Date(query.timestamp?.toDate()).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default HistoryPanel;