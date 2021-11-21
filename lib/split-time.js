const moment = require('moment');
const splitTime = (startTime, endTime, interval) =>{
    startTime = moment(startTime);
    endTime = moment(endTime);
    const result = [startTime.toString()]; 
    let time = startTime.add(interval,'m');
    
    while(time.isBetween(startTime,endTime,undefined,[])){
        result.push(time.toString()); 
        time = time.add(interval,'m');
    }
    return result.map(slot => slot); 
}

exports.splitTime = splitTime; 
/* const moment = require('moment');
 const interval = 30;
const startTime = moment('2021-11-19 08:00:00+01:0');
const endTime = moment('2021-11-20  18:00:00+01:0');
const timeSlices = splitTime(startTime,endTime,interval);  

console.log(timeSlices);  */