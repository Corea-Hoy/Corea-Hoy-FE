'use client';

import { Step1 } from '@/views/feedback/ui/Step1';
import { Step2 } from '@/views/feedback/ui/Step2';
import { ConfirmModal, Loading, Stepper } from '@/shared/ui';
import { useFeedbackForm } from '@/features/feedback';
import { useTranslations } from 'next-intl';

export function FeedbackPage() {
  const {
    currentStep,
    confirmModal,
    successModal,
    email,
    contents,
    other,
    isPending,
    emailMessage,
    contentMessage,
    setOther,
    setConfirmModal,
    onNext,
    onSubmit,
    onSelectCategory,
    onEmailChange,
    onContentsChange,
    onConfirm,
    onSuccessConfirm,
  } = useFeedbackForm();
  const t = useTranslations('feedback');

  return (
    <div className="pt-[4rem]">
      <div className="pb-[3.5rem] text-center">
        <h2 className="text-[1.3rem] font-bold">{t('title')}</h2>
        <p className="mt-[0.4rem] text-base">{t('subtitle')}</p>
      </div>

      {/* 컨텐츠 */}
      <div className="relative mt-[1rem] py-[2.5rem] px-[2.5rem] rounded-2xl bg-gray-50">
        <div className="absolute top-[-4rem] right-0 w-[5rem]">
          <img src="/images/characters/mascot-cheer.png" alt="" />
        </div>

        <Stepper total={2} currentStep={currentStep} />

        {/* 1단계 */}
        {currentStep === 0 && (
          <Step1
            onChange={onSelectCategory}
            onClick={onNext}
            other={other}
            onOtherChange={setOther}
          />
        )}

        {/* 2단계 */}
        {currentStep === 1 && (
          <Step2
            email={email}
            contents={contents}
            emailError={emailMessage}
            contentError={contentMessage}
            onEmailChange={onEmailChange}
            onContentsChange={onContentsChange}
            onClick={onSubmit}
          />
        )}

        {/* 로딩 */}
        {isPending && <Loading />}

        {/* 확인 모달 */}
        <ConfirmModal
          show={confirmModal}
          text={t('submitMessage')}
          onConfirm={onConfirm}
          onClose={() => setConfirmModal(false)}
        />

        {/* 제출 완료 모달 */}
        <ConfirmModal
          show={successModal}
          text={t('submitSuccess')}
          onConfirm={onSuccessConfirm}
          onClose={onSuccessConfirm}
        />
      </div>
    </div>
  );
}
