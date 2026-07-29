import "./eventcard.css";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <article className="event-card">

      <div className="event-card-image-wrapper">

        <img
          src={event.image}
          alt={event.title}
          className="event-card-image"
        />

        <span className="event-category">
          {event.category}
        </span>

      </div>

      <div className="event-card-content">

        <h3>
          {event.title}
        </h3>

        <div className="event-meta">

          <p>
            <span>📅</span>
            {event.date}
          </p>

          <p>
            <span>📍</span>
            {event.location}
          </p>

        </div>

        <div className="event-card-footer">

          <span className="event-price">
            {event.price}
          </span>

          <Link
            to={`/event/${event.id}`}
            className="view-event-btn"
          >
            View Details →
          </Link>

        </div>

      </div>

    </article>
  );
}

export default EventCard;