require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const dramaRoutes = require('./routes/dramaRoutes');
const bookRoutes = require('./routes/bookRoutes');
const crosswordRoutes = require('./routes/crosswordRoutes');
const bookProgressRoutes = require('./routes/bookProgress');

console.log("Books routes registered");



const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());


app.use(cookieParser());
app.use(session({
  secret: "korlang_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use('/api/dramas', dramaRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/crosswords', crosswordRoutes);
app.use('/api/book-progress', bookProgressRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.use(express.static(path.join(__dirname, "../client")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Сервер запущен на http://localhost:" + PORT));
