const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

const frontendDir = path.join(__dirname, '..', 'Frontend');
const databaseFile = path.join(__dirname, '..', 'Database', 'users.json');
const materialsFile = path.join(__dirname, '..', 'Database', 'materials.json');
const uploadsDir = path.join(__dirname, '..', 'Database', 'uploads');

// Ensure Database directory exists
const dbDir = path.dirname(databaseFile);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Ensure users.json exists and is an array
if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(databaseFile, JSON.stringify([], null, 2));
}

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure materials.json exists
if (!fs.existsSync(materialsFile)) {
    fs.writeFileSync(materialsFile, JSON.stringify([], null, 2));
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files and uploads
app.use(express.static(frontendDir));
app.use('/assets', express.static(path.join(__dirname, '..', 'Assets')));
app.use('/uploads', express.static(uploadsDir));

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

function normalizeSkills(skills) {
    if (Array.isArray(skills)) {
        return skills.map((skill) => String(skill).trim()).filter(Boolean);
    }

    if (typeof skills === 'string') {
        return skills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [];
}

function buildSafeUser(user) {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        profilePicture: user.profilePicture || '',
        bio: user.bio || '',
        phone: user.phone || '',
        skills: Array.isArray(user.skills) ? user.skills : []
    };
}

function findUserIndexById(users, id) {
    return users.findIndex((user) => user.id === id);
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
            createdAt: user.createdAt || new Date().toISOString(),
            profilePicture: user.profilePicture || '',
            bio: user.bio || '',
            phone: user.phone || '',
            skills: normalizeSkills(user.skills)
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
        const safeUser = buildSafeUser(user);

        res.json({ message: 'Login successful.', user: safeUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// PUT /api/users/:id/settings
app.put('/api/users/:id/settings', (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            email,
            phone,
            bio,
            profilePicture,
            skills,
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        const users = loadUsers();
        const userIndex = findUserIndexById(users, id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[userIndex];

        if (email && users.some((entry) => entry.id !== id && entry.email.toLowerCase() === email.toLowerCase())) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: 'Please complete all password fields.' });
            }

            if (user.password !== currentPassword) {
                return res.status(401).json({ message: 'Current password is incorrect.' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'New password and confirmation do not match.' });
            }

            user.password = newPassword;
        }

        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();
        if (email) user.email = email.trim();
        if (phone !== undefined) user.phone = phone.trim();
        if (bio !== undefined) user.bio = bio.trim();
        if (profilePicture !== undefined) user.profilePicture = profilePicture.trim();
        if (skills !== undefined) user.skills = normalizeSkills(skills);

        users[userIndex] = user;
        saveUsers(users);

        res.json({ message: 'Settings updated successfully.', user: buildSafeUser(user) });
    } catch (error) {
        res.status(400).json({ message: 'Invalid request body.' });
    }
});

// GET /api/users (Debug helper)
app.get('/api/users', (req, res) => {
    const users = loadUsers().map(user => {
        const { password, ...safeUser } = user;
        return buildSafeUser(safeUser);
    });
    res.json({ users });
});

// Helpers for materials database
function loadMaterials() {
    try {
        const raw = fs.readFileSync(materialsFile, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveMaterials(materials) {
    fs.writeFileSync(materialsFile, JSON.stringify(materials, null, 2));
}

// GET /api/materials
app.get('/api/materials', (req, res) => {
    try {
        const { subject, category, uploadedById } = req.query;
        let materials = loadMaterials();

        if (subject) {
            materials = materials.filter(m => m.subject.toLowerCase() === subject.toLowerCase());
        }
        if (category) {
            materials = materials.filter(m => m.category.toLowerCase() === category.toLowerCase());
        }
        if (uploadedById) {
            materials = materials.filter(m => m.uploadedById === uploadedById);
        }

        res.json({ materials });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// POST /api/materials
app.post('/api/materials', upload.single('file'), (req, res) => {
    try {
        const { subject, category, title, description, uploadedBy, uploadedById } = req.body;
        const file = req.file;

        if (!subject || !category || !title || !file) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({ message: 'Please complete all required fields and upload a file.' });
        }

        const materials = loadMaterials();
        const newMaterial = {
            id: Date.now().toString(36),
            subject,
            category,
            title: title.trim(),
            description: (description || '').trim(),
            originalName: file.originalname,
            fileName: file.filename,
            fileSize: file.size,
            uploadedBy: (uploadedBy || 'Instructor').trim(),
            uploadedById: uploadedById || '',
            uploadedAt: new Date().toISOString()
        };

        materials.push(newMaterial);
        saveMaterials(materials);

        res.status(201).json({ message: 'Material uploaded successfully.', material: newMaterial });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Failed to upload material.' });
    }
});

// DELETE /api/materials/:id
app.delete('/api/materials/:id', (req, res) => {
    try {
        const { id } = req.params;
        const materials = loadMaterials();
        const index = materials.findIndex(m => m.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Material not found.' });
        }

        const material = materials[index];
        const filePath = path.join(uploadsDir, material.fileName);

        // Delete physical file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete metadata
        materials.splice(index, 1);
        saveMaterials(materials);

        res.json({ message: 'Material deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete material.' });
    }
});

// Fallback route for static 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
    console.log(`StudyHub API running on http://localhost:${port}`);
});