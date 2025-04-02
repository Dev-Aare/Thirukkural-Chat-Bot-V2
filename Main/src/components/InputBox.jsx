import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone } from 'react-icons/fa';
import toast from 'react-hot-toast';

function InputBox({ onSend, onTyping, theme, language }) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language === 'en' ? 'en-US' : 'ta-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);
      onTyping(transcript);
      onSend(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => toast.error('Speech recognition failed');
    recognition.start();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex gap-3">
        <motion.input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping(e.target.value);
          }}
          placeholder={language === 'en' ? 'Ask about Thirukural...' : 'திருக்குறள் பற்றி கேளுங்கள்...'}
          className={`flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${
            theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          }`}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          type="button"
          onClick={startListening}
          className={`p-3 rounded-xl ${isListening ? 'bg-accent' : 'bg-secondary'} text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaMicrophone />
        </motion.button>
        <motion.button
          type="submit"
          className="px-6 py-3 bg-primary text-white rounded-xl shadow hover:bg-purple-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </div>
    </form>
  );
}

export default InputBox;