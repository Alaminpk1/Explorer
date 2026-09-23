"use client";

import { useEffect, useRef, type ReactNode } from "react";

import styles from "./Modal.module.scss";

// Native <dialog> gives focus trapping, Escape to close and ::backdrop for free.
interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Escape fires the dialog's cancel event; forward it so React keeps up.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-label={title}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
