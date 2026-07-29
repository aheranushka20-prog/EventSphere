import "./CategoryFilter.css";

const categories = [
  "All",
  "Technology",
  "Music",
  "Sports",
  "Business",
];

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="categories">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={
            selectedCategory === category
              ? "active"
              : ""
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;