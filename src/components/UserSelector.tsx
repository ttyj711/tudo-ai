import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, Trash2, X, Edit2, Check } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { AVATAR_OPTIONS, USER_COLORS } from '../types';

interface UserSelectorProps {
  onUserChange?: () => void;
}

export default function UserSelector({ onUserChange }: UserSelectorProps) {
  const { users, currentUserId, getCurrentUser, addUser, updateUser, deleteUser, switchUser, showUserModal, openUserModal, closeUserModal } = useUserStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATAR_OPTIONS[0]);
  const [newColor, setNewColor] = useState(USER_COLORS[0]);

  const currentUser = getCurrentUser();

  const handleCreateUser = () => {
    if (!newName.trim()) return;
    const user = addUser(newName.trim(), newAvatar, newColor);
    switchUser(user.id);
    setNewName('');
    setNewAvatar(AVATAR_OPTIONS[0]);
    setNewColor(USER_COLORS[0]);
    setIsCreating(false);
    closeUserModal();
    onUserChange?.();
  };

  const handleUpdateUser = () => {
    if (!editingUserId || !newName.trim()) return;
    updateUser(editingUserId, { name: newName.trim(), avatar: newAvatar, color: newColor });
    setEditingUserId(null);
    setNewName('');
  };

  const startEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUserId(userId);
      setNewName(user.name);
      setNewAvatar(user.avatar);
      setNewColor(user.color);
    }
  };

  const handleSwitchUser = (userId: string) => {
    switchUser(userId);
    closeUserModal();
    onUserChange?.();
  };

  return (
    <>
      {/* Current User Display */}
      <button
        onClick={openUserModal}
        className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all shadow-sm"
      >
        {currentUser ? (
          <>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${currentUser.color}20` }}
            >
              {currentUser.avatar}
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
              {currentUser.name}
            </span>
          </>
        ) : (
          <>
            <User size={18} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">选择用户</span>
          </>
        )}
      </button>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeUserModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  用户管理
                </h2>
                <button
                  onClick={closeUserModal}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* User List */}
                {users.length > 0 && (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          currentUserId === user.id
                            ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (currentUserId !== user.id && editingUserId !== user.id) {
                            handleSwitchUser(user.id);
                          }
                        }}
                      >
                        {editingUserId === user.id ? (
                          // Edit Mode
                          <div className="flex-1 space-y-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              autoFocus
                            />
                            <div className="flex gap-2 flex-wrap">
                              {AVATAR_OPTIONS.slice(0, 8).map((avatar) => (
                                <button
                                  key={avatar}
                                  onClick={() => setNewAvatar(avatar)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                                    newAvatar === avatar ? 'ring-2 ring-primary-500 scale-110' : ''
                                  }`}
                                  style={{ backgroundColor: `${newColor}20` }}
                                >
                                  {avatar}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-1">
                              {USER_COLORS.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setNewColor(color)}
                                  className={`w-6 h-6 rounded-full transition-all ${
                                    newColor === color ? 'ring-2 ring-offset-1' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleUpdateUser}
                                className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <span
                              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                              style={{ backgroundColor: `${user.color}20` }}
                            >
                              {user.avatar}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 dark:text-white truncate">{user.name}</p>
                              {currentUserId === user.id && (
                                <p className="text-xs text-primary-500 flex items-center gap-1">
                                  <Check size={12} />
                                  当前用户
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEdit(user.id);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 transition-colors"
                                title="编辑"
                              >
                                <Edit2 size={16} />
                              </button>
                              {users.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteUser(user.id);
                                  }}
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                                  title="删除"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Create New User */}
                {isCreating ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="输入用户名..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />

                    {/* Avatar Selection */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">选择头像</label>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_OPTIONS.map((avatar) => (
                          <button
                            key={avatar}
                            onClick={() => setNewAvatar(avatar)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                              newAvatar === avatar ? 'ring-2 ring-primary-500 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: `${newColor}20` }}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">选择颜色</label>
                      <div className="flex gap-2">
                        {USER_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewColor(color)}
                            className={`w-8 h-8 rounded-full transition-all ${
                              newColor === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateUser}
                        disabled={!newName.trim()}
                        className="flex-1 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                      >
                        创建用户
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setNewName('');
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                  >
                    <Plus size={20} />
                    添加新用户
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
