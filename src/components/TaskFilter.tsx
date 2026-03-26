import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import type { Priority } from '../types';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../types';

export default function TaskFilter() {
  const currentUserId = useUserStore((state) => state.currentUserId);
  const { filter, setFilter, resetFilter, getUserCategories } = useTaskStore();
  const categories = getUserCategories(currentUserId || '');

  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filter.search || filter.categoryId || filter.priority;

  const priorityOptions: { value: Priority; color: string }[] = [
    { value: 'high', color: '#ef4444' },
    { value: 'medium', color: '#f59e0b' },
    { value: 'low', color: '#3b82f6' },
  ];

  // Count active filters
  const activeFilterCount = [
    filter.categoryId,
    filter.priority,
    !filter.showCompleted,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Search Row */}
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            placeholder="搜索任务..."
            className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-gray-800 dark:text-white placeholder-gray-400 shadow-sm"
          />
          {filter.search && (
            <button
              onClick={() => setFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative px-4 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${
            activeFilterCount > 0
              ? 'bg-primary-500 text-white'
              : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline text-sm font-medium">筛选</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm space-y-4">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">分类</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilter({ categoryId: filter.categoryId === cat.id ? null : cat.id })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                        filter.categoryId === cat.id
                          ? 'ring-2 scale-105'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                        borderColor: cat.color,
                      }}
                    >
                      {filter.categoryId === cat.id && <Check size={14} />}
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">优先级</label>
                <div className="flex gap-2">
                  {priorityOptions.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setFilter({ priority: filter.priority === p.value ? null : p.value })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                        filter.priority === p.value
                          ? 'ring-2 scale-105'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: `${p.color}20`,
                        color: p.color,
                        borderColor: p.color,
                      }}
                    >
                      {filter.priority === p.value && <Check size={14} />}
                      {PRIORITY_LABELS[p.value]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">状态</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter({ showCompleted: true })}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      filter.showCompleted
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setFilter({ showCompleted: false })}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      !filter.showCompleted
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    未完成
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={resetFilter}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                    清除所有筛选
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Tags */}
      {hasActiveFilters && !showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-xs text-gray-400">已筛选:</span>

          {filter.categoryId && (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: `${categories.find(c => c.id === filter.categoryId)?.color}20`,
                color: categories.find(c => c.id === filter.categoryId)?.color,
              }}
            >
              {categories.find(c => c.id === filter.categoryId)?.name}
              <button onClick={() => setFilter({ categoryId: null })} className="hover:opacity-70">
                <X size={12} />
              </button>
            </span>
          )}

          {filter.priority && (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: `${PRIORITY_COLORS[filter.priority]}20`,
                color: PRIORITY_COLORS[filter.priority],
              }}
            >
              {PRIORITY_LABELS[filter.priority]}优先级
              <button onClick={() => setFilter({ priority: null })} className="hover:opacity-70">
                <X size={12} />
              </button>
            </span>
          )}

          {!filter.showCompleted && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              仅未完成
              <button onClick={() => setFilter({ showCompleted: true })} className="hover:opacity-70">
                <X size={12} />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
