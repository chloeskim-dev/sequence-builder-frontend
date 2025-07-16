import Modal from "../layouts/Modal";
import { SetStateAction } from "react";
import { CleanedUpFavoriteExercise } from "../../utils/sequenceHelpers";

type FavoriteExercisesDeleteConfirmModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    deleteItem: CleanedUpFavoriteExercise;
    setDeleteItem: React.Dispatch<
        React.SetStateAction<CleanedUpFavoriteExercise | null>
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
