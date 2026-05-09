import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { updateProfileApi, deleteAccountApi } from '@/entities/user/api/user.api';
import { useUsersStore, AVATAR_PRESETS } from '@/entities/user';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: onUpdateProfile, isPending } = useMutation({
    mutationFn: (data: { nickname: string; avatarId: string }) => {
      const preset = AVATAR_PRESETS.find((p) => p.id === data.avatarId) || AVATAR_PRESETS[0];

      const body = {
        nickname: data.nickname,
        avatarEmoji: preset.emoji,
        avatarColor: preset.color,
      };
      console.log('[updateProfile] API 호출 → PUT /api/users/me', body);
      return updateProfileApi(body);
    },
    onSuccess: () => {
      // invalidateQueries 이후 useAuthInit이 서버 데이터로 스토어를 자동 갱신합니다.
      queryClient.invalidateQueries({ queryKey: ['me'] });
      alert('프로필이 성공적으로 변경되었습니다.');
    },
    onError: (error) => {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    },
  });

  return { onUpdateProfile, isPending };
};

export const useDeleteAccount = () => {
  const router = useRouter();
  const logoutStore = useUsersStore((state) => state.logout);
  const queryClient = useQueryClient();

  const { mutate: onDeleteAccount, isPending } = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] });
      logoutStore();
      alert('계정이 삭제되었습니다. 이용해 주셔서 감사합니다.');
      router.push('/');
    },
    onError: (error) => {
      console.error('계정 삭제 실패:', error);
      alert('계정 삭제 중 오류가 발생했습니다.');
    },
  });

  return { onDeleteAccount, isPending };
};
