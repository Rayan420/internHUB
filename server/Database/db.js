const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'internhub'
},
);

//check if connection established
connection.connect((err) => {
    if(err){
        console.log('Error connecting to database');
        return;
    }
    console.log('Connection established');
});

module.exports = connection;