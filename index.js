const express = require('express');
const app = express();
var cors = require('cors');

require('dotenv').config();
const port = process.env['port'];
const requestId = process.env['requestId'];

const push = require('./workouts/push.json');
//const pull = require('./workouts/pull.json');
//const leg = require('./workouts/leg.json');

app.use( cors() );
app.use( express.json() );

async function proccesWorkout(type,length = 10,time = undefined,preset = "auto") {
    let result = [];
    switch (type) {
        case 'push':
           if (preset === "auto") {
             for (const i in push.exercises) {
                 if (Object.hasOwnProperty.call(push.exercises, i)) {
                     const element = push.exercises[i];
                     result.push(element);
                 }
             }
             result.slice(0,length);
             result.sort((a,b) => b.difficulty - a.difficulty);
           }
            break;
        case 'pull':
  
            break;
        case 'leg':
        
            break;
        default:
            break;
    }
    return result;
}

async function main () {
         //post request
    app.post('/api/:id', async (req, res) => {
        const { id } = req.params;
        //const { body } = req.body;
        const { type } = req.body;
        const { length } = req.body;
        const { time } = req.body;
        const { preset } = req.body;
        if (id != requestId) {
            res.status(418).send({
                message:'Wrong Id'
            }
            )
        }
        if (!type) {
            res.status(418).send({
                message:'Missing Body'
            }
            )
        }
        let response = await proccesWorkout(type,length,time,preset);
        res.status(200).send({
            response:response,
            id:id
        }
        )
    });

    app.listen(port,() => console.log(`Server is now listening on http://localhost:${port}`))
  }

main()