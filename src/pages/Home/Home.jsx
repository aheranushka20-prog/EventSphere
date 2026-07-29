import { useState } from "react";

import Hero from "../../components/Hero/Hero";
import EventList from "../EventList/EventList";
import Footer from "../../components/Footer/Footer";

function Home() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  return (
    <>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
      />

      <EventList
        searchTerm={searchTerm}
        selectedCategory={
          selectedCategory
        }
      />

      <Footer />
    </>
  );
}

export default Home;