import Modal from "../layouts/Modal";
import { FavoriteExercise } from "../../constants/types";
import { SetStateAction } from "react";

type FavoriteExercisesDeleteConfirmModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    deleteItem: FavoriteExercise;
    setDeleteItem: React.Dispatch<
        React.SetStateAction<FavoriteExercise | null>
    >;
    deleteExercise: (exerciseId: string) => Promise<void>;
};

const FavoriteExercisesDeleteConfirmModal = ({
    isModalOpen,
    setIsModalOpen,
    deleteItem,
    setDeleteItem,
    deleteExercise,
}: FavoriteExercisesDeleteConfirmModalProps) => {
    const closeDeleteConfirmModal = () => {
        setIsModalOpen(false);
        setDeleteItem(null);
    };
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeDeleteConfirmModal}
            title={`Delete favorite exercise?`}
            buttons={[
                {
                    label: "Delete",
                    onClick: () => deleteExercise(deleteItem.id),
                    variant: "danger",
                },
                {
                    label: "Cancel",
                    onClick: closeDeleteConfirmModal,
                    variant: "secondary",
                },
            ]}
        >
            <div className="text-sm flex flex-col gap-y-2">
                <p>Are you sure you want to delete '{deleteItem.name}'?</p>
                <p>This action cannot be undone.</p>
            </div>
        </Modal>
    );
};

export default FavoriteExercisesDeleteConfirmModal;
