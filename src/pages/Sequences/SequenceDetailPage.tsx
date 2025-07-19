import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSequence } from "../../hooks/useSequence";
import ReusableDetailsList from "../../components/layouts/ReusableDetailsList";

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
        <div className="flex flex-col p-4 mx-4">
            <div>
                <ReusableDetailsList
                    fields={[
                        "name",
                        "description",
                        "notes",
                        "exercises",
                        "created_at",
                        "updated_at",
                    ]}
                    item={sequence}
                />
            </div>
            <button
                type="button"
                onClick={onBackButtonClick}
                className="bg-gray-300 text-black px-4 py-2 rounded font-extrabold mt-4 self-start"
            >
                Back
            </button>
        </div>
    );
};
