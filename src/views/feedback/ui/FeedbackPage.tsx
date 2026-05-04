'use client';

import { Step1 } from '@/views/feedback/ui/Step1';
import { Step2 } from '@/views/feedback/ui/Step2';
import { ConfirmModal, Loading, Stepper } from '@/shared/ui';
import { useFeedbackForm } from '@/features/feedback';

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
    setEmail,
    setContents,
    setOther,
    setConfirmModal,
    onNext,
    onSubmit,
    onSelectCategory,
    onConfirm,
    onSuccessConfirm,
  } = useFeedbackForm();

  return (
    <div className="pt-[4rem]">
      <div className="pb-[3.5rem] text-center">
        <h2 className="text-[1.3rem] font-bold">Corea Hoy에 대한 의견을 남겨주시겠어요?</h2>
        <p className="mt-[0.4rem] text-base">여러분의 의견은 Corea Hoy에 큰 도움이 됩니다.</p>
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
            onChange={(i, value) => onSelectCategory(i, value)}
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
            onEmailChange={setEmail}
            onContentsChange={setContents}
            onClick={onSubmit}
          />
        )}

        {/* 로딩 */}
        {isPending && <Loading />}

        {/* 확인 모달 */}
        <ConfirmModal
          show={confirmModal}
          text={'작성한 내용을 제출하시겠습니까?\n제출 후 수정이 제한됩니다.'}
          onConfirm={onConfirm}
          onClose={() => setConfirmModal(false)}
        />

        {/* 제출 완료 모달 */}
        <ConfirmModal
          show={successModal}
          text={'제출이 완료되었습니다.'}
          onConfirm={onSuccessConfirm}
          onClose={onSuccessConfirm}
        />
      </div>
    </div>
  );
}
