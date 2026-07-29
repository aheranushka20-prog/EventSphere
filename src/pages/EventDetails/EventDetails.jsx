import "./EventDetails.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Event not found");
        }

        return response.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load event details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="event-details-page">
        <div className="event-details-status">
          <h2>Loading event details...</h2>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="event-details-page">
        <div className="event-details-status">
          <h2>Event Not Found</h2>

          <Link to="/events">
            ← Back to Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="event-details-page">

      <div className="event-details-container">

        <Link
          to="/events"
          className="back-link"
        >
          ← Back to Events
        </Link>

        <section className="event-details-hero">

          <div className="event-details-image-wrapper">

            <img
              src={event.image}
              alt={event.title}
              className="event-details-image"
            />

            <span className="details-category">
              {event.category}
            </span>

          </div>

          <div className="event-details-info">

            <p className="details-label">
              EVENT DETAILS
            </p>

            <h1>
              {event.title}
            </h1>

            <p className="details-description">
              {event.description}
            </p>

            <div className="details-info-grid">

              <div className="details-info-item">
                <span className="details-icon">
                  📅
                </span>

                <div>
                  <small>Date</small>
                  <strong>
                    {event.date}
                  </strong>
                </div>
              </div>

              <div className="details-info-item">
                <span className="details-icon">
                  📍
                </span>

                <div>
                  <small>Location</small>
                  <strong>
                    {event.location}
                  </strong>
                </div>
              </div>

              <div className="details-info-item">
                <span className="details-icon">
                  💰
                </span>

                <div>
                  <small>Entry Price</small>
                  <strong>
                    {event.price}
                  </strong>
                </div>
              </div>

            </div>

          </div>

        </section>

        <section className="registration-section">

          <div className="registration-intro">

            <p className="details-label">
              SECURE YOUR SPOT
            </p>

            <h2>
              Ready to join?
            </h2>

            <p>
              Complete the registration form
              to reserve your tickets for this
              event.
            </p>

          </div>

          <RegistrationForm
            event={event}
          />

        </section>

      </div>

    </main>
  );
}

export default EventDetails;