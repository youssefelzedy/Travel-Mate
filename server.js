const app = require('./app');
const http = require('http');
const PORT = process.env.PORT || 2030;
const server = http.createServer(app);


server.listen(PORT, () => console.log(`server running on port ${PORT}`))