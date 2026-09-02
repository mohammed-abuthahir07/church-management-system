import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import './ConfirmModal.css';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
  itemName = '',
  loading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      icon={danger ? AlertTriangle : null}
    >
      <div className="confirm-modal">
        <p className="confirm-modal__text">{message}</p>

        {itemName && (
          <div className="confirm-modal__target">
            Target: <span>{itemName}</span>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={loading} className="btn-outline">
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={danger ? 'confirm-btn-danger' : 'btn-gold'}
          >
            {loading ? (
              <>
                <Loader2 className="icon-sm icon-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Trash2 className="icon-sm" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
