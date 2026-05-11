'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { FeedbackType } from '@/entities/feedback/model/types';
import { validateEmail } from '@/shared/utils/email';
import { validateContent } from '@/features/feedback/model/validate';
import { feedbackContent } from '@/features/feedback/api/feedback.api';
import { useTranslations } from 'next-intl';

export const useFeedbackForm = () => {
  const router = useRouter();
  const t = useTranslations();

  const [currentStep, setCurrentStep] = useState(0);
  const [categoryButtonType, setCategoryButtonType] = useState<FeedbackType | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [email, setEmail] = useState('');
  const [contents, setContents] = useState('');
  const [other, setOther] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [contentMessage, setContentMessage] = useState('');

  /**
   * 피드백 API 호출
   **/
  const { mutate: submitFeedback, isPending } = useMutation({
    mutationFn: feedbackContent,
    onSuccess: (res) => {
      if (res.data?.success) {
        setSuccessModal(true);
      } else {
        setContentMessage(res.data?.message ?? '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    onError: (error) => {
      setContentMessage('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
    onSettled: () => {
      setConfirmModal(false);
    },
  });

  /**
   * 다음 단계로 이동
   * 버튼이 선택되지 않았으면 이동하지 않음
   * @param activeButton
   **/
  const onNext = (activeButton: number | null) => {
    if (activeButton == null) return;
    setCurrentStep(currentStep + 1);
  };

  /**
   * 제출 전 유효성 검사 실행
   * - 이메일 / 내용 검증
   * - 에러 없을 때만 확인 모달 오픈
   */
  const onSubmit = () => {
    const emailError = validateEmail(email, t);
    const contentError = validateContent(contents, t);

    setEmailMessage(emailError);
    setContentMessage(contentError);

    if (!emailError && !contentError) {
      setConfirmModal(true);
    }
  };

  /**
   * 피드백 카테고리 선택
   * - 버튼 클릭 시 카테고리 상태 업데이트
   */
  const onSelectCategory = (index: number, value: FeedbackType) => {
    setCategoryButtonType(value);
  };

  /**
   * 최종 제출 실행
   * - 선택된 카테고리 + 입력값을 API로 전송
   */
  const onConfirm = () => {
    submitFeedback({
      category: categoryButtonType ?? '',
      otherCategory: categoryButtonType === 'other' ? other : '',
      body: contents,
      email: email,
    });
  };

  /**
   * 제출 확인
   * - 확인 혹은 취소 클릭 시 메인 화면으로 이동
   */
  const onSuccessConfirm = () => {
    setSuccessModal(false);
    router.push('/');
  };

  return {
    currentStep,
    categoryButtonType,
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
    setSuccessModal,
    onNext,
    onSubmit,
    onSelectCategory,
    onConfirm,
    onSuccessConfirm,
  };
};
