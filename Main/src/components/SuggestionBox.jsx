import { motion } from 'framer-motion';

function SuggestionBox({ suggestions, onSelect, theme }) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex gap-2 flex-wrap">
        {suggestions.map((suggestion, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelect(suggestion)}
            className="px-3 py-1 bg-primary text-white rounded-full hover:bg-purple-700"
            whileHover={{ scale: 1.1 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default SuggestionBox;