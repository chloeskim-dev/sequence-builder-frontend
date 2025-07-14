import React from "react";

type Props = {
    placeholder?: string;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
};

const Searchbar = ({ placeholder, query, setQuery }: Props) => {
    return (
        <div>
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                className="text-xs w-full px-2 py-2 border-2 rounded-xl"
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default Searchbar;
