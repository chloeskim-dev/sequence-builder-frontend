import { SetStateAction } from "react";
import Modal from "../layouts/Modal";
import { FavoriteExercise } from "../../constants/types";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
import { useUser } from "../../contexts/UserContext";
import { FiHeart } from "react-icons/fi";
import {
    durationInputStyles,
    durationLabelStyles,
} from "../../constants/tailwindClasses";
import PaddedDurationDisplayWithLabels from "../ui/PaddedDurationDisplayWithLabels";

type FavoriteExerciseDetailModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    detailItem: FavoriteExercise;
    setDetailItem: React.Dispatch<
        React.SetStateAction<FavoriteExercise | null>
    >;
};

const labelStyles = "block font-medium text-sm mb-1";
const textStyles = "text-sm";

export default function FavoriteExerciseDetailModal({
    isModalOpen,
    setIsModalOpen,
    detailItem,
    setDetailItem,
}: FavoriteExerciseDetailModalProps) {
    const { user, isAuthenticated } = useUser();
    const userId = user?.id ?? null;

    const { splitMinutes, splitSeconds } = splitDuration(
        detailItem.duration_secs
    );

    const closeDetailModal = () => {
        setIsModalOpen(false);
        setDetailItem(null);
    };

    const durationString = `${String(splitMinutes)}:${String(
        splitSeconds
    ).padStart(2, "0")}`;

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeDetailModal}
            title={"Favorite Exercise Details"}
            buttons={[
                {
                    label: "Close",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
            ]}
        >
            <div className="flex flex-col gap-y-4">
                <div>
                    <label htmlFor="name" className={labelStyles}>
                        <div className="flex items-center gap-x-1">
                            <div>
                                <FiHeart size={12} fill="red" color="white" />
                            </div>
                            <div> Name</div>
                        </div>
                    </label>
                    <div id="name" className={textStyles}>
                        <div className="flex items-center gap-x-1">
                            <div>{detailItem.name}</div>
                        </div>
                    </div>
                </div>
                {detailItem.direction && detailItem.direction !== "" && (
                    <div>
                        <label htmlFor="direction" className={labelStyles}>
                            Direction
                        </label>
                        <div id="direction" className={textStyles}>
                            {detailItem.direction}
                        </div>
                    </div>
                )}

                {detailItem.duration_secs !== undefined ? (
                    <PaddedDurationDisplayWithLabels
                        minutes={splitMinutes}
                        seconds={splitSeconds}
                    />
                ) : (
                    ""
                )}
                {detailItem.resistance && detailItem.resistance !== "" && (
                    <div>
                        <label htmlFor="resistance" className={labelStyles}>
                            Resistance
                        </label>
                        <div id="resistance" className={textStyles}>
                            {detailItem.resistance}
                        </div>
                    </div>
                )}
                {detailItem.notes && detailItem.notes !== "" && (
                    <div>
                        <label htmlFor="notes" className={labelStyles}>
                            Notes
                        </label>
                        <div id="notes" className={textStyles}></div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
