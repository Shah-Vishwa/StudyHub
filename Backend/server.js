const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const port = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, '..', 'Frontend');
const databaseFile = path.join(__dirname, '..', 'Database', 'users.json');

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

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(payload, null, 2));
}

function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (error, data) => {
        if (error) {
            sendJson(res, 404, { error: 'File not found' });
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = requestUrl.pathname;

    if (pathname === '/api/health' && req.method === 'GET') {
        sendJson(res, 200, { status: 'ok', service: 'StudyHub API', version: '0.1.0' });
        return;
    }

    if (pathname === '/api/student-dashboard' && req.method === 'GET') {
        sendJson(res, 200, dashboardData);
        return;
    }

    if (pathname === '/api/register' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const user = JSON.parse(body);
                const users = loadUsers();

                if (!user.firstName || !user.lastName || !user.email || !user.password || !user.role) {
                    sendJson(res, 400, { message: 'Please complete all required fields.' });
                    return;
                }

                const existing = users.find((entry) => entry.email.toLowerCase() === user.email.toLowerCase());
                if (existing) {
                    sendJson(res, 409, { message: 'An account with this email already exists.' });
                    return;
                }

                const newUser = {
                    id: Date.now().toString(36),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    createdAt: user.createdAt || new Date().toISOString()
                };

                users.push(newUser);
                saveUsers(users);
                sendJson(res, 201, { message: 'Account created successfully.', user: newUser });
            } catch (error) {
                sendJson(res, 400, { message: 'Invalid request body.' });
            }
        });
        return;
    }

    if (pathname === '/api/users' && req.method === 'GET') {
        sendJson(res, 200, { users: loadUsers() });
        return;
    }

    if (pathname === '/' || pathname === '/index.html') {
        sendFile(res, path.join(frontendDir, 'index.html'));
        return;
    }

    const safePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    const filePath = path.join(frontendDir, safePath);

    if (filePath.startsWith(frontendDir) && fs.existsSync(filePath)) {
        sendFile(res, filePath);
        return;
    }

    sendJson(res, 404, { error: 'Not found' });
});

server.listen(port, () => {
    console.log(`StudyHub API running on http://localhost:${port}`);
});