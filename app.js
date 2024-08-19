const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const morgan = require("morgan");
const http = require('http');
const config = require("config")
const app = express();
const server = http.createServer(app);

// app.use(morgan('combined'));

// Middleware to enable CORS for localhost only
const corsOptions = {
    origin: ["http://localhost:3000", "https://unical-med.uz"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));

// Database connection
const {start} = require("./connectDB/db");
start(app);

// Routers
const {routers} = require("./routers/routers");
routers(app);

// Message scheduling
const {sendMessage} = require("./routers/message/message");
sendMessage();
setInterval(() => {
    sendMessage();
}, 1000 * 60 * 60 * 12);

// Static file serving in production
if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "./frontend", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./frontend", "build", "index.html"));
    });
}
// Initialize Socket.IO
const initializeSocket = require('./socket');
initializeSocket(server);
const PORT = config.get("PORT");

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
