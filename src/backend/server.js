const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'netflix_clone',
  port: 8889,
  waitForConnections: true,
  connectionLimit: 10
});
app.get('/api/liked-movies', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    const [rows] = await pool.execute(
      'SELECT * FROM liked_movies WHERE user_id = ? ORDER BY created_at DESC',
      [decoded.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/liked-movies', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    const { movie_id, movie_title, poster_path, vote_average, overview, genre_ids } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO liked_movies (user_id, movie_id, movie_title, poster_path, vote_average, overview, genre_ids) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [decoded.id, movie_id, movie_title, poster_path, vote_average, overview, JSON.stringify(genre_ids)]
    );
    
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Movie already liked' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.delete('/api/liked-movies/:movieId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    await pool.execute(
      'DELETE FROM liked_movies WHERE movie_id = ? AND user_id = ?',
      [req.params.movieId, decoded.id]
    );
    
    res.json({ message: 'Movie unliked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  console.log('Received token:', token);
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    console.log('Decoded:', decoded);
    res.json({ user: decoded });
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected on port 8889');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: { id: result.insertId, username, email }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const SERVER_PORT = 5000;

testConnection().then(() => {
  app.listen(SERVER_PORT, () => {
    console.log('Server running on port 5000');
  });
});