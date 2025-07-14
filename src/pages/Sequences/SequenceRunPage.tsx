import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSequence } from "../../hooks/useSequence";
import GuidedSequencePlayer from "../../components/sequences/SequencePlayer";

export const SequenceRunPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, initializeSequence } = useSequence(id);

    useEffect(() => {
        if (id) {
            initializeSequence();
        }
    }, [id, initializeSequence]);
    if (!sequence) return <p>Loading...</p>;
    return <GuidedSequencePlayer sequence={sequence} />;
};
