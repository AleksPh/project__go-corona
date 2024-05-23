const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(bodyParser.json());

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Модель пользователя
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // 'admin' или 'user'
});

const User = mongoose.model('User', UserSchema);

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.status(201).send('User registered');
});

// Авторизация пользователя
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret');
  res.json({ token });
});

// Middleware для проверки JWT и ролей
const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
};

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send('Forbidden');
  }
  next();
};

// Пример защищенного маршрута
app.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.send('Welcome Admin');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
