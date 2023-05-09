const prisma  = require('../prisma');


const handleLogout =  async (req, res) => {
    // on client, delete accessa token

    // GET Rcookies
    const cookies = req.cookies;
    // validate cookie exists and contains jwt
    if(!cookies?.jwt){return res.sendStatus(204)}; // success no cookie/jwt == logout
    const refreshToken = cookies.jwt;
    
    // CHECK IF refresh token EXISTS in DB
    
    const foundUser = await prisma.User.findUnique({
        where: {refresh_token: refreshToken},
      });
    if(!foundUser){
        // if no user clear cookie
        res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true});
        return res.status(204);
    }
 
    // if user exists, remove refresh token from DB
    await prisma.User.update({
        where: {refresh_token: refreshToken},
        data: { refresh_token: null }
        });
    // clear cookie
    res.clearCookie('jwt', {httpOnly:true, sameSite: 'None', secure:true}); // secure : true for https later for production
    // send success
    res.sendStatus(204);

}; 
module.exports = { handleLogout};