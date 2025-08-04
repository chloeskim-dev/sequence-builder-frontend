import { useEffect } from "react";
import SequenceForm from "../../components/forms/SequenceForm";
import { SubmitHandler } from "react-hook-form";
import { SequenceFormInputs } from "../../constants/types";
import { makeSequencePayloadFromFormData } from "../../utils/formHelpers";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../utils/api";

import { useNavigate, useParams } from "react-router-dom";
import { useSequence } from "../../hooks/useSequence";
import PageBottomButton from "../../components/layouts/PageBottomButton";

const SequenceEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, fetchSequence, error, setError } = useSequence(id);
    const { user } = useUser();
    const userId = user?.id ?? null;

    const navigate = useNavigate();

    useEffect(() => {
        if (id) fetchSequence();
    }, [id]);

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

    if (!sequence) return <p>Loading...</p>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <SequenceForm
                    onSubmit={onEditFormSubmit}
                    formId="edit-sequence-form"
                    title="Edit Sequence"
                    editSequence={sequence}
                />
            </div>
            <div className="h-[100px] flex flex-col items-center justify-center">
                {/* SEQUENCE FORM ACTIONS */}
                <div className="flex flex-row gap-x-2 justify-center">
                    <PageBottomButton
                        type="submit"
                        form="edit-sequence-form"
                        appearance="primary"
                        text="Submit"
                        // disabled={sequenceFormMethods.formState.isSubmitting}
                    />

                    <PageBottomButton
                        onClick={() => navigate("/sequences")}
                        appearance="secondary"
                        text="Cancel"
                    />
                </div>
            </div>
        </div>
    );
};

export default SequenceEditPage;
