const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'Ihr_Geheimer_Schluessel';

// MySQL DB Verbindungskonfiguration / my SQL db connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'todo_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;

// DB-Initislation mit Verbingdungsaufbau und Wiederholungslogik // Initialize database connection with retry logic
async function initDatabase() {
  let retries = 5;
  while (retries > 0) {
    try {
      console.log('Attempting to connect to MySQL database...');
      db = mysql.createPool(dbConfig);
      
      // Test der Verbindung 
      await db.execute('SELECT 1');
      console.log('Erfolgreich mit MSQL DB verbunden');
      
      // Erstellung der Tabellen 
      await createTables();
      return;
    } catch (error) {
      console.error(`Database connection failed (${retries} retries left):`, error.message);
      retries--;
      if (retries === 0) {
        console.error('Brudi, was ist da los? Die DB konnte nicht verbunden werden!');
        process.exit(1);
      }
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Erstelle Tabellenfunktionen / tables function
async function createTables() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Erstelle Kategorientabllen / Create categories table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255)
      )
    `);

    // Erstellung der Aufgabentabelle / create tasks table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        completed BOOLEAN DEFAULT FALSE,
        deadline VARCHAR(255),
        note TEXT,
        category_id INT,
        FOREIGN KEY(category_id) REFERENCES categories(id)
      )
    `);
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Benutzer Endpunkte / endpoints
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Benutzername bereits vergeben' });
    }
    res.status(500).json({ error: 'Serverfehler bei der Registrierung' });
  }
});

// Login Endpunkt / Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    
    if (!user) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Serverfehler beim Login' });
  }
});

// Rufe die authentiefizeirten Informationen des Benutzers ab / Get user data
app.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Kategorien Endpunkte / endpoints
app.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Füge Kategorie hinzu / Add category
app.post('/add_category', async (req, res) => {
  try {
    const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [req.body.name]);
    res.json({ id: result.insertId, name: req.body.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lösche Kategorie / Delete category
app.delete('/delete_category/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: "Kategorie gelöscht" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Tasks Endpunkte / endpoints
app.get('/tasks/:categoryId', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tasks WHERE category_id = ?', [req.params.categoryId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Füge Aufgabe hinzu / Add task
app.post('/add_task', async (req, res) => {
  try {
    const [result] = await db.execute(
      'INSERT INTO tasks (title, completed, deadline, note, category_id) VALUES (?, ?, ?, ?, ?)',
      [req.body.title, req.body.completed || 0, req.body.deadline || null, req.body.note || null, req.body.category_id]
    );
    res.json({ 
      id: result.insertId, 
      title: req.body.title, 
      completed: req.body.completed || 0, 
      deadline: req.body.deadline || null, 
      note: req.body.note || null, 
      category_id: req.body.category_id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lösche Aufgabe / Delete task
app.delete('/delete/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: "Eingabe gelöscht" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Update Aufgabe erledigt
app.put('/update_completed/:id', async (req, res) => {
  try {
    const [result] = await db.execute('UPDATE tasks SET completed = ? WHERE id = ?', [req.body.completed, req.params.id]);
    res.json({ message: 'Task status updated', changes: result.affectedRows });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Aktualisiere Notizen  / Update note
app.put('/update_note/:id', async (req, res) => {
  try {
    const [result] = await db.execute('UPDATE tasks SET note = ? WHERE id = ?', [req.body.note, req.params.id]);
    res.json({ message: 'Notiz erfolgreich aktualisiert.', changes: result.affectedRows });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Zähle offene und abgeschlossene Aufgaben pro Kategorie / Count open and completed tasks per category
app.get('/category_task_counts/:categoryId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
          SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) AS open_tasks,
          SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed_tasks
       FROM tasks WHERE category_id = ?`,
      [req.params.categoryId]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Datenbank intialisieren und Server starten
initDatabase().then(() => {
  app.listen(3050, "0.0.0.0", () => {
    console.log("\n🚀 ========================================");
    console.log("   TODO APP GOES FUNKY!");
    console.log("========================================");
    console.log("Backend API:    http://localhost:3050");
    // 3050/categories , 3050/tasks/$ ; $=ID// 
    console.log("Frontend App:   http://localhost:8080");
    console.log("MySQL Datenbank: localhost:3306");
    console.log("========================================");   
  });
}).catch(error => {
  console.error('Datenbank konnte nicht angesteuert werden:', error);
  process.exit(1);
});
