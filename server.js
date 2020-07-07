const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

//Init middleware instead of body parser
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/post", require("./routes/api/post"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server started on the port ${PORT}"));
