import Modal from "../../components/layouts/Modal";
import { Sequence } from "../../constants/types";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
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
            title={`Delete '${deleteItem.name}'?`}
            buttons={[
                {
                    label: "Cancel",
                    onClick: closeDeleteConfirmModal,
                    variant: "secondary",
                },
                {
                    label: "Delete",
                    onClick: () => deleteSequence(deleteItem.id),
                    variant: "danger",
                },
            ]}
        >
            <div className="text-sm flex flex-col gap-y-2">
                <p>Are you sure you want to delete this favorite exercise?</p>
                <p>This action cannot be undone.</p>
            </div>
        </Modal>
    );
};

export default SequenceDeleteConfirmModal;
