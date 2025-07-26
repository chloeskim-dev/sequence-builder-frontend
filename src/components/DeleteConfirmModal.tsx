import Modal from "./layouts/Modal";
import { SetStateAction } from "react";
import {
    deleteConfirmModalTextStyles,
    deleteItemNameHighlightTextStyles,
} from "./../constants/tailwindClasses";

type DeleteConfirmModalProps<T extends { id: string; name: string }> = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    deleteItem: T;
    setDeleteItem: React.Dispatch<React.SetStateAction<T | null>>;
    onDelete: (id: string) => Promise<void>;
    title: string;
};

const DeleteConfirmModal = <T extends { id: string; name: string }>({
    isModalOpen,
    setIsModalOpen,
    deleteItem,
    setDeleteItem,
    onDelete,
    title,
}: DeleteConfirmModalProps<T>) => {
    const onClose = () => {
        setIsModalOpen(false);
        setDeleteItem(null);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onClose}
            title={title}
            buttons={[
                {
                    label: "Delete",
                    onClick: () => onDelete(deleteItem.id),
                    variant: "danger",
                },
                {
                    label: "Cancel",
                    onClick: onClose,
                    variant: "secondary",
                },
            ]}
        >
            <div className={deleteConfirmModalTextStyles}>
                <p>
                    Are you sure you want to delete '
                    <span className={deleteItemNameHighlightTextStyles}>
                        {deleteItem.name}
                    </span>
                    '?
                </p>
                <p>This action cannot be undone.</p>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
