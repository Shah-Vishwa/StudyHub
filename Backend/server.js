const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const frontendDir = path.join(__dirname, '..', 'Frontend');
const databaseFile = path.join(__dirname, '..', 'Database', 'users.json');

// Ensure Database directory exists
const dbDir = path.dirname(databaseFile);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Ensure users.json exists and is an array
if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(databaseFile, JSON.stringify([], null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(frontendDir));

const dashboardData = {
    student: 'Vishwa Shah',
    activeCourses: 6,
    assignmentsDue: 3,
    completion: 87,
    apiStatus: 'live',
    courses: [
        'Linux Administration Bootcamp',
        'Git & GitHub Essentials',
        'Networking Fundamentals',
        'AWS Cloud Practitioner',
        'Docker Fundamentals',
        'Kubernetes Basics'
    ]
};

function loadUsers() {
    try {
        const raw = fs.readFileSync(databaseFile, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(databaseFile, JSON.stringify(users, null, 2));
}

// GET /api/health
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'StudyHub API', version: '0.1.0' });
});

// GET /api/student-dashboard
app.get('/api/student-dashboard', (req, res) => {
    res.json(dashboardData);
});

// POST /api/register
app.post('/api/register', (req, res) => {
    try {
        const user = req.body;
        const users = loadUsers();

        if (!user.firstName || !user.lastName || !user.email || !user.password || !user.role) {
            return res.status(400).json({ message: 'Please complete all required fields.' });
        }

        const existing = users.find((entry) => entry.email.toLowerCase() === user.email.toLowerCase());
        if (existing) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const newUser = {
            id: Date.now().toString(36),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password, // In production, hash passwords (e.g. with bcrypt)
            role: user.role,
            createdAt: user.createdAt || new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: 'Account created successfully.', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request body.' });
    }
});

// POST /api/login
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        const users = loadUsers();
        const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Return user details without password for security
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.json({ message: 'Login successful.', user: safeUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET /api/users (Debug helper)
app.get('/api/users', (req, res) => {
    const users = loadUsers().map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
    });
    res.json({ users });
});

// Fallback route for static 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
    console.log(`StudyHub API running on http://localhost:${port}`);
});