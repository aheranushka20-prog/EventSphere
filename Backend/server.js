const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let events = [
  {
    id: 1,
    title: "React Workshop",
    date: "20 July 2026",
    location: "Pune",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    description:
      "Learn React from scratch and build modern interactive web applications.",
    price: "Free",
  },

  {
    id: 2,
    title: "Music Festival",
    date: "25 July 2026",
    location: "Mumbai",
    category: "Music",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    description:
      "Experience an unforgettable evening filled with live music, performances and amazing vibes.",
    price: "₹999",
  },

  {
    id: 3,
    title: "AI & Machine Learning Bootcamp",
    date: "2 August 2026",
    location: "Bengaluru",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    description:
      "A hands-on bootcamp covering Artificial Intelligence, Machine Learning and real-world projects.",
    price: "₹1499",
  },

  {
    id: 4,
    title: "College Hackathon 2026",
    date: "8 August 2026",
    location: "Nashik",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    description:
      "Build innovative solutions, compete with talented developers and win exciting prizes.",
    price: "Free",
  },

  {
    id: 5,
    title: "Startup Networking Meetup",
    date: "15 August 2026",
    location: "Mumbai",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-b413da4b-af72",
    description:
      "Connect with entrepreneurs, founders, investors and ambitious professionals.",
    price: "₹499",
  },

  {
    id: 6,
    title: "Inter-College Football Tournament",
    date: "22 August 2026",
    location: "Pune",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    description:
      "Compete with colleges across the city in an exciting football tournament.",
    price: "₹299",
  },

  {
    id: 7,
    title: "UI/UX Design Workshop",
    date: "30 August 2026",
    location: "Pune",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    description:
      "Learn user interface design, user experience principles and modern design tools.",
    price: "₹799",
  },

  {
    id: 8,
    title: "Fashion & Lifestyle Expo",
    date: "5 September 2026",
    location: "Mumbai",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    description:
      "Discover the latest fashion trends, lifestyle brands and creative designers.",
    price: "₹599",
  },

  {
    id: 9,
    title: "Photography Walk",
    date: "12 September 2026",
    location: "Nashik",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848",
    description:
      "Explore the city, capture beautiful moments and connect with fellow photographers.",
    price: "Free",
  },

  {
    id: 10,
    title: "Entrepreneurship Summit",
    date: "20 September 2026",
    location: "Bengaluru",
    category: "Business",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    description:
      "Learn from successful entrepreneurs and discover opportunities to build your own startup.",
    price: "₹999",
  },
];

let registrations = [];

/* GET ALL EVENTS */
app.get("/api/events", (req, res) => {
  res.json(events);
});

/* GET SINGLE EVENT */
app.get("/api/events/:id", (req, res) => {
  const event = events.find(
    (event) => event.id === Number(req.params.id)
  );

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  res.json(event);
});

/* ADD EVENT */
app.post("/api/events", (req, res) => {
  const newEvent = {
    id:
      events.length > 0
        ? Math.max(...events.map((event) => event.id)) + 1
        : 1,

    ...req.body,
  };

  events.push(newEvent);

  res.status(201).json({
    message: "Event created successfully",
    event: newEvent,
  });
});

/* EDIT EVENT */
app.put("/api/events/:id", (req, res) => {
  const eventId = Number(req.params.id);

  const eventIndex = events.findIndex(
    (event) => event.id === eventId
  );

  if (eventIndex === -1) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  events[eventIndex] = {
    ...events[eventIndex],
    ...req.body,
    id: eventId,
  };

  res.json({
    message: "Event updated successfully",
    event: events[eventIndex],
  });
});

/* DELETE EVENT */
app.delete("/api/events/:id", (req, res) => {
  const eventId = Number(req.params.id);

  const eventExists = events.some(
    (event) => event.id === eventId
  );

  if (!eventExists) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  events = events.filter(
    (event) => event.id !== eventId
  );

  res.json({
    message: "Event deleted successfully",
  });
});

/* REGISTER FOR EVENT */
app.post("/api/registrations", (req, res) => {
  const registration = {
    id: registrations.length + 1,
    ...req.body,
  };

  registrations.push(registration);

  res.status(201).json({
    message: "Registration successful",
    registration,
  });
});

/* GET REGISTRATIONS */
app.get("/api/registrations", (req, res) => {
  res.json(registrations);
});

/* START SERVER */
app.listen(5000, () => {
  console.log(
    "Server running on http://localhost:5000"
  );
});