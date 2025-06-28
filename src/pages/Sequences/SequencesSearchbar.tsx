import React from "react";
import Searchbar from "../../components/ui/Searchbar";

type Props = {
  sequenceQuery: string;
  setSequenceQuery: React.Dispatch<React.SetStateAction<string>>;
};

const SequencesSearchbar = ({ sequenceQuery, setSequenceQuery }: Props) => {
  return (
    <div>
      <Searchbar
        placeholder="Search by name..."
        query={sequenceQuery}
        setQuery={setSequenceQuery}
      />
    </div>
  );
};

export default SequencesSearchbar;
