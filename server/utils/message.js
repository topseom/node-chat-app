const moment = require('moment');
const uniqid = require('uniqid');

var generateMessage = (from,text)=>{
    return {from,
            text,
            createdAt: moment().valueOf()
    }
};

var generateLocationMessage = (from,latitude,longtitude)=>{
    return {
            from,
            lat:latitude,
            lng:longtitude,
            classMap:'map'+uniqid(),
            url:`https://www.google.com/maps?q=${latitude},${longtitude}`,
            createdAt: moment().valueOf()
    }
};

module.exports = {generateMessage,generateLocationMessage};