//Create server intance and object used to define routes, etc.
const express = require('express');
const app = express();

//When request comes in with a JSON this will parse it so we can read it as a JS object
app.use(express.json());
//Tells Express to serve everything in public/ folder as static files
app.use(express.static('public'));

//Defines the route: When POST request comes in at /track, it will run the function. req is the incoming request, res is response we send back
app.post('/track', (req, res) => {
  //This is the request payload
    const event = req.body;
    //This is a confirmation that server received the payload. 200 is a response sent back which means success
  console.log('Event received:', JSON.stringify(event, null, 2));
  res.status(200).json({ status: 'ok', received: event });
});

//This is setting the server on port 3000. Logs a confirmation in the terminal
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});