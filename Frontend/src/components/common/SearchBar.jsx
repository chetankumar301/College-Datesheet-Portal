import { FaSearch } from "react-icons/fa";

export default function SearchBar({

    value,

    onChange,

    placeholder="Search..."

}){

    return(

        <div className="search-bar">

            <FaSearch/>

            <input

                value={value}

                onChange={onChange}

                placeholder={placeholder}

            />

        </div>

    );

}