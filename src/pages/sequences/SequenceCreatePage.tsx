import { useState } from "react";
import SequenceForm from "../../components/forms/SequenceForm";
import { SubmitHandler } from "react-hook-form";
import { SequenceFormInputs } from "../../constants/types";
import { makeSequencePayloadFromFormData } from "../../utils/formHelpers";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import PageBottomButton from "../../components/layouts/PageBottomButton";

const SequenceCreatePage = () => {
    const [error, setError] = useState("");
    const { user } = useUser();
    const userId = user?.id ?? null;
    const navigate = useNavigate();

    const onCreateFormSubmit: SubmitHandler<SequenceFormInputs> = async (
        formData
    ) => {
        try {
            const payload = makeSequencePayloadFromFormData(
                formData,
                userId as string
            );
            const res = await api.post(`/v1/sequences/user/${userId}`, payload);
        } catch (err: any) {
            setError("Something went wrong.");
        }
        navigate("/sequences");
    };
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <SequenceForm
                    onSubmit={onCreateFormSubmit}
                    formId="create-sequence-form"
                    title="Create Sequence"
                />
            </div>
            <div className="h-[100px] flex flex-col items-center justify-center">
                {/* SEQUENCE FORM ACTIONS */}
                <div className="flex flex-row gap-x-2 justify-center">
                    <PageBottomButton
                        type="submit"
                        form="create-sequence-form"
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

export default SequenceCreatePage;
