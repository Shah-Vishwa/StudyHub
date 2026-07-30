const http = require('http');
const { URL } = require('url');

const port = process.env.PORT || 3000;

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

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (requestUrl.pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'ok', service: 'StudyHub API', version: '0.1.0' }, null, 2));
        return;
    }

    if (requestUrl.pathname === '/api/student-dashboard' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(dashboardData, null, 2));
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }, null, 2));
});

server.listen(port, () => {
    console.log(`StudyHub API running on http://localhost:${port}`);
});