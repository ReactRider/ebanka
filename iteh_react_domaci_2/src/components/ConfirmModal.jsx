import React from 'react';
import '../css/ConfirmModal.css';

const ConfirmModal = ({ title = 'Potvrda akcije', message, onConfirm, onCancel, confirmText = 'Potvrdi', cancelText = 'Odustani' }) => (
    <div className="cm-overlay">
        <div className="cm-modal">
            <h3 className="cm-title">{title}</h3>
            <p className="cm-text">{message}</p>
            <div className="cm-actions">
                <button className="cm-btn-cancel" onClick={onCancel}>{cancelText}</button>
                <button className="cm-btn-confirm" onClick={onConfirm}>{confirmText}</button>
            </div>
        </div>
    </div>
);

export default ConfirmModal;
