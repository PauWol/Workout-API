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
async function proccesWorkout(type,difficulty = 3,length = 5,preset = "auto") {
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
    //workouts.sort((a,b) => b.difficulty - a.difficulty);
    switch (preset) {
        case 'auto':
            result = autoWork(workouts,length,difficulty);//autoWorkout(workouts,difficulty,length,time);
            break;
    
        default:
            break;
    }
        //result = result.slice(0,length);
        //result.sort((a,b) => b.difficulty - a.difficulty);
    return result;
}

//Auto Workout Calculation-------------------------------------------------------------------------------------
function autoWork(arr,length,difficulty) {
    let high,low,max
    let st = [1,0,0]
    switch (difficulty) {
        case 1:
            max = 3
            high = 2.5
            low = 1
        break;
        case 2:
            max = 4
            high = 3
            low = 1
        break;
        case 3:
            max = 5
            high = 4
            low = 2
        break;
        case 4:
            max =6
            high = 5
            low = 3
        break;
        case 5:
            max = 8.5
            high = 6
            low = 4
        break;
        case 6:
            st[0] = 2
            max = 10
            high = 7
            low = 5
        break;
    
        default:
            return 'Invalid difficulty!Must be between 1 and 6.'
            break;
    }
    
    let sets = setsCalculation(difficulty,length);
    let sCount = 0,result = [];
    let twoNumber = length -3
    st[1] = twoNumber;
    for (const i in arr) {
        if (Object.hasOwnProperty.call(arr, i)) {
            const element = arr[i];
            if (st[0] > 0) {
                if (element.difficulty >= high && element.difficulty < max) {
                    result.push(element);
                    sCount = element.sets + sCount;
                    st[0] = st[0] - 1;
                }
            }
            if (st[2] < 2) {
                if (element.difficulty <= low) {
                    result.push(element);
                    sCount = element.sets + sCount;
                    st[2] = st[2] + 1;
                }
            }
            if (st[1] > 0) {
                if (element.difficulty > low && element.difficulty < high) {
                    result.push(element);
                    sCount = element.sets + sCount;
                    st[1] = st[1] - 1;
                }
            }
            
        }
    }
    result.sort((a,b) => b.difficulty - a.difficulty);
    if (sCount != sets) {
        if (sCount < sets) {
            let left = sets - sCount;
           while (left != 0) {
            for (let i = 0; i < result.length; i++) {
                if (left != 0) {
                    result[i].sets = result[i].sets + 1
                    left = left - 1
                }
            }
           }
        }
    }
    return result;
    
}
function setsCalculation(d,l) {
    let p = Math.round(((d/2)*l));
    let s = p * l
    /*while (p >= 5) {
        p -=1;
    };*/
    if (d <= 3) {
        while (s > 20) {
            p =p-1;
            s = p * l;
        }
    }
    if (d >= 4) {
        while (s > 20) {
            p =p-1;
            s = p * l;
        }
    }
    return s;
}
//---------------------------------------------------------------------------------------------------
/*
function autoWorkout(workouts,diffi,length,time){
    let result = [],oneHard = false;
    let s = (pCalculation(diffi,length)*length);
        for (const i in workouts) {
            if (Object.hasOwnProperty.call(workouts, i)) {
                const element = workouts[i];
                if (element.difficulty >= 7) {
                    if (!oneHard) {
                        element["sets"] = Math.round(zuw(element.difficulty,s));
                        s = s - Math.round(zuw(element.difficulty,s));
                        result.push(element);
                        oneHard = true;
                    }
                }
                else{
                    element["set"] = Math.round(zuw(element.difficulty,s));
                    s = s - Math.round(zuw(element.difficulty,s));
                    result.push(element);
                }
                }
           
        }

return result;
}
function pCalculation(d,l) {
    let p = Math.round(((d/2)*l));
    let s = p * l
    while (p >= 5) {
        p -=1;
    };
    if (d <= 3) {
        while (s > 20) {
            p =p-1;
            s = p * l;
        }
    }
    if (d >= 4) {
        while (s > 20) {
            p =p-1;
            s = p * l;
        }
    }
    return p;
}
function zuw(elmD,s){

    if (elmD >= 7) {
        return  (0.5 * s)
    }
    if (elmD < 7 && elmD > 3 ) {
        return  (0.3 * s)
    }
    if (elmD <= 3) {
        return  (0.2 * s)
    }
}*/
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
