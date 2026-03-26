import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center ${
          theme === 'dark' ? 'left-8' : 'left-1'
        }`}
      >
        {theme === 'light' ? (
          <Sun size={12} className="text-yellow-500" />
        ) : (
          <Moon size={12} className="text-primary-400" />
        )}
      </motion.div>
    </button>
  );
}
