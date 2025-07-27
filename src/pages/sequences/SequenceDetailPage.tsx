import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSequence } from "../../hooks/useSequence";
import ItemFieldsList from "../../components/layouts/ItemFieldsList";
import {
    commonLabelStyles,
    commonTextStyles,
} from "../../constants/tailwindClasses";

export const SequenceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, initializeSequence } = useSequence(id);

    useEffect(() => {
        if (id) {
            initializeSequence();
        }
    }, [id, initializeSequence]);

    const navigate = useNavigate();
    const onBackButtonClick = () => {
        navigate("/sequences");
    };

    if (!sequence) return <p>Loading...</p>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-4">
                <ItemFieldsList
                    fields={[
                        "name",
                        "description",
                        "notes",
                        "exercises",
                        "created_at",
                        "updated_at",
                    ]}
                    item={sequence}
                    textStyles={`${commonTextStyles} text-my-yellow`}
                    labelStyles={`${commonLabelStyles} text-my-fg`}
                />
            </div>
            <div className="mt-6 mb-10 flex flex-row gap-x-2 justify-center">
                <button
                    type="button"
                    onClick={onBackButtonClick}
                    className="bg-mt-yellow hover:bg-gb-yellow font-extrabold px-4 py-2 rounded"
                >
                    <text className="uppercase text-xl">Back </text>
                </button>
            </div>
        </div>
    );
};
