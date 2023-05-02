
const userDb = 
{
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users = data;
    },
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout =  async (req, res) => {
    // on client, delete accessa token

    // GET Rcookies
    const cookies = req.cookies;
    // validate cookie exists and contains jwt
    if(!cookies?.jwt){return res.sendStatus(204)}; // success no cookie/jwt == logout
    const refreshToken = cookies.jwt;
    
    // CHECK IF refresh token EXISTS in DB
    const foundUser = userDb.users.find(user => user.refreshToken === refreshToken);
    if(!foundUser){
        // if no user clear cookie
        res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true});
        return res.status(204);
    }
 
    // if user exists, remove refresh token from DB
    // filter all users that dont match current user
    const filteredUsers = userDb.users.filter(user => user.refreshToken !== foundUser.refreshToken);
    // store current user in variable
    const currentUser = {...foundUser, refreshToken: ''}; 
    // add current user to filtered users wit no refresh token
    userDb.setUsers([...filteredUsers, currentUser]);
    // write to file/db

    await fsPromises.writeFile(path.join(__dirname, 
        '..', 'model','users.json'), 
        JSON.stringify(userDb.users));
    // clear cookie
    res.clearCookie('jwt', {httpOnly:true, sameSite: 'None', secure:true}); // secure : true for https later for production
    // send success
    res.sendStatus(204);

}; 
module.exports = { handleLogout};