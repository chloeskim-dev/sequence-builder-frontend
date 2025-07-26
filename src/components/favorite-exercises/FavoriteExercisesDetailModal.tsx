import { SetStateAction } from "react";
import Modal from "../layouts/Modal";
import ItemFieldsList from "../layouts/ItemFieldsList";
import {
    detailsListInsideModalLabelStyles,
    detailsListInsideModalTextStyles,
} from "../../constants/tailwindClasses";
import { CleanedUpFavoriteExercise } from "../../constants/types";

type FavoriteExerciseDetailModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    detailItem: CleanedUpFavoriteExercise;
    setDetailItem: React.Dispatch<
        React.SetStateAction<CleanedUpFavoriteExercise | null>
    >;
};

export default function FavoriteExerciseDetailModal({
    isModalOpen,
    setIsModalOpen,
    detailItem,
    setDetailItem,
}: FavoriteExerciseDetailModalProps) {
    const onModalClose = () => {
        setIsModalOpen(false);
        setDetailItem(null);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onModalClose}
            title={"Favorite Exercise Details"}
            buttons={[
                {
                    label: "Close",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
            ]}
        >
            <ItemFieldsList
                fields={[
                    "name",
                    "direction",
                    "duration",
                    "resistance",
                    "notes",
                ]}
                item={detailItem}
                textStyles={detailsListInsideModalTextStyles}
                labelStyles={detailsListInsideModalLabelStyles}
            />
        </Modal>
    );
}
