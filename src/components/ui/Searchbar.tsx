import React from "react";

type Props = {
  placeholder?: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const Searchbar = ({placeholder, query, setQuery}: Props) => {
  return (
    <div>
      <h1>Searchbar Component</h1>
      {/* <h1> QUERY STRING (state): {query} </h1> */}
      <input 
        type="text"
        value={query}
        placeholder={placeholder}
        className="text-center w-full p-1"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
};

export default Searchbar;