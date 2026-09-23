"use client";

import { useId, useState, type FormEvent } from "react";

import type { ValidationResult } from "@/lib/types";
import { Modal } from "./Modal";
import styles from "./NameDialog.module.scss";

interface NameDialogProps {
  title: string;
  submitLabel: string;
  initialValue: string;
  validate: (name: string) => ValidationResult;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export function NameDialog({
  title,
  submitLabel,
  initialValue,
  validate,
  onSubmit,
  onClose,
}: NameDialogProps) {
  const inputId = useId();
  const errorId = useId();

  const [value, setValue] = useState(initialValue);
  // Wait for submit or blur, so an empty box is not instantly red.
  const [touched, setTouched] = useState(false);

  const result = validate(value);
  const showError = touched && !result.ok;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!result.ok) return;
    onSubmit(value.trim());
  }

  return (
    <Modal open title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <label className={styles.label} htmlFor={inputId}>
          Name
        </label>

        <input
          id={inputId}
          className={showError ? `${styles.input} ${styles.inputError}` : styles.input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />

        {showError && (
          <p id={errorId} className={styles.error} role="alert">
            {result.message}
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submit} disabled={touched && !result.ok}>
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
