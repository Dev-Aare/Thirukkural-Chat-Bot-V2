import { motion } from "framer-motion";

function Message({ text, isBot, theme }) {
  return (
    <motion.div
      className={`mb-4 ${isBot ? "text-left" : "text-right"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`inline-block p-4 rounded-xl shadow-md ${
          isBot
            ? `${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-800"
              }`
            : "bg-primary text-white"
        }`}
      >
        {text.split("\n").map((line, idx) => (
          <p key={idx} className={`text-sm ${idx > 0 ? "mt-4" : ""}`}>
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default Message;
