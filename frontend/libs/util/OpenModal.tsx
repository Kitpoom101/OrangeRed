"use client";

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";

type ModalShellProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
};

function getScrollbarOffset() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function isEventLike(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    ("nativeEvent" in value ||
      "preventDefault" in value ||
      "stopPropagation" in value)
  );
}

export default function useModal(initialState = false) {
  const [isModalOpen, setIsModalOpen] = useState(initialState);
  const [isModalLocked, setIsModalLocked] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarOffset = getScrollbarOffset();

    document.body.style.overflow = "hidden";
    if (scrollbarOffset > 0) {
      document.body.style.paddingRight = `${scrollbarOffset}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isModalOpen]);

  const openModal = (content?: ReactNode) => {
    if (!isEventLike(content)) {
      setModalContent(content ?? null);
    }
    setIsModalOpen(true);
    setIsModalLocked(false);
  };

  const closeModal = (force?: boolean) => {
    if (isModalLocked && !force) return;
    setIsModalOpen(false);
    setModalContent(null);
  };

  const toggleModal = () => {
    if (isModalOpen) {
      closeModal();
      return;
    }

    openModal();
  };

  const lockModal = () => {
    setIsModalLocked(true);
  };

  const unlockModal = () => {
    setIsModalLocked(false);
  };

  const Modal = ({
    children,
    className = "",
    contentClassName = "",
  }: ModalShellProps) => {
    if (!isModalOpen) return null;

    const mobilePosition = isMobileViewport() ? "items-end" : "items-center";

    return (
      <div
        className={`fixed inset-0 z-[1000] flex justify-center bg-black/50 ${mobilePosition} ${className}`.trim()}
        style={{ paddingRight: getScrollbarOffset() }}
        onClick={() => closeModal()}
        aria-hidden="true"
      >
        <div
          className={`pointer-events-auto p-2 md:p-4 ${contentClassName}`.trim()}
          onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        >
          {children ?? modalContent}
        </div>
      </div>
    );
  };

  return {
    isOpen: isModalOpen,
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    toggleModal,
    isModalLocked,
    lockModal,
    unlockModal,
    setIsOpen: setIsModalOpen,
    setModalContent,
    Modal,
  };
}

export type UseModalReturn = ReturnType<typeof useModal>;
