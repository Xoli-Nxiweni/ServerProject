require('dotenv').config();
const http = require('http');

let blogs = [];

const methodNotAllowed = (res) => {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
}

const notFound = (res, message = 'Not Found') => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
}

const badRequest = (res, message) => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Request', message }));
}
// const internalServerError = (res, message) => {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ error: 'Internal Server Error', message }));
// }

const server = http.createServer((req, res) => {
    const { method, url } = req;
    const [_, endpoint, id] = url.split('/');

    try {
        if (endpoint === '') {
            if (method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Greetings! You've reached Xoli's server on the root route!");
            } else {
                methodNotAllowed(res);
            }
        } else if (endpoint === 'blogs') {
            if (method === 'GET') {
                // Handle GET /blogs
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Fetched blogs', data: blogs }));
            } else if (method === 'POST') {
                // Handle POST /blogs
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const parsedBody = JSON.parse(body);
                        parsedBody.id = blogs.length + 1; // Simple ID assignment
                        blogs.push(parsedBody);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Blog created', data: parsedBody }));
                    } catch (error) {
                        badRequest(res, 'Invalid JSON payload');
                    }
                });
            } else if (method === 'PUT' && id) {
                // Handle PUT /blogs/:id
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const parsedBody = JSON.parse(body);
                        const index = blogs.findIndex(blog => blog.id === parseInt(id));
                        if (index === -1) return notFound(res, 'Blog not found');
                        blogs[index] = { ...parsedBody, id: parseInt(id) };
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Blog updated', data: blogs[index] }));
                    } catch (error) {
                        badRequest(res, 'Invalid JSON payload');
                    }
                });
            } else if (method === 'PATCH' && id) {
                // Handle PATCH /blogs/:id
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const parsedBody = JSON.parse(body);
                        const index = blogs.findIndex(blog => blog.id === parseInt(id));
                        if (index === -1) return notFound(res, 'Blog not found');
                        blogs[index] = { ...blogs[index], ...parsedBody };
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Blog partially updated', data: blogs[index] }));
                    } catch (error) {
                        badRequest(res, 'Invalid JSON payload');
                    }
                });
            } else if (method === 'DELETE' && id) {
                // Handle DELETE /blogs/:id
                const index = blogs.findIndex(blog => blog.id === parseInt(id));
                if (index === -1) return notFound(res, 'Blog not found');
                blogs.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Blog deleted' }));
            } else {
                methodNotAllowed(res);
            }
        } else {
            notFound(res, 'Endpoint not found');
        }
    } catch (e) {
        console.error('Server error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Error handling for server
server.on('error', (error) => {
    console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
