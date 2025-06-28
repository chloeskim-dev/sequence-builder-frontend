import React from "react";

type Props = {
  placeholder?: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const Searchbar = ({ placeholder, query, setQuery }: Props) => {
  return (
    <div>
      {/* <h1> QUERY STRING (state): {query} </h1> */}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        className="text-center w-full px-4 py-2"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;
