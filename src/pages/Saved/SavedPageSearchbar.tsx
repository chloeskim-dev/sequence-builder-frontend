import React from "react";
import Searchbar from "../../components/ui/Searchbar";

type Props = {
  sequenceQuery: string;
  setSequenceQuery: React.Dispatch<React.SetStateAction<string>>;
};


const SavedPageSearchbar = ({ sequenceQuery, setSequenceQuery }: Props) => {
  return (
    <div>
      <h1>SavedPageSearchbar Component</h1>
      <Searchbar
        placeholder="Enter a sequence name..."
        query={sequenceQuery}
        setQuery={setSequenceQuery} />
    </div>
  )
};

export default SavedPageSearchbar;