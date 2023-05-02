const {format} = require('date-fns');
const {v4: uuid} = require('uuid');

const fs = require('fs');
const fspromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTimer = `${format(new Date(), 'yyyy-MM-dd\thh:mm:ss')}`;
    const logItem = `${dateTimer}\t${uuid()}\t${message} \n`;

    try
    {
        if(!fs.existsSync(path.join(__dirname,'..', 'logs'))){
            await fspromises.mkdir(path.join(__dirname, '..','logs'));
        }
        await fspromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem);
    }
    catch(error){
        console.log(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requestsLog.txt');
    next();
}

module.exports = {logEvents, logger};