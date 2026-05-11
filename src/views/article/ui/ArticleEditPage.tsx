'use client';

import { RichTextEditor } from '@/shared/ui/rich-text-editor/RichTextEditor';
import { useArticleManage } from '@/features/article/model/useArticleManage';
import { useNavigationGuard } from '@/features/article/model/useNavigationGuard';
import { useTranslations } from 'next-intl';
import { ConfirmModal, Loading } from '@/shared/ui';

export function ArticleEditPage() {
  const { showNavGuardModal, onNavGuardConfirm, onNavGuardCancel, allowNextNavigation } =
    useNavigationGuard();

  const {
    titleValue,
    editValue,
    isLoading,
    onTitleEdit,
    onContentEditChange,
    onEdit,
    onDeletePost,
    setShowDeletePostModal,
    showDeletePostModal,
    onDeletePostModal,
  } = useArticleManage(allowNextNavigation);

  const t = useTranslations();

  const buttonStyle =
    'h-[2rem] min-w-[3rem] px-[0.4rem] w-auto text-base border leading-none rounded-xl';

  return (
    <div>
      {/* 타이틀, 날짜 */}
      <div className="pt-6 px-2 pb-2 border-b border-b border-gray-100">
        <label htmlFor="titleInput" className="sr-only">
          title input
        </label>
        <input
          id="titleInput"
          type="text"
          value={titleValue}
          placeholder={t('common.titlePlaceholder')}
          className="w-full h-[2.5rem] outline-none text-[1.5rem] font-bold"
          onChange={(e) => onTitleEdit(e.target.value)}
        />
      </div>

      {/* 컨텐츠 */}
      <div className="py-4">
        <RichTextEditor value={editValue} onChange={(value) => onContentEditChange(value)} />
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pt-4 pr-2 border-t border-t-gray-100">
        <span>2024-02-01</span>
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            className={`${buttonStyle} text-red-600 bg-red-100`}
            onClick={onDeletePost}
          >
            {t('common.delete')}
          </button>
          <button
            type="button"
            className={`${buttonStyle} text-green-700 bg-green-100`}
            onClick={onEdit}
          >
            {t('common.edit')}
          </button>
        </div>
      </div>

      {/* 로딩 */}
      {isLoading && <Loading />}

      {/* 게시글 삭제 확인 모달 */}
      <ConfirmModal
        show={showDeletePostModal}
        text={t('admin.deleteModal')}
        onConfirm={onDeletePostModal}
        onClose={() => setShowDeletePostModal(false)}
      />

      {/* 페이지 이탈 확인 모달 */}
      <ConfirmModal
        show={showNavGuardModal}
        text={t('admin.editExitModal')}
        onConfirm={onNavGuardConfirm}
        onClose={onNavGuardCancel}
      />
    </div>
  );
}
