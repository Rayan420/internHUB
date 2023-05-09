const prisma  = require('../prisma');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    // GET USER INPUTS
    const {email, password} = req.body;
    // VALIDATE INPUTS
    if(!email || !password){
        // return error
        return res.status(400).json({'message': 'email and password are required'});
        
    }
    // CHECK IF USER EXISTS
    const User =  await prisma.User.findUnique({
        where: {email: email},
      });
    const foundUser = User;
    if(!foundUser){
        // return error
        return res.status(401).json({error: 'User not found'});
    }
    //console.log(foundUser.password, password);
    // decrypt and compare password
    const isMatch = await bycrypt.compare(password, foundUser.password);
    if(isMatch){
        // create JWT token
        const accessToken = jwt.sign(
            {email: foundUser.email, 
                role: foundUser.role, 
                id: foundUser.id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
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
        await prisma.User.update({
            where: { email: email },
            data: { refresh_token: refreshToken }
          });
        
          // send  tokesn as response with user info
        // send tokens as response with user info
        const expireIn = 40; // set the expiration time in minutes
        res.json({
            accessToken,
            expireIn,
            refreshToken,
            role: foundUser.role,
            email: foundUser.email,
            id: foundUser.user_id,
            refreshTokenExpireIn: expireIn * 60 // send the expiration time in seconds
        });         
        foundUser.refresh_token=refreshToken;
         console.log("access token from server side: ",accessToken);
         console.log("refreh token from server side: ",refreshToken);

         
    }
    else{
         res.status(401).json({error: 'Invalid credentials'});
    }
    
}

module.exports = { handleLogin};
