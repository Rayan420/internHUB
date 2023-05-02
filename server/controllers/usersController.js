const connection = require('../Database/db.js');

const getAllUsers = (req, res) => {
  // make sure connection is defined before using it
  if (connection) {
    connection.query('SELECT * FROM users', (error, results, fields) => {
      if (error) throw error;
      console.log(results);
      // return userlist as json 
      res.send(results);
    });
  } else {
    // handle the case where connection is undefined
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  getAllUsers,
}
