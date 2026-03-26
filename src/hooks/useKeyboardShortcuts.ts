import { useHotkeys } from 'react-hotkeys-hook';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';

export function useKeyboardShortcuts(searchInputRef: React.RefObject<HTMLInputElement | null>) {
  const { openModal, deleteTask, toggleComplete, selectedTaskId, setSelectedTask, getUserTasks } = useTaskStore();
  const currentUserId = useUserStore((state) => state.currentUserId);
  const tasks = getUserTasks(currentUserId || '');

  // N - New task
  useHotkeys('n', (e) => {
    e.preventDefault();
    // Don't trigger if typing in an input
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    if (currentUserId) {
      openModal();
    }
  }, { enableOnFormTags: false });

  // / - Focus search
  useHotkeys('/', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  }, { enableOnFormTags: false });

  // Escape - Close modal / deselect
  useHotkeys('escape', () => {
    setSelectedTask(null);
    searchInputRef.current?.blur();
  });

  // Delete - Delete selected task
  useHotkeys('delete, backspace', (e) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    if (selectedTaskId && currentUserId) {
      e.preventDefault();
      deleteTask(currentUserId, selectedTaskId);
    }
  }, { enableOnFormTags: false });

  // Enter - Toggle complete
  useHotkeys('enter', () => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    if (selectedTaskId && currentUserId) {
      toggleComplete(currentUserId, selectedTaskId);
    }
  }, { enableOnFormTags: false });

  // Arrow keys for navigation
  useHotkeys('up', () => {
    if (selectedTaskId) {
      const index = tasks.findIndex((t) => t.id === selectedTaskId);
      if (index > 0) {
        setSelectedTask(tasks[index - 1].id);
      }
    } else if (tasks.length > 0) {
      setSelectedTask(tasks[0].id);
    }
  }, { enableOnFormTags: false });

  useHotkeys('down', () => {
    if (selectedTaskId) {
      const index = tasks.findIndex((t) => t.id === selectedTaskId);
      if (index < tasks.length - 1) {
        setSelectedTask(tasks[index + 1].id);
      }
    } else if (tasks.length > 0) {
      setSelectedTask(tasks[0].id);
    }
  }, { enableOnFormTags: false });

  // E - Edit selected task
  useHotkeys('e', () => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }
    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (task) {
        openModal(task);
      }
    }
  }, { enableOnFormTags: false });
}
