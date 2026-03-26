import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Keyboard } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import ThemeToggle from './components/ThemeToggle';
import UserSelector from './components/UserSelector';
import { useTaskStore } from './store/taskStore';
import { useUserStore } from './store/userStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';

function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { openModal, resetFilter } = useTaskStore();
  const currentUserId = useUserStore((state) => state.currentUserId);
  useTheme(); // Initialize theme
  useKeyboardShortcuts(searchInputRef);

  const handleUserChange = () => {
    resetFilter();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              Todo App
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              高效管理你的任务
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UserSelector onUserChange={handleUserChange} />
            <ThemeToggle />
          </div>
        </motion.header>

        {/* Filter section */}
        {currentUserId && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 relative z-30"
          >
            <TaskFilter />
          </motion.section>
        )}

        {/* Task list */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 relative z-10"
        >
          <TaskList />
        </motion.section>

        {/* Add button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          disabled={!currentUserId}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all"
        >
          <Plus size={24} />
        </motion.button>

        {/* Keyboard shortcuts hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-8 left-8 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"
        >
          <Keyboard size={14} />
          <span>N 新建 | ↑↓ 选择 | E 编辑 | Enter 完成 | Delete 删除 | / 搜索</span>
        </motion.div>

        {/* Modal */}
        <TaskForm />
      </div>
    </div>
  );
}

export default App;
