import { format, isPast, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Edit2,
  GripVertical,
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../types';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import CategoryBadge from './CategoryBadge';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const currentUserId = useUserStore((state) => state.currentUserId);
  const { toggleComplete, deleteTask, openModal, setSelectedTask, selectedTaskId, getUserCategories } =
    useTaskStore();
  const categories = getUserCategories(currentUserId || '');
  const category = categories.find((c) => c.id === task.categoryId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedTaskId === task.id;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md
        rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50
        transition-all duration-300 cursor-pointer
        ${isSelected ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''}
        ${isDragging ? 'opacity-50 shadow-2xl scale-105 z-50' : ''}
        ${task.completed ? 'opacity-60' : ''}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
        ${isDueToday && !task.completed ? 'border-l-4 border-l-yellow-500' : ''}
      `}
      onClick={() => setSelectedTask(task.id)}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-none"
        >
          <GripVertical size={18} />
        </div>

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete(currentUserId || '', task.id);
          }}
          className="mt-0.5 transition-transform hover:scale-110"
        >
          {task.completed ? (
            <CheckCircle2
              size={22}
              className="text-green-500 dark:text-green-400"
            />
          ) : (
            <Circle
              size={22}
              className="text-gray-400 hover:text-primary-500 transition-colors"
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              font-medium text-gray-800 dark:text-gray-100
              ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}
            `}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {category && <CategoryBadge category={category} />}

            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${PRIORITY_COLORS[task.priority]}20`,
                color: PRIORITY_COLORS[task.priority],
              }}
            >
              {PRIORITY_LABELS[task.priority]}优先级
            </span>

            {task.dueDate && (
              <span
                className={`flex items-center gap-1 text-xs ${
                  isOverdue
                    ? 'text-red-500 dark:text-red-400'
                    : isDueToday
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Calendar size={12} />
                {format(new Date(task.dueDate), 'MM月dd日', { locale: zhCN })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(task);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(currentUserId || '', task.id);
            }}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
