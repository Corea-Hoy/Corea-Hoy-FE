'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUsersStore, AVATAR_PRESETS, useLikedContents } from '@/entities/user';

import { ProfileCard } from './ProfileCard';
import { LikedContentList } from './LikedContentList';
import { useLogout, useUpdateProfile, useDeleteAccount } from '@/features/auth';

export function MyPage() {
  const router = useRouter();
  const t = useTranslations('mypage');
  const locale = useLocale();
  const { user } = useUsersStore();
  const { onLogout } = useLogout();
  const { onUpdateProfile } = useUpdateProfile();
  const { onDeleteAccount } = useDeleteAccount();
  const { likedContents } = useLikedContents();
  const isKo = locale === 'ko';

  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [tempAvatar, setTempAvatar] = useState(AVATAR_PRESETS[0]);
  const [nicknameError, setNicknameError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentUser = user || {
    id: 'mock-id',
    name: '테스트 유저',
    email: 'test@example.com',
    image: '🐨',
    role: 'user',
    likedContentIds: [],
  };

  if (!mounted) return null;

  function startEdit() {
    setTempNickname(currentUser.name);
    setTempAvatar(
      AVATAR_PRESETS.find((p) => p.id === currentUser.image || p.emoji === currentUser.image) ??
        AVATAR_PRESETS[0],
    );
    setNicknameError('');
    setEditing(true);
  }

  function handleSave() {
    const trimmed = tempNickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setNicknameError(t('nicknameError'));
      return;
    }
    onUpdateProfile({ nickname: trimmed, avatarId: tempAvatar.id });
    setEditing(false);
  }

  function handleLogout() {
    onLogout();
  }

  function handleDeleteAccount() {
    onDeleteAccount();
  }

  return (
    <div className="py-6 md:py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">{t('title')}</h1>

      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-10 lg:items-start">
        <ProfileCard
          user={currentUser}
          editing={editing}
          tempNickname={tempNickname}
          tempAvatar={tempAvatar}
          nicknameError={nicknameError}
          stats={{ likes: likedContents.length }}
          onStartEdit={startEdit}
          onSave={handleSave}
          onCancelEdit={() => setEditing(false)}
          onAvatarChange={setTempAvatar}
          onNicknameChange={(val) => {
            setTempNickname(val);
            setNicknameError('');
          }}
          onLogout={handleLogout}
          onDeleteAccount={() => setShowDeleteModal(true)}
        />

        <section>
          <LikedContentList />
        </section>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-black text-lg mb-2">{t('deleteConfirmTitle')}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{t('deleteConfirmDesc')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-200 bg-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {t('deleteCancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-red-600 transition-colors"
              >
                {t('deleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
