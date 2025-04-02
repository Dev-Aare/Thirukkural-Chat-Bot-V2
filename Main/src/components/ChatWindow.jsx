import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import InputBox from "./InputBox";
import SuggestionBox from "./SuggestionBox";
import {
  db,
  getCoupletByNumber,
  getCoupletsByChapter,
  getRandomCouplets,
  saveQuery,
} from "../firebase/firebase";
import { getAIResponse } from "../firebase/openai";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { collection, getDocs } from "firebase/firestore";

function ChatWindow({ user, language, theme }) {
  const [messages, setMessages] = useState([
    {
      text:
        language === "en"
          ? "Hello! Ask about Thirukural (e.g., 'Couplet 1', 'Chapter 1', 'Chapter 1' or 'Any 10 kurals'!)."
          : "வணக்கம்! திருக்குறள் பற்றி கேளுங்கள் (எ.கா., 'குறள் 1', 'அதிகாரம் 1', '10 குறள்கள்'!).",
      isBot: true,
    },
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text) => {
    const userMessage = { text, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    await saveQuery(user.uid, text);

    const response = await processQuery(text);
    const botMessage = { text: response, isBot: true };
    setMessages((prev) => [...prev, botMessage]);
    setSuggestions([]);
    speak(response); // Text-to-speech
  };

  const processQuery = async (text) => {
    const lowerText = text.toLowerCase();

    // Couplet by number
    const coupletMatch = lowerText.match(/(couplet|குறள்)\s*(\d+)/i);
    console.log("Match Result:", coupletMatch);

    if (coupletMatch) {
      const number = parseInt(coupletMatch[2]);
      const couplet = await getCoupletByNumber(number);
      if (couplet) return formatCouplet(couplet, language);
      return language === "en" ? "Couplet not found." : "குறள் கிடைக்கவில்லை.";
    }

    // Chapter
    const chapterMatch = lowerText.match(/(chapter|அதிகாரம்)\s*(\d+)/i);

    if (chapterMatch) {
      const chapter = parseInt(chapterMatch[2]);
      const couplets = await getCoupletsByChapter(chapter);
      if (couplets.length > 0) {
        return `${
          language === "en" ? "Chapter" : "அதிகாரம்"
        } ${chapter}:\n${couplets
          .map((c) => formatCouplet(c, language))
          .join("\n\n")}`;
      }
      return language === "en"
        ? "Chapter not found."
        : "அதிகாரம் கிடைக்கவில்லை.";
    }

    // Random couplets
    if (
      (lowerText.includes("any") && lowerText.match(/\d+/)) ||
      lowerText.includes("குறள்கள்")
    ) {
      const count = parseInt(lowerText.match(/\d+/)?.[0] || 10);
      const couplets = await getRandomCouplets(count);
      return couplets.map((c) => formatCouplet(c, language)).join("\n\n");
    }

    // Sentence completion
    if (text.split(" ").length > 1) {
      const couplets = await getDocs(collection(db, "thirukural"));
      const allCouplets = couplets.docs.map((doc) => doc.data());
      return await getAIResponse(text, allCouplets.slice(0, 10));
    }

    return language === "en"
      ? "Try 'Couplet 1', 'Chapter 1', 'Chapter 1' or 'Any 10 kurals'!"
      : "முயற்சிக்கவும்: 'குறள் 1', 'அதிகாரம் 1', '10 குறள்கள்'!";
  };

  const handleTyping = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.startsWith("coup") || lowerText.startsWith("குற")) {
      setSuggestions(["Couplet 1", "Couplet 5", "Couplet 10"]);
    } else if (lowerText.startsWith("chap") || lowerText.startsWith("அதி")) {
      setSuggestions(["Chapter 1", "Chapter 2", "Chapter 3"]);
    } else if (
      lowerText.startsWith("any") ||
      lowerText.startsWith("குறள்கள்")
    ) {
      setSuggestions(["Any 5 kurals", "Any 10 kurals"]);
    } else {
      setSuggestions([]);
    }
  };

  const formatCouplet = (couplet, lang) => {
    return lang === "en"
      ? `Couplet ${couplet.Number}:\n${couplet.Line1}\n${couplet.Line2}\n\nTranslation: ${couplet.Translation}\n\nMV: ${couplet.mv}`
      : `குறள் ${couplet.Number}:\n${couplet.Line1}\n${couplet.Line2}\n\nமொழிபெயர்ப்பு: ${couplet.Translation}\n\nMV: ${couplet.mv}`;
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : "ta-IN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      className={`flex-1 rounded-2xl shadow-2xl overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "glass-effect"
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="h-[750px] overflow-y-scroll p-6">
        {messages.map((msg, idx) => (
          <Message key={idx} text={msg.text} isBot={msg.isBot} theme={theme} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* <SuggestionBox
        suggestions={suggestions}
        onSelect={handleSendMessage}
        theme={theme}
      /> */}
      <InputBox
        onSend={handleSendMessage}
        onTyping={handleTyping}
        theme={theme}
        language={language}
      />
    </motion.div>
  );
}

export default ChatWindow;
