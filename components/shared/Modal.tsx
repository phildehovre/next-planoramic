import React from "react";
import styles from "./Modal.module.scss";

type ModalProps = {
  children: React.ReactNode;
  onSave?: () => void;
  submit?: React.ReactElement;
  onCancel: () => void;
  display: boolean;
  isLoading?: boolean;
};

const Modal = ({
  children,
  onSave,
  onCancel,
  display,
  submit,
  isLoading,
}: ModalProps) => {
  if (!display) {
    return null;
  }

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_content}>{children}</div>
        <div className={styles.modal_buttons}>
          {onSave && (
            <button
              className={`${styles.button} ${styles.save_btn}`}
              onClick={onSave}
              disabled={isLoading}
            >
              Save
            </button>
          )}
          {submit && submit}
          <button
            className={`${styles.button} ${styles.cancel_btn}`}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
