const ws = require('ws');

const port = 1234;
const wss = new ws.WebSocketServer({ port });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        // console.log(`Received ${data} from client`);
        const jsonData = JSON.parse(data);
        const msg = jsonData.message;
        const upperMsg = msg.toUpperCase();
        ws.send(upperMsg);
    });

    ws.send("Connection established. Welcome!");
});

console.log(`Listening at port ${port}`);
