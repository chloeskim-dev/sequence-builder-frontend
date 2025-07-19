import Modal from "../layouts/Modal";
import { Sequence } from "../../constants/types";
import { SetStateAction } from "react";

type SequenceDeleteConfirmModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    deleteItem: Sequence;
    setDeleteItem: React.Dispatch<React.SetStateAction<Sequence | null>>;
    deleteSequence: (exerciseId: string) => Promise<void>;
};

const SequenceDeleteConfirmModal = ({
    isModalOpen,
    setIsModalOpen,
    deleteItem,
    setDeleteItem,
    deleteSequence,
}: SequenceDeleteConfirmModalProps) => {
    const closeDeleteConfirmModal = () => {
        setIsModalOpen(false);
        setDeleteItem(null);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeDeleteConfirmModal}
            title={`Delete sequence?`}
            buttons={[
                {
                    label: "Delete",
                    onClick: () => deleteSequence(deleteItem.id),
                    variant: "danger",
                },
                {
                    label: "Cancel",
                    onClick: closeDeleteConfirmModal,
                    variant: "secondary",
                },
            ]}
        >
            <div className="text-sm flex flex-col gap-y-2 break-all">
                <p>
                    Are you sure you want to delete '
                    <span className="font-extrabold">{deleteItem.name}</span>'?
                </p>
                <p>This action cannot be undone.</p>
            </div>
        </Modal>
    );
};

export default SequenceDeleteConfirmModal;
