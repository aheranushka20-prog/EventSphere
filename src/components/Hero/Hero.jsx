import "./Hero.css";
import SearchBar from "../SearchBar/SearchBar";
import CategoryFilter from "../CategoryFilter/CategoryFilter";

const Hero = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  const handleExplore = () => {
    document
      .getElementById("events-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">
          EVENTSPHERE ✦ DISCOVER ✦ EXPERIENCE
        </p>

        <h1>
          Discover Amazing
          <span> Events Around You 🎉</span>
        </h1>

        <p className="hero-description">
          Explore workshops, hackathons, music festivals,
          sports events, business conferences and much more.
        </p>

        <div className="hero-search">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <button
          className="explore-btn"
          onClick={handleExplore}
        >
          Explore Events
          <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;