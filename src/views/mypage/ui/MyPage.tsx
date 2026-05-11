'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUsersStore, AVATAR_PRESETS, useLikedContents } from '@/entities/user';

import { ProfileCard } from './ProfileCard';
import { LikedContentList } from './LikedContentList';
import { useLogout, useUpdateProfile, useDeleteAccount } from '@/features/auth';
import { ConfirmModal, AlertModal } from '@/shared/ui';

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    setShowSaveModal(true);
  }

  function confirmSave() {
    const trimmed = tempNickname.trim();
    onUpdateProfile(
      { nickname: trimmed, avatarId: tempAvatar.id },
      {
        onSuccess: () => {
          setEditing(false);
          setShowSaveModal(false);
          setShowSuccessModal(true);
        },
        onError: () => {
          setShowSaveModal(false);
        },
      },
    );
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

      <ConfirmModal
        show={showSaveModal}
        title={isKo ? '프로필 변경' : 'Update Profile'}
        confirmText={isKo ? '네' : 'Yes'}
        cancelText={isKo ? '아니요' : 'No'}
        text={
          <div className="flex flex-col items-center gap-3">
            <div className="text-5xl bg-gray-50 w-20 h-20 flex items-center justify-center rounded-full shadow-inner">
              {tempAvatar.emoji}
            </div>
            <p>
              <span className="font-black text-green-600">{tempNickname}</span>
              {isKo ? ' 으로 변경하시겠습니까?' : ' - Change to this profile?'}
            </p>
          </div>
        }
        onConfirm={confirmSave}
        onClose={() => setShowSaveModal(false)}
      />

      <AlertModal
        show={showSuccessModal}
        title={isKo ? '변경 완료' : 'Success'}
        text={
          <div className="flex flex-col items-center gap-2">
            <p>{isKo ? '프로필이 성공적으로 변경되었습니다.' : 'Profile successfully updated.'}</p>
          </div>
        }
        onConfirm={() => setShowSuccessModal(false)}
      />

      <ConfirmModal
        show={showDeleteModal}
        title={t('deleteConfirmTitle')}
        confirmText={t('deleteConfirm')}
        cancelText={t('deleteCancel')}
        text={
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p>{t('deleteConfirmDesc')}</p>
          </div>
        }
        onConfirm={handleDeleteAccount}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
