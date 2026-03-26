import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ListTodo } from 'lucide-react';
import TaskItem from './TaskItem';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';

export default function TaskList() {
  const currentUserId = useUserStore((state) => state.currentUserId);
  const usersData = useTaskStore((state) => state.usersData);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const filter = useTaskStore((state) => state.filter);

  // Get tasks directly from usersData to ensure reactivity
  const tasks = useMemo(() => {
    if (!currentUserId) return [];
    return usersData[currentUserId]?.tasks || [];
  }, [currentUserId, usersData]);

  // Use useMemo to cache filtered tasks
  const filteredTasks = useMemo(() => {
    if (!currentUserId) return [];

    let result = tasks;

    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search)
      );
    }

    if (filter.categoryId) {
      result = result.filter((task) => task.categoryId === filter.categoryId);
    }

    if (filter.priority) {
      result = result.filter((task) => task.priority === filter.priority);
    }

    if (!filter.showCompleted) {
      result = result.filter((task) => !task.completed);
    }

    return result.sort((a, b) => a.order - b.order);
  }, [tasks, filter, currentUserId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
      const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

      const newTasks = arrayMove(filteredTasks, oldIndex, newIndex).map((task, index) => ({
        ...task,
        order: index,
      }));

      reorderTasks(currentUserId || '', newTasks);
    }
  };

  if (!currentUserId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <ListTodo size={64} className="opacity-30 mb-4" />
        <p className="text-lg font-medium">请先选择用户</p>
        <p className="text-sm mt-1">点击右上角创建或选择用户</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <ListTodo size={64} className="opacity-30 mb-4" />
        <p className="text-lg font-medium">暂无任务</p>
        <p className="text-sm mt-1">按 N 键或点击下方按钮添加新任务</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
