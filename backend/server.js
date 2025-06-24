const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./tasks.db');

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'Ihr_Geheimer_Schluessel';

// Benutzer-Tabelle erstellen, falls sie nicht existiert
db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

// Kategorien-Tabelle erstellen, falls sie nicht existiert
db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    ) 
  `);

// Aufgaben-Tabelle mit Kategorie-Feld aktualisieren
db.run(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      title TEXT, completed BOOLEAN DEFAULT 0, 
      deadline TEXT, 
      note TEXT, 
      category_id INTEGER, 
      FOREIGN KEY(category_id) REFERENCES categories(id)
    )
  `);


// -------------------------------
// Authentifizierungs-Middleware
// -------------------------------
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

// -------------------------------
// Benutzer-Endpunkte
// -------------------------------
app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
        [username, hashedPassword], 
        function(err) {
          if (err) {
            return res.status(400).json({ error: 'Benutzername bereits vergeben' });
          }
          res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Serverfehler bei der Registrierung' });
    }
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
      }
      
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, username: user.username });
    });
  });
  
  app.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });
  

// Kategorien abrufen
app.get('/categories', (req, res) => {
    db.all('SELECT * FROM categories', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Kategorie hinzufügen
app.post('/add_category', (req, res) => {
    db.run('INSERT INTO categories (name) VALUES (?)', [req.body.name], function () {
        res.json({ id: this.lastID, name: req.body.name });
    });
});

// Kategorie löschen
app.delete('/delete_category/:id', (req, res) => {
    db.run('DELETE FROM categories WHERE id = ?', req.params.id, function (err) {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ message: "Kategorie gelöscht" });
    });
});

app.delete('/delete/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', req.params.id, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Eingabe gelöscht" });
    });
});



// Aufgabe als erledigt markieren
app.put('/update_completed/:id', (req, res) => {
    db.run('UPDATE tasks SET completed = ? WHERE id = ?', 
        [req.body.completed, req.params.id], 
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ message: 'Task status updated', changes: this.changes });
        }
    );
});


// Aufgaben einer bestimmten Kategorie abrufen
app.get('/tasks/:categoryId', (req, res) => {
    db.all('SELECT * FROM tasks WHERE category_id = ?', req.params.categoryId, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Notizen aendern
app.put('/update_note/:id', (req, res) => {
    db.run('UPDATE tasks SET note = ? WHERE id = ?', 
        [req.body.note, req.params.id], 
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ message: 'Notiz erfolgreich aktualisiert.', changes: this.changes });
        }
    );
});


// Neue Aufgabe hinzufügen
app.post('/add_task', (req, res) => {
    db.run('INSERT INTO tasks (title, completed, deadline, note, category_id) VALUES (?, ?, ?, ?, ?)',
        [req.body.title, req.body.completed || 0, req.body.deadline || null, req.body.note || null, req.body.category_id], 
        function () {
            res.json({ id: this.lastID, title: req.body.title, completed: req.body.completed || 0, deadline: req.body.deadline || null, note: req.body.note || null, category_id: req.body.category_id });
        }
    );
});

// Zähle offene und erledigte Aufgaben pro Kategorie
app.get('/category_task_counts/:categoryId', (req, res) => {
    db.get(
        `SELECT 
            SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) AS open_tasks,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed_tasks
         FROM tasks WHERE category_id = ?`,
        [req.params.categoryId],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(row);
            }
        }
    );
});


app.listen(3050, "0.0.0.0", () => {
    console.log("Docker-Server running on Port 3050");
});