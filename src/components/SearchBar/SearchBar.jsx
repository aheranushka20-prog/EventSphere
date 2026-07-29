import "./SearchBar.css";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">

      <input
        type="text"
        placeholder="Search events..."

        value={searchTerm}

        onChange={(e) =>
          setSearchTerm(e.target.value)
        }

      />

    </div>
  );
};

export default SearchBar;