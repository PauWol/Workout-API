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

//difficulty has a scale from 0 to 6
async function proccesWorkout(type,difficulty = 3,length = 10,time = undefined,preset = "auto") {
    let result = [],workouts;
    switch (type) {
        case 'push':
            workouts = push.exercises;
            break;
        case 'pull':
            workouts = pull.exercises;
            break;
        case 'leg':
            workouts = leg.exercises;
            break;
    }
    switch (preset) {
        case 'auto':
            result = autoWorkout(workouts,difficulty,length,time);
            break;
    
        default:
            break;
    }
        result = result.slice(0,length);
        result.sort((a,b) => b.difficulty - a.difficulty);
    
    return result;
}

function autoWorkout(workouts,difficulty,length,time){
    let result;
if (difficulty >= 4) {
    for (const i in workouts) {
        if (Object.hasOwnProperty.call(workouts, i)) {
            const element = workouts[i];
            if (element.difficulty >= 3) {
                result.push(element);
            }
            
        }
    }
}
else if (difficulty <= 3) {
    for (const i in workouts) {
        if (Object.hasOwnProperty.call(workouts, i)) {
            const element = workouts[i];
            if (element.difficulty <= 3) {
                result.push(element);
            }
            
        }
    }
}
return result
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
        const { difficulty } = req.body;
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
        let response = await proccesWorkout(type,difficulty,length,time,preset);
        res.status(200).send({
            response:response,
            id:id
        }
        )
    });

    app.listen(port,() => console.log(`Server is now listening on http://localhost:${port}`))
  }

main()
