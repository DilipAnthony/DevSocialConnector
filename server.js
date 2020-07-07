const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.get("/", (req, res) => res.send("API running"));

app.use("/api/user", require("./ROutes/api/user"));
app.use("/api/auth", require("./ROutes/api/auth"));
app.use("/api/profiles", require("./ROutes/api/profiles"));
app.use("/api/post", require("./ROutes/api/post"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server started on the port ${PORT}"));
