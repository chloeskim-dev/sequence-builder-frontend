import React from "react";

type Props = {
    placeholder?: string;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const Searchbar = ({ placeholder, query, setQuery }: Props) => {
    return (
        <input
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => setQuery(e.target.value)}
            className={`text-sm font-bold bg-white w-full text-center border-2 rounded-[12px] py-2 border-my-bg`}
        />
    );
};

export default Searchbar;
