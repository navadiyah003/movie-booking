// src/components/SearchBox.js
import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineCloseCircle } from 'react-icons/ai';
import { MdClear } from "react-icons/md";
const SearchBox = ({ data, setData, setIsLoading, placeholder }) => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchText(inputValue);

        setIsLoading(true);

        // Filter the movies list based on all properties
        const filteredMovies = data.filter((obj) =>
            Object.values(obj).some(
                (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(inputValue.toLowerCase())
            )
        );

        setTimeout(() => {
            setData(filteredMovies);
            setIsLoading(false);
        }, 500);
    };


    const handleClearClick = () => {
        setSearchText('');
        setData(data); // Reset the movies list to the original data
    };

    return (
        <div className="flex items-center rounded-md border border-gray-300 px-4 py-2">
            <AiOutlineSearch className="h-6 w-6 text-gray-500 mr-2" />
            <input
                type="text"
                placeholder={placeholder ? placeholder : "Search..."}
                className="w-full outline-none text-gray-800 placeholder-gray-500"
                value={searchText}
                onChange={handleInputChange}
            />
            {searchText && (
                <MdClear
                    className="text-gray-500 ml-2 cursor-pointer"
                    onClick={handleClearClick}
                    size={17}
                />
            )}
        </div>
    );
};

export default SearchBox;
