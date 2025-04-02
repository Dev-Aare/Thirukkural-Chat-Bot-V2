import { signInWithGoogle } from '../firebase/firebase';
import { motion } from 'framer-motion';

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="p-8 glass-effect rounded-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-3xl font-bold text-primary mb-6">Welcome</h2>
        <motion.button
          onClick={signInWithGoogle}
          className="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-purple-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Login;