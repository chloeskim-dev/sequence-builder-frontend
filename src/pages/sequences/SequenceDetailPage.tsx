import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSequence } from "../../hooks/useSequence";
import ItemFieldsList from "../../components/layouts/ItemFieldsList";
import {
    commonLabelStyles,
    commonTextStyles,
} from "../../constants/tailwindClasses";
import PageBottomButton from "../../components/layouts/PageBottomButton";

export const SequenceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, fetchSequence, error, setError } = useSequence(id);

    useEffect(() => {
        if (id) fetchSequence();
    }, [id]);

    const navigate = useNavigate();
    const onBackButtonClick = () => {
        navigate("/sequences");
    };

    if (!sequence) return <p>Loading...</p>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
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
                    labelStyles={`${commonLabelStyles} capitalize text-my-fg`}
                />
            </div>
            <div className="h-[100px] flex flex-col items-center justify-center">
                <PageBottomButton
                    onClick={onBackButtonClick}
                    text="Back"
                    appearance="secondary"
                />
            </div>
        </div>
    );
};
