import { useEffect, useState } from "react";
import EventCard from "../../components/eventcard/eventcard";
import "./EventList.css";

function EventList({
  searchTerm = "",
  selectedCategory = "All",
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load events.");
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(search) ||
      event.location.toLowerCase().includes(search) ||
      event.category.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section
        id="events-section"
        className="events-section"
      >
        <div className="events-header">
          <p className="section-label">
            DISCOVER
          </p>

          <h2>Upcoming Events</h2>
        </div>

        <div className="events-message">
          <p>Loading amazing events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="events-section"
        className="events-section"
      >
        <div className="events-header">
          <p className="section-label">
            DISCOVER
          </p>

          <h2>Upcoming Events</h2>
        </div>

        <div className="events-message error-message">
          <p>{error}</p>
          <p>
            Please make sure the backend server is running.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="events-section"
      className="events-section"
    >
      <div className="events-header">
        <div>
          <p className="section-label">
            DISCOVER
          </p>

          <h2>Upcoming Events</h2>

          <p className="events-subtitle">
            Find your next unforgettable experience.
          </p>
        </div>

        <span className="event-count">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1
            ? "Event"
            : "Events"}
        </span>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="events-message">
          <div className="no-events-icon">
            🔍
          </div>

          <h3>No events found</h3>

          <p>
            Try searching for something else or choose
            another category.
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default EventList;