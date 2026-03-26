import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Category, FilterState } from '../types';
import { DEFAULT_CATEGORIES } from '../types';

interface UserData {
  tasks: Task[];
  categories: Category[];
}

interface TaskStore {
  // All users' data stored by userId
  usersData: Record<string, UserData>;
  filter: FilterState;
  selectedTaskId: string | null;
  isModalOpen: boolean;
  editingTask: Task | null;

  // Get current user's data
  getUserTasks: (userId: string) => Task[];
  getUserCategories: (userId: string) => Category[];

  // Task actions
  addTask: (userId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'userId'>) => void;
  updateTask: (userId: string, id: string, updates: Partial<Task>) => void;
  deleteTask: (userId: string, id: string) => void;
  toggleComplete: (userId: string, id: string) => void;
  reorderTasks: (userId: string, tasks: Task[]) => void;

  // Category actions
  addCategory: (userId: string, name: string, color: string) => void;
  updateCategory: (userId: string, id: string, updates: Partial<Category>) => void;
  deleteCategory: (userId: string, id: string) => void;

  // Filter actions
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;

  // UI actions
  setSelectedTask: (id: string | null) => void;
  openModal: (task?: Task) => void;
  closeModal: () => void;
}

const initialFilter: FilterState = {
  search: '',
  categoryId: null,
  priority: null,
  showCompleted: true,
};

const createDefaultUserData = (): UserData => ({
  tasks: [],
  categories: DEFAULT_CATEGORIES,
});

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      usersData: {},
      filter: initialFilter,
      selectedTaskId: null,
      isModalOpen: false,
      editingTask: null,

      getUserTasks: (userId) => {
        const userData = get().usersData[userId];
        return userData?.tasks || [];
      },

      getUserCategories: (userId) => {
        const userData = get().usersData[userId];
        return userData?.categories || DEFAULT_CATEGORIES;
      },

      addTask: (userId, taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          order: 0,
          userId,
        };

        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                tasks: [...userData.tasks, { ...newTask, order: userData.tasks.length }],
              },
            },
          };
        });
      },

      updateTask: (userId, id, updates) => {
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                tasks: userData.tasks.map((task) =>
                  task.id === id
                    ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                    : task
                ),
              },
            },
          };
        });
      },

      deleteTask: (userId, id) => {
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                tasks: userData.tasks.filter((task) => task.id !== id),
              },
            },
            selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
          };
        });
      },

      toggleComplete: (userId, id) => {
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                tasks: userData.tasks.map((task) =>
                  task.id === id
                    ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
                    : task
                ),
              },
            },
          };
        });
      },

      reorderTasks: (userId, tasks) => {
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                tasks,
              },
            },
          };
        });
      },

      addCategory: (userId, name, color) => {
        const newCategory: Category = {
          id: uuidv4(),
          name,
          color,
        };
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                categories: [...userData.categories, newCategory],
              },
            },
          };
        });
      },

      updateCategory: (userId, id, updates) => {
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                ...userData,
                categories: userData.categories.map((cat) =>
                  cat.id === id ? { ...cat, ...updates } : cat
                ),
              },
            },
          };
        });
      },

      deleteCategory: (userId, id) => {
        set((state) => {
          const userData = state.usersData[userId] || createDefaultUserData();
          return {
            usersData: {
              ...state.usersData,
              [userId]: {
                categories: userData.categories.filter((cat) => cat.id !== id),
                tasks: userData.tasks.map((task) =>
                  task.categoryId === id ? { ...task, categoryId: 'other' } : task
                ),
              },
            },
          };
        });
      },

      setFilter: (filter) => {
        set((state) => ({ filter: { ...state.filter, ...filter } }));
      },

      resetFilter: () => {
        set({ filter: initialFilter });
      },

      setSelectedTask: (id) => {
        set({ selectedTaskId: id });
      },

      openModal: (task) => {
        set({ isModalOpen: true, editingTask: task || null });
      },

      closeModal: () => {
        set({ isModalOpen: false, editingTask: null });
      },
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({
        usersData: state.usersData,
      }),
    }
  )
);
