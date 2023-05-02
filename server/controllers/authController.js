const connection = require('../Database/db');

const userDb = 
{
    users: require('../model/users.json'),
    setUsers: function(data){
        this.users = data;
    },
}

const bycrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    // GET USER INPUTS
    const {email, password} = req.body;
    // VALIDATE INPUTS
    if(!email || !password){
        // return error
        return res.status(400).json({'message': 'email and password are required'});
        
    }
    // CHECK IF USER EXISTS
    const foundUser = userDb.users.find(user => user.email === email);
    if(!foundUser){
        // return error
        return res.status(401).json({error: 'User not found'});
    }
    // EVALUATE PASSWORD
    const isMatch = password === foundUser.password;
    if(isMatch){
        // create JWT token
        const accessToken = jwt.sign(
            {email: foundUser.email},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
            );

            // create refresh token
            const refreshToken = jwt.sign(
                {email: foundUser.email},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
                );

        // save refresh with user
        const otherUsers = userDb.users.filter(person => person.email !== foundUser.email);
        const currentUser = {...foundUser, refreshToken};
        userDb.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..', 'model', 'users.json'),
            JSON.stringify(userDb.users),
        )
         res.cookie('jwt', refreshToken, {httpOnly:true, sameSite: 'None', secure:true,
          maxAge: 24 * 60 * 60 * 1000});
         res.json({accessToken});
    }
    else{
         res.status(401).json({error: 'Invalid credentials'});
    }
    
}

module.exports = { handleLogin};