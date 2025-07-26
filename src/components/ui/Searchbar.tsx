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
                onChange={(e) => setQuery(e.target.value)}
                className="text-sm"
            />
        </div>
    );
};

export default Searchbar;
