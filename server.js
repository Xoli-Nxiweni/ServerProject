require('dotenv').config();

const http = require('http');

const server = http.createServer((req, res) => {

    res.statusCode = 200;

    res.setHeader('Content-Type', 'application/json');

    const responseMessage = {
        message : "Greetings! You've reached Xoli's server.",
    };

    res.end(JSON.stringify(responseMessage.message))
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is up and running at: http://localhost:${PORT}`);
});

