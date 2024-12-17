const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'unblocker-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  if (!req.session.authenticated) {
    return res.sendFile(path.join(__dirname, 'views', 'password.html'));
  }
  res.sendFile(path.join(__dirname, 'views', 'unblocker.html'));
});

app.post('/password', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    req.session.authenticated = true;
    return res.redirect('/');
  }
  res.send(`
    <h2>Incorrect Password</h2>
    <a href="/">Try Again</a>
  `);
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
