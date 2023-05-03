const prisma  = require('../prisma');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');
const { stringify } = require('querystring');

const handleLogin = async (req, res) => {
    // GET USER INPUTS
    const {email, password} = req.body;
    // VALIDATE INPUTS
    if(!email || !password){
        // return error
        return res.status(400).json({'message': 'email and password are required'});
        
    }
    // CHECK IF USER EXISTS
    const User =  await prisma.users.findUnique({
        where: {email: email},
      });
    const foundUser = User;
    if(!foundUser){
        // return error
        return res.status(401).json({error: 'User not found'});
    }
    //console.log(foundUser.password, password);
    // EVALUATE PASSWORD
    const isMatch = password === foundUser.password;
    if(isMatch){
        // create JWT token
        const accessToken = jwt.sign(
            {email: foundUser.email, 
                role: foundUser.role, 
                id: foundUser.id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
            );

            // create refresh token
            const refreshToken = jwt.sign(
                {email: foundUser.email, 
                    role: foundUser.role,
                    id: foundUser.id},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
                );

        // save refresh with user
        await prisma.users.update({
            where: { email: email },
            data: { refresh_token: refreshToken }
          });
                  // send refresh token as cookie
         res.cookie('refresToken', refreshToken, {httpOnly:true, sameSite: 'None', secure:true,
          maxAge: 24 * 60 * 60 * 1000});
          // send access token as response with user info
         res.json({accessToken, role: foundUser.role, email: foundUser.email, id: foundUser.user_id});
         foundUser.refresh_token=refreshToken;
         console.log("access token from server side: ",accessToken);
         
    }
    else{
         res.status(401).json({error: 'Invalid credentials'});
    }
    
}

module.exports = { handleLogin};
