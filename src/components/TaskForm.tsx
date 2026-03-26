import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Tag, Clock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import type { Priority } from '../types';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../types';

export default function TaskForm() {
  const currentUserId = useUserStore((state) => state.currentUserId);
  const { isModalOpen, editingTask, closeModal, addTask, updateTask, getUserCategories } = useTaskStore();
  const categories = getUserCategories(currentUserId || '');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setCategoryId(editingTask.categoryId);
      setDueDate(editingTask.dueDate ? format(new Date(editingTask.dueDate), 'yyyy-MM-dd') : '');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategoryId('personal');
    setDueDate('');
    setShowDatePicker(false);
    setCurrentMonth(new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUserId) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      categoryId,
      dueDate: dueDate || undefined,
      completed: editingTask?.completed || false,
    };

    if (editingTask) {
      updateTask(currentUserId, editingTask.id, taskData);
    } else {
      addTask(currentUserId, taskData);
    }

    closeModal();
    resetForm();
  };

  const handleClose = () => {
    closeModal();
    resetForm();
  };

  // Quick date options
  const quickDates = [
    { label: '今天', date: new Date() },
    { label: '明天', date: addDays(new Date(), 1) },
    { label: '后天', date: addDays(new Date(), 2) },
    { label: '下周', date: addDays(new Date(), 7) },
  ];

  // Get all days in month for calendar
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const selectedDateLabel = dueDate
    ? format(new Date(dueDate), 'MM月dd日 EEEE', { locale: zhCN })
    : '选择日期';

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/20 dark:border-gray-700/30"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl shadow-lg shadow-primary-500/25">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {editingTask ? '编辑任务' : '新建任务'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative p-6 space-y-5">
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入任务标题..."
                  autoFocus
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-400 rounded-2xl focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 text-lg font-medium transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="添加描述..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-400 rounded-2xl focus:outline-none text-gray-600 dark:text-gray-300 placeholder-gray-400 resize-none transition-all"
                />
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">
                    <Tag size={12} />
                    分类
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                          categoryId === cat.id
                            ? 'shadow-lg scale-105'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: categoryId === cat.id ? cat.color : `${cat.color}20`,
                          color: categoryId === cat.id ? 'white' : cat.color,
                          boxShadow: categoryId === cat.id ? `0 4px 14px ${cat.color}40` : 'none',
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">
                    <Flag size={12} />
                    优先级
                  </label>
                  <div className="flex gap-1.5">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                          priority === p ? 'shadow-lg scale-105' : 'opacity-50 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: priority === p ? PRIORITY_COLORS[p] : `${PRIORITY_COLORS[p]}20`,
                          color: priority === p ? 'white' : PRIORITY_COLORS[p],
                          boxShadow: priority === p ? `0 4px 14px ${PRIORITY_COLORS[p]}40` : 'none',
                        }}
                      >
                        {PRIORITY_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">
                  <Clock size={12} />
                  截止日期
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl transition-all text-left ${
                      showDatePicker ? 'border-primary-500' : 'border-transparent'
                    } ${dueDate ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}
                  >
                    <Calendar size={18} className={dueDate ? 'text-primary-500' : ''} />
                    <span className="font-medium">{selectedDateLabel}</span>
                    {dueDate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDueDate('');
                        }}
                        className="ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </button>

                  <AnimatePresence>
                    {showDatePicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-10"
                      >
                        {/* Quick dates */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {quickDates.map((item) => {
                            const dateStr = format(item.date, 'yyyy-MM-dd');
                            const isSelected = dueDate === dateStr;
                            return (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                  setDueDate(dateStr);
                                  setShowDatePicker(false);
                                }}
                                className={`py-2 rounded-xl text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Month navigation */}
                        <div className="flex items-center justify-between mb-3">
                          <button
                            type="button"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <ChevronLeft size={16} className="text-gray-500" />
                          </button>
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {format(currentMonth, 'yyyy年MM月', { locale: zhCN })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <ChevronRight size={16} className="text-gray-500" />
                          </button>
                        </div>

                        {/* Week day headers */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
                            <div key={d} className="text-xs text-gray-400 py-1 font-medium">
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {getMonthDays().map((date) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const isSelected = dueDate === dateStr;
                            const isTodayDate = isSameDay(date, new Date());
                            const isCurrentMonth = isSameMonth(date, currentMonth);
                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() => {
                                  setDueDate(dateStr);
                                  setShowDatePicker(false);
                                }}
                                className={`py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  isSelected
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : isTodayDate
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                    : isCurrentMonth
                                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    : 'text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                {format(date, 'd')}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!title.trim() || !currentUserId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                {editingTask ? '保存修改' : '添加任务'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
