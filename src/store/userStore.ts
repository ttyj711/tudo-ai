import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../types';

interface UserStore {
  users: User[];
  currentUserId: string | null;
  showUserModal: boolean;

  // Actions
  getCurrentUser: () => User | null;
  addUser: (name: string, avatar: string, color: string) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  switchUser: (id: string) => void;
  openUserModal: () => void;
  closeUserModal: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      showUserModal: false,

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        return users.find(u => u.id === currentUserId) || null;
      },

      addUser: (name, avatar, color) => {
        const newUser: User = {
          id: uuidv4(),
          name,
          avatar,
          color,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
          currentUserId: state.users.length === 0 ? newUser.id : state.currentUserId,
        }));
        return newUser;
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => {
          const newUsers = state.users.filter(u => u.id !== id);
          return {
            users: newUsers,
            currentUserId: state.currentUserId === id
              ? (newUsers.length > 0 ? newUsers[0].id : null)
              : state.currentUserId,
          };
        });
      },

      switchUser: (id) => {
        set({ currentUserId: id });
      },

      openUserModal: () => set({ showUserModal: true }),
      closeUserModal: () => set({ showUserModal: false }),
    }),
    {
      name: 'todo-users',
    }
  )
);
