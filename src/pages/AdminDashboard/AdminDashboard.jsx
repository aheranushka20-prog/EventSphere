import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    location: "",
    category: "",
    image: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    if (isLoggedIn !== "true") {
      navigate("/admin-login");
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const registrationsResponse = await fetch(
        "http://localhost:5000/api/registrations"
      );

      const eventsResponse = await fetch(
        "http://localhost:5000/api/events"
      );

      const registrationsData =
        await registrationsResponse.json();

      const eventsData =
        await eventsResponse.json();

      setRegistrations(registrationsData);
      setEvents(eventsData);
    } catch (error) {
      console.error(
        "Error loading dashboard:",
        error
      );
    }
  };

  const handleChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEventForm({
      title: "",
      date: "",
      location: "",
      category: "",
      image: "",
      description: "",
      price: "",
    });

    setEditingEventId(null);
    setShowForm(false);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Event created successfully 🎉");

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEditEvent = (event) => {
    setEventForm({
      title: event.title,
      date: event.date,
      location: event.location,
      category: event.category,
      image: event.image,
      description: event.description,
      price: event.price,
    });

    setEditingEventId(event.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${editingEventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Event updated successfully 🎉");

      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Event deleted successfully");

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to delete event");
    }
  };

  const getEventName = (eventId) => {
    const event = events.find(
      (event) => event.id === eventId
    );

    return event
      ? event.title
      : "Unknown Event";
  };

  /* =========================
     FILTER REGISTRATIONS
  ========================= */

  const filteredRegistrations =
    registrations.filter((registration) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        registration.name
          ?.toLowerCase()
          .includes(search) ||
        registration.email
          ?.toLowerCase()
          .includes(search) ||
        registration.phone
          ?.toLowerCase()
          .includes(search);

      const matchesEvent =
        selectedEvent === "All" ||
        String(registration.eventId) ===
          String(selectedEvent);

      return matchesSearch && matchesEvent;
    });

  /* =========================
     EXPORT REGISTRATIONS
  ========================= */

  const exportRegistrations = () => {
    if (filteredRegistrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Event",
      "Tickets",
    ];

    const rows = filteredRegistrations.map(
      (registration) => [
        registration.name,
        registration.email,
        registration.phone,
        getEventName(registration.eventId),
        registration.tickets,
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "EventSphere-Registrations.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const totalTickets = registrations.reduce(
    (total, registration) =>
      total + Number(registration.tickets),
    0
  );

  const registrationCountByEvent = events.map(
    (event) => {
      const total = registrations
        .filter(
          (registration) =>
            registration.eventId === event.id
        )
        .reduce(
          (sum, registration) =>
            sum + Number(registration.tickets),
          0
        );

      return {
        ...event,
        total,
      };
    }
  );

  const mostPopularEvent =
    registrationCountByEvent.length > 0
      ? registrationCountByEvent.reduce(
          (max, event) =>
            event.total > max.total
              ? event
              : max,
          registrationCountByEvent[0]
        )
      : null;

  const maxRegistrations = Math.max(
    ...registrationCountByEvent.map(
      (event) => event.total
    ),
    1
  );

const handleLogout = () => {
  localStorage.removeItem("isAdminLoggedIn");
  localStorage.removeItem("showAdmin");

  navigate("/");
};
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          Event<span>Sphere</span>
        </div>

        <nav>

          <button className="active">
            📊 Dashboard
          </button>

          <button
            onClick={() =>
              document
                .getElementById("analytics-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            📈 Analytics
          </button>

          <button
            onClick={() =>
              document
                .getElementById("events-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            🎉 Events
          </button>

          <button
            onClick={() =>
              document
                .getElementById(
                  "registrations-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            👥 Registrations
          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <p className="welcome-text">
              WELCOME BACK, ADMIN
            </p>

            <h1>
              Admin Dashboard
            </h1>

          </div>

          <button
            className="header-add-btn"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm
              ? "Close Form"
              : "+ Add New Event"}
          </button>

        </header>

        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon purple">
              👥
            </div>

            <div>

              <p>
                Total Registrations
              </p>

              <h2>
                {registrations.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              🎟️
            </div>

            <div>

              <p>
                Total Tickets
              </p>

              <h2>
                {totalTickets}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              🎉
            </div>

            <div>

              <p>
                Total Events
              </p>

              <h2>
                {events.length}
              </h2>

            </div>

          </div>

        </section>

        {/* INSIGHTS */}

        <section className="insights-grid">

          <div className="popular-event-card">

            <div className="insight-heading">

              <div>

                <p className="section-label">
                  TOP PERFORMER
                </p>

                <h2>
                  Most Popular Event
                </h2>

              </div>

              <span className="trophy-icon">
                🏆
              </span>

            </div>

            {mostPopularEvent &&
            mostPopularEvent.total > 0 ? (

              <div className="popular-event-content">

                <img
                  src={mostPopularEvent.image}
                  alt={mostPopularEvent.title}
                />

                <div>

                  <h3>
                    {mostPopularEvent.title}
                  </h3>

                  <p>
                    📍 {mostPopularEvent.location}
                  </p>

                  <strong>
                    {mostPopularEvent.total} tickets booked
                  </strong>

                </div>

              </div>

            ) : (

              <div className="no-insight">
                No registrations yet
              </div>

            )}

          </div>

          <div className="activity-card">

            <div className="insight-heading">

              <div>

                <p className="section-label">
                  LIVE UPDATES
                </p>

                <h2>
                  Recent Registrations
                </h2>

              </div>

              <span className="activity-icon">
                🔔
              </span>

            </div>

            {registrations.length === 0 ? (

              <div className="no-insight">
                No recent activity
              </div>

            ) : (

              <div className="activity-list">

                {registrations
                  .slice(-4)
                  .reverse()
                  .map(
                    (registration) => (

                      <div
                        className="activity-item"
                        key={registration.id}
                      >

                        <div className="activity-avatar">
                          {registration.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {registration.name}
                          </strong>

                          <p>
                            Registered for{" "}
                            {getEventName(
                              registration.eventId
                            )}
                          </p>

                        </div>

                        <span>
                          🎟️{" "}
                          {registration.tickets}
                        </span>

                      </div>

                    )
                  )}

              </div>

            )}

          </div>

        </section>

        {/* ANALYTICS */}

        <section
          id="analytics-section"
          className="dashboard-section analytics-section"
        >

          <div className="section-heading">

            <div>

              <p className="section-label">
                PERFORMANCE OVERVIEW
              </p>

              <h2>
                Registration Analytics
              </h2>

            </div>

            <span className="event-count">
              {totalTickets} Total Tickets
            </span>

          </div>

          {events.length === 0 ? (

            <div className="empty-state">
              No events available for analytics.
            </div>

          ) : (

            <div className="analytics-list">

              {registrationCountByEvent.map(
                (event) => (

                  <div
                    className="analytics-row"
                    key={event.id}
                  >

                    <div className="analytics-info">

                      <strong>
                        {event.title}
                      </strong>

                      <span>
                        {event.total} tickets
                      </span>

                    </div>

                    <div className="analytics-bar-background">

                      <div
                        className="analytics-bar"
                        style={{
                          width: `${
                            (event.total /
                              maxRegistrations) *
                            100
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ADD / EDIT FORM */}

        {showForm && (

          <section className="event-form-card">

            <div className="section-heading">

              <div>

                <p className="section-label">
                  {editingEventId
                    ? "UPDATE EVENT"
                    : "CREATE EVENT"}
                </p>

                <h2>
                  {editingEventId
                    ? "Edit Event"
                    : "Add New Event"}
                </h2>

              </div>

            </div>

            <form
              onSubmit={
                editingEventId
                  ? handleUpdateEvent
                  : handleAddEvent
              }
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Event Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    value={eventForm.title}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="text"
                    name="date"
                    placeholder="20 July 2026"
                    value={eventForm.date}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={eventForm.location}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="Technology, Music, Sports..."
                    value={eventForm.category}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="text"
                    name="price"
                    placeholder="Free or ₹999"
                    value={eventForm.price}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    placeholder="Optional image URL"
                    value={eventForm.image}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe your event..."
                  value={eventForm.description}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                >
                  {editingEventId
                    ? "Update Event"
                    : "Create Event"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* REGISTRATIONS */}

        <section
          id="registrations-section"
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>

              <p className="section-label">
                ATTENDEE MANAGEMENT
              </p>

              <h2>
                All Registrations
              </h2>

            </div>

            <div className="registration-actions">

              <button
                className="export-btn"
                onClick={exportRegistrations}
              >
                ⬇ Export CSV
              </button>

              <span className="event-count">
                {filteredRegistrations.length} Registrations
              </span>

            </div>

          </div>

          {/* SEARCH + FILTER */}

          <div className="registration-filters">

            <input
              type="text"
              placeholder="🔍 Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            <select
              value={selectedEvent}
              onChange={(e) =>
                setSelectedEvent(e.target.value)
              }
            >

              <option value="All">
                All Events
              </option>

              {events.map((event) => (

                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.title}
                </option>

              ))}

            </select>

          </div>

          {filteredRegistrations.length === 0 ? (

            <div className="empty-state">

              <h3>
                No matching registrations
              </h3>

              <p>
                Try changing your search or event filter.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>PHONE</th>
                    <th>EVENT</th>
                    <th>TICKETS</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredRegistrations.map(
                    (registration) => (

                      <tr
                        key={registration.id}
                      >

                        <td className="attendee-name">
                          {registration.name}
                        </td>

                        <td>
                          {registration.email}
                        </td>

                        <td>
                          {registration.phone}
                        </td>

                        <td>
                          {getEventName(
                            registration.eventId
                          )}
                        </td>

                        <td>

                          <span className="ticket-badge">
                            {registration.tickets}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* EVENTS */}

        <section
          id="events-section"
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>

              <p className="section-label">
                EVENT MANAGEMENT
              </p>

              <h2>
                All Events
              </h2>

            </div>

            <span className="event-count">
              {events.length} Events
            </span>

          </div>

          {events.length === 0 ? (

            <div className="empty-state">

              <h3>
                No events available
              </h3>

            </div>

          ) : (

            <div className="events-grid">

              {events.map((event) => (

                <div
                  className="event-admin-card"
                  key={event.id}
                >

                  <img
                    src={event.image}
                    alt={event.title}
                  />

                  <div className="event-card-content">

                    <span className="category-tag">
                      {event.category}
                    </span>

                    <h3>
                      {event.title}
                    </h3>

                    <p>
                      📅 {event.date}
                    </p>

                    <p>
                      📍 {event.location}
                    </p>

                    <div className="event-card-footer">

                      <strong>
                        {event.price}
                      </strong>

                      <div className="event-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEditEvent(event)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteEvent(
                              event.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;