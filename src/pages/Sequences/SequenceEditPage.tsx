import { useEffect, useState } from "react";
import SequenceForm from "../../components/forms/SequenceForm";
import { SubmitHandler } from "react-hook-form";
import { SequenceFormInputs } from "../../constants/types";
import { makeSequencePayloadFromFormData } from "../../utils/formHelpers";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../utils/api";

import { useNavigate, useParams } from "react-router-dom";
import { useSequence } from "../../hooks/useSequence";

const SequenceEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, initializeSequence } = useSequence(id);
    const [error, setError] = useState("");
    const { user } = useUser();
    const userId = user?.id ?? null;

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            initializeSequence();
        }
    }, [id, initializeSequence]);

    if (!sequence) return <p>Loading...</p>;

    const onEditFormSubmit: SubmitHandler<SequenceFormInputs> = async (
        formData
    ) => {
        try {
            const payload = makeSequencePayloadFromFormData(
                formData,
                userId as string
            );
            const res = await api.put(`/v1/sequences/${sequence!.id}`, payload);
            navigate("/sequences");
        } catch (err: any) {
            setError(
                "Something went wrong while fetching your sequence.  Please try again later."
            );
        }
        navigate("/sequences");
    };

    return (
        <div className="h-full">
            <SequenceForm
                onSubmit={onEditFormSubmit}
                formId="edit-sequence-form"
                title="Edit Sequence"
                editSequence={sequence}
            />
        </div>
    );
};

export default SequenceEditPage;
