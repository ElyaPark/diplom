const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userCheck.rows.length) return res.status(400).json({ message: "Email уже занят" });

  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (username, email, password, level, avatar, streak) VALUES ($1, $2, $3, 1, '', 0)",
    [username, email, hashed]
  );

  res.status(201).json({ message: "Регистрация успешна" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (!user.rows.length) return res.status(400).json({ message: "Пользователь не найден" });

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(400).json({ message: "Неверный пароль" });

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
    path: "/"
  });

  res.json({ message: "Вход выполнен" });
};

exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" }).json({ message: "Выход выполнен" });
};

exports.check = (req, res) => {
  res.json({ message: "Вы авторизованы", userId: req.user.id });
};
