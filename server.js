//Create server instance and object used to define routes, etc.
const express = require('express');
const app = express();

let events = [];

//When request comes in with a JSON this will parse it so we can read it as a JS object
app.use(express.json());
//Tells Express to serve everything in public/ folder as static files
app.use(express.static('docs'));

/* Meant to address CORS
Allows server to accept requests from any origin
Allows HTTP methods listed
Allows the Content-type our fetch is sending
Passes the request to the actual route handler. Without it, the middleware would not execute and request would stop */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

//Defines the route: When POST request comes in at /track, it will run the function. req is the incoming request, res is response we send back
app.post('/track', (req, res) => {
  //This is the request payload
    const event = req.body;
    events.push(event);
    //This is a confirmation that server received the payload. 200 is a response sent back which means success
  console.log('Event received:', JSON.stringify(event, null, 2));
  res.status(200).json({ status: 'ok', received: event });
});

//Defines route for sending the stored events
app.get('/events', (req, res) => {
  res.json(events);
})

//This is setting the server on port 3000. Logs a confirmation in the terminal
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on http://localhost:3000');
});