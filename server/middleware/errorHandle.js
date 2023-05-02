const logEvents = require('./logEvent');

const erroHandler = (err, req, res, next) =>{
    logEvents.logEvents(`${err.name}\t${err.message}`, 'errorLog.txt');
    console.log(err.stack);
    res.status(500).send(err.message);
}

module.exports = erroHandler;