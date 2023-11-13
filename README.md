# Workout-API
a Workout Api

Node.js fetch request:

const fetch = require('node-fetch');

let url = 'https://workout-api-lemon.vercel.app/api/1234';

let options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.3.0'},
  body: '{"type":"push","length":10,"time":100,"preset":"auto"}'
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));

  
