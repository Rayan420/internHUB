const prisma  = require('../prisma');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken =  (req, res) => {

    // GET REFRESH TOKEN from cookies
    const cookies = req.cookies;
    // validate refresh token exist in cookies
    if(!cookies?.jwt){
        // return error
        return res.sendStatus(401);
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    // CHECK IF refresh token matches DB
    const foundUser =  prisma.users.findUnique({
        where: {refresh_token: refreshToken},
      });
    if(!foundUser){
        // return error
        return res.sendStatus(403);
    }
 
    // verify refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if(err || foundUser.email !== decoded.email){
                    return res.sendStatus(403);
                }
                // create new JWT token
                const accessToken = jwt.sign(
                    {email: decoded.email},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10m' }
                    );
                res.json({accessToken});
            }
        );
}

module.exports = { handleRefreshToken};