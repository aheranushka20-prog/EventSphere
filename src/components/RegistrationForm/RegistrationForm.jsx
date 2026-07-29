import "./RegistrationForm.css";
import { useState } from "react";

function RegistrationForm({ event }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: event.id,
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      console.log(data);

      setIsRegistered(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    const ticketContent = `
========================================
              EVENTSPHERE
            EVENT TICKET
========================================

Event: ${event.title}

----------------------------------------

ATTENDEE DETAILS

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Tickets: ${formData.tickets}

----------------------------------------

EVENT DETAILS

Date: ${event.date}
Location: ${event.location}
Category: ${event.category}
Price: ${event.price}

========================================
       Thank you for registering! 🎉
========================================
`;

    const blob = new Blob(
      [ticketContent],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${event.title}-ticket.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const registerAnotherPerson = () => {
    setIsRegistered(false);

    setFormData({
      name: "",
      email: "",
      phone: "",
      tickets: 1,
    });
  };

  if (isRegistered) {
    return (
      <div className="registration-success">

        <div className="success-icon">
          🎉
        </div>

        <h2>
          Registration Successful!
        </h2>

        <p className="success-subtitle">
          Your spot has been successfully reserved.
        </p>

        <div className="ticket-card">

          <div className="ticket-header">

            <h3>
              {event.title}
            </h3>

            <span className="ticket-logo">
              EventSphere
            </span>

          </div>

          <div className="ticket-info">

            <p>
              Attendee
              <strong>
                {formData.name}
              </strong>
            </p>

            <p>
              Email
              <strong>
                {formData.email}
              </strong>
            </p>

            <p>
              Date
              <strong>
                {event.date}
              </strong>
            </p>

            <p>
              Location
              <strong>
                {event.location}
              </strong>
            </p>

            <p>
              Tickets
              <strong>
                {formData.tickets}
              </strong>
            </p>

            <p>
              Category
              <strong>
                {event.category}
              </strong>
            </p>

          </div>

        </div>

        <div className="success-actions">

          <button
            className="download-ticket-btn"
            onClick={downloadTicket}
          >
            ⬇️ Download Ticket
          </button>

          <button
            className="register-again-btn"
            onClick={registerAnotherPerson}
          >
            Register Another Person
          </button>

        </div>

      </div>
    );
  }

  return (
    <form
      className="registration-form"
      onSubmit={handleSubmit}
    >

      <h2>
        Register for {event.title}
      </h2>

      {error && (
        <p className="registration-error">
          {error}
        </p>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="tickets"
        min="1"
        value={formData.tickets}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Registering..."
          : "Confirm Registration"}
      </button>

    </form>
  );
}

export default RegistrationForm;