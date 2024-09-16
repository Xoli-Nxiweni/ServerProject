require('dotenv').config();
const http = require('http');

let dataStore = [];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    let body = '';

    req.on('data', chunk => (body += chunk.toString()));

    req.on('end', () => {
        const [_, endpoint, id] = url.split('/');

        switch (endpoint) {
            case '':
                return respond(res, 200, "Greetings! You've reached Xoli's server on the root route!");

            case 'fetch':
                if (method === 'GET') {
                    return getData(res, "Welcome to the GET /fetch endpoint!");
                }
                return methodNotAllowed(res);

            case 'add':
                if (method === 'POST') {
                    return handleData(body, res, 'create', "Welcome to the POST /add endpoint!");
                }
                return methodNotAllowed(res);

            case 'update':
                if (method === 'PUT' && id) {
                    return handleData(body, res, 'update', id, "Welcome to the PUT /update endpoint!");
                }
                return methodNotAllowed(res);

            case 'modify':
                if (method === 'PATCH' && id) {
                    return handleData(body, res, 'patch', id, "Welcome to the PATCH /modify endpoint!");
                }
                return methodNotAllowed(res);

            case 'remove':
                if (method === 'DELETE' && id) {
                    return handleData(null, res, 'delete', id, "Welcome to the DELETE /remove endpoint!");
                }
                return methodNotAllowed(res);

            default:
                return respond(res, 404, { error: 'Not Found' });
        }
    });
});

// Handle GET request
const getData = (res, welcomeMessage) => respond(res, 200, { message: welcomeMessage, data: dataStore });

// Handle CRUD actions
const handleData = (body, res, action, id = null, welcomeMessage = '') => {
    try {
        const parsedData = body ? JSON.parse(body) : null;
        switch (action) {
            case 'create':
                parsedData.id = dataStore.length + 1;
                dataStore.push(parsedData);
                return respond(res, 201, { message: welcomeMessage + ' Data created.', data: parsedData });
            case 'update':
            case 'patch': {
                const index = dataStore.findIndex(item => item.id === parseInt(id));
                if (index === -1) return respond(res, 404, { error: 'Data not found' });
                dataStore[index] = action === 'patch' ? { ...dataStore[index], ...parsedData } : { ...parsedData, id: parseInt(id) };
                return respond(res, 200, { message: welcomeMessage + ` Data ${action}d.`, data: dataStore[index] });
            }
            case 'delete': {
                const index = dataStore.findIndex(item => item.id === parseInt(id));
                if (index === -1) return respond(res, 404, { error: 'Data not found' });
                dataStore.splice(index, 1);
                return respond(res, 200, { message: welcomeMessage + ' Data deleted.' });
            }
        }
    } catch {
        return respond(res, 400, { error: 'Invalid JSON payload' });
    }
}

// Utility function for responding
const respond = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(typeof message === 'string' ? message : JSON.stringify(message));
}

// Utility function for method not allowed
const methodNotAllowed = (res) => respond(res, 405, { error: 'Method Not Allowed' });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is up at http://localhost:${PORT}`));

// Handle server and process errors
server.on('error', console.error);
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
