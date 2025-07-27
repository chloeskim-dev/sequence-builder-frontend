import { useState } from "react";
import SequenceForm from "../../components/forms/SequenceForm";
import { SubmitHandler } from "react-hook-form";
import { SequenceFormInputs } from "../../constants/types";
import { makeSequencePayloadFromFormData } from "../../utils/formHelpers";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

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
        <div className="h-full">
            <SequenceForm
                onSubmit={onCreateFormSubmit}
                formId="create-sequence-form"
                title="Create Sequence"
            />
        </div>
    );
};

export default SequenceCreatePage;
