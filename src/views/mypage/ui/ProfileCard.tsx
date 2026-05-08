'use client';

import { useTranslations } from 'next-intl';
import { Avatar } from '@/shared/ui';
import { User, AVATAR_PRESETS } from '@/entities/user';

interface ProfileCardProps {
  user: User;
  editing: boolean;
  tempNickname: string;
  tempAvatar: { id: string; emoji: string; color: string };
  nicknameError: string;
  stats: { likes: number; comments: number };
  onStartEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onAvatarChange: (preset: { id: string; emoji: string; color: string }) => void;
  onNicknameChange: (val: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function ProfileCard({
  user,
  editing,
  tempNickname,
  tempAvatar,
  nicknameError,
  stats,
  onStartEdit,
  onSave,
  onCancelEdit,
  onAvatarChange,
  onNicknameChange,
  onLogout,
  onDeleteAccount,
}: ProfileCardProps) {
  const t = useTranslations('mypage');

  return (
    <aside className="mb-8 lg:mb-0">
      <div className="lg:sticky lg:top-24">
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5">
            <Avatar
              src={
                editing
                  ? undefined
                  : user.image?.startsWith('http') || user.image?.startsWith('/')
                    ? user.image
                    : undefined
              }
              emoji={
                editing
                  ? tempAvatar.emoji
                  : AVATAR_PRESETS.find((p) => p.id === user.image || p.emoji === user.image)
                      ?.emoji || '👤'
              }
              color={
                editing
                  ? tempAvatar.color
                  : AVATAR_PRESETS.find((p) => p.id === user.image || p.emoji === user.image)
                      ?.color || '#f3f4f6'
              }
            />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold truncate">{user.name}</div>
              <div className="text-sm text-gray-400 mt-0.5 truncate">{user.email}</div>
            </div>
          </div>

          {/* Stats */}
          {!editing && (
            <div className="flex gap-6 mb-5 pb-5 border-b border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-black">{stats.likes}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t('likes')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black">{stats.comments}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t('comments')}</div>
              </div>
            </div>
          )}

          {!editing ? (
            <button
              onClick={onStartEdit}
              className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {t('editProfile')}
            </button>
          ) : (
            /* Edit form */
            <div>
              <div className="mb-4">
                <div className="text-sm font-bold mb-2">{t('avatarLabel')}</div>
                <div className="grid grid-cols-6 gap-1.5">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = tempAvatar.id === preset.id;
                    return (
                      <button
                        key={preset.emoji}
                        type="button"
                        onClick={() => onAvatarChange(preset)}
                        className={`aspect-square rounded-full flex items-center justify-center text-xl transition-all cursor-pointer border-2 ${
                          isSelected
                            ? 'border-black scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.color }}
                      >
                        {preset.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-bold mb-2">{t('nicknameLabel')}</div>
                <input
                  type="text"
                  value={tempNickname}
                  onChange={(e) => onNicknameChange(e.target.value)}
                  placeholder={t('nicknamePlaceholder')}
                  maxLength={20}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 outline-none transition-colors ${
                    nicknameError ? 'border-red-400' : 'border-gray-200 focus:border-black'
                  }`}
                />
                {nicknameError && <p className="text-red-500 text-xs mt-1">{nicknameError}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {t('save')}
                </button>
                <button
                  onClick={onCancelEdit}
                  className="flex-1 py-2.5 border border-gray-200 bg-white text-gray-500 rounded-xl text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Account actions */}
        <div className="mt-4 flex justify-between items-center px-2">
          <button
            onClick={onDeleteAccount}
            className="text-sm text-red-500 font-semibold hover:text-red-600 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {t('deleteAccount')}
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </aside>
  );
}
