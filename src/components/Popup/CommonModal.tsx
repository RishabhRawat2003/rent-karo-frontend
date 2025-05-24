// components/CommonModal.tsx
import { useEffect } from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Info,
} from 'lucide-react';

type ModalType = 'success' | 'error' | 'warning' | 'info';

interface CommonModalProps {
    isOpen: boolean;
    closeModal: () => void;
    title: string;
    description: string;
    onAccept: () => void;
    onCancel?: () => void;
    type?: ModalType;
    acceptButtonText?: string;
    cancelButtonText?: string;
}

export default function CommonModal({
    isOpen,
    closeModal,
    title,
    description,
    onAccept,
    onCancel,
    type = 'info',
    acceptButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
}: CommonModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    const iconStyles = {
        success: 'bg-green-100 text-green-600',
        error: 'bg-red-100 text-red-600',
        warning: 'bg-yellow-100 text-yellow-600',
        info: 'bg-blue-100 text-blue-600',
    };

    const buttonStyles = {
        success: 'bg-green-600 hover:bg-green-700',
        error: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700',
    };

    const Icon = {
        success: CheckCircle2,
        error: XCircle,
        warning: AlertTriangle,
        info: Info,
    }[type];

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 flex gap-4">
                    <div
                        className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${iconStyles[type]}`}
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="mt-2 text-sm text-gray-500">{description}</p>
                    </div>
                </div>
                <div className="flex gap-2 p-6 border-t border-gray-100 justify-end">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
                        >
                            {cancelButtonText}
                        </button>
                    )}
                    <button
                        onClick={onAccept}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${buttonStyles[type]}`}
                    >
                        {acceptButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}