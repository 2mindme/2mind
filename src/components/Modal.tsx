import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>
      <div 
        className="bg-card relative rounded-xl shadow-lg border border-gray-800 p-6 w-full max-w-md mx-4 z-[9999] overflow-auto max-h-[90vh]"
        style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {title && (
          <div className="mb-4 pb-3 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        )}
        <div className="text-gray-300">
          {children}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-info text-white px-4 py-2 rounded-lg hover:bg-info/90 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal; 