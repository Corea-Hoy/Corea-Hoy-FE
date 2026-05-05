'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUserStore, AVATAR_PRESETS } from '@/entities/user';
import { MOCK_CONTENTS, MOCK_USER } from '@/entities/content/model/mock-data';

import { ProfileCard } from './ProfileCard';
import { LikedContentList } from './LikedContentList';
import { MyCommentsList } from './MyCommentsList';

export function MyPage() {
  const router = useRouter();
  const t = useTranslations('mypage');
  const locale = useLocale();
  const { user, updateProfile, logout, deleteAccount } = useUserStore();
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
    avatarEmoji: '',
    avatarColor: '#ffd0a8',
    likedContentIds: ['c1', 'c3'],
  };

  if (!mounted) return null;

  // TODO: 로그인 기능 추가 후 주석 해제
  //   if (!mounted || !user) return null;
  // const currentUser = user;

  const likedContents = MOCK_CONTENTS.filter((c) => currentUser.likedContentIds.includes(c.id));
  const myComments = MOCK_CONTENTS.flatMap((c) =>
    c.comments
      .filter((cm) => cm.userId === MOCK_USER.id)
      .map((cm) => ({ ...cm, contentTitle: isKo ? c.title : c.titleEs, contentId: c.id })),
  );

  function startEdit() {
    setTempNickname(currentUser.name);
    setTempAvatar(
      AVATAR_PRESETS.find((p) => p.emoji === currentUser.avatarEmoji) ?? AVATAR_PRESETS[0],
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
    updateProfile(trimmed, tempAvatar.emoji, tempAvatar.color);
    setEditing(false);
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  function handleDeleteAccount() {
    deleteAccount();
    router.push('/');
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
          stats={{ likes: likedContents.length, comments: myComments.length }}
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
          <LikedContentList contents={likedContents} isKo={isKo} />
          <MyCommentsList comments={myComments} />
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
