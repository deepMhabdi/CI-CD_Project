// Import express framework
const express = require("express");
// Import axios for HTTP requests
const axios = require("axios");

// Create express app
const app = express();

// Frontend port (container port)
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const BACKEND_URL = "http://13.127.31.137:5002/"; // Update with your Flask backend URL

// Home route
app.get("/", (req, res) => {
  const { status, data } = req.query;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Frontend App</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        input { padding: 10px; width: 300px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <h2>Send Data to Flask Backend</h2>
      <form method="POST" action="/submit">
        <input type="text" name="data" placeholder="Enter some data..." required />
        <button type="submit">Submit</button>
      </form>

      ${status
      ? `<h3>Response</h3>
             <p><b>Status:</b> ${status}</p>
             <p><b>Data Received:</b> ${data}</p>`
      : ""
    }
    </body>
    </html>
  `);
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const formData = req.body.data;

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/submit`,
      { data: formData },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const status = encodeURIComponent(response.data.status);
    const data = encodeURIComponent(response.data.received_data);

    res.redirect(`/?status=${status}&data=${data}`);
  } catch (error) {
    console.error("Backend Error:", error.message);

    res.status(500).send(`
      <h2>Error</h2>
      <p>Could not reach Flask backend</p>
      <p><b>Backend URL:</b> ${BACKEND_URL}/api/submit</p>
      <p><b>Error:</b> ${error.message}</p>
      <a href="/">Go back</a>
    `);
  }
});


// Health check (used by ALB)
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "frontend" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on port ${PORT}`);
  console.log(`Backend URL: ${BACKEND_URL}/api`);
});
