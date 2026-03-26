export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  avatar: string; // emoji avatar
  color: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  categoryId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface FilterState {
  search: string;
  categoryId: string | null;
  priority: Priority | null;
  showCompleted: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '工作', color: '#3b82f6' },
  { id: 'personal', name: '个人', color: '#22c55e' },
  { id: 'study', name: '学习', color: '#a855f7' },
  { id: 'other', name: '其他', color: '#6b7280' },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

export const AVATAR_OPTIONS = ['👤', '🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐯', '🦄', '🐲', '🌟', '🎉', '🚀', '💡', '🎨', '🎵'];

export const USER_COLORS = [
  '#3b82f6', '#22c55e', '#a855f7', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6',
];
