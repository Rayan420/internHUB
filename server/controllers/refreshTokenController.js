const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
require('dotenv').config();

const handleRefreshToken = (req, res) => {
  console.log("refresh token request received");
  const refreshToken = req.body.refreshToken;

  try {
    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        console.error(err);
        return res.sendStatus(403);
      }

      const { email, role } = decoded;

      // Check if the user exists in the database
      const foundUser = await prisma.User.findUnique({
        where: { email },
      });
      
      if (!foundUser) {
        console.error(`User not found for email: ${email}`);
        return res.sendStatus(403);
      }

      // Check if the user's role matches the decoded role
      if (foundUser.role !== role) {
        console.error(`User role ${foundUser.role} does not match decoded role ${role}`);
        return res.sendStatus(403);
      }

      // Generate new access token
      const accessToken = jwt.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

      console.log("New access token created:", accessToken);

      // Return the new access token
      return res.json({ newAuthToken: accessToken });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

module.exports = { handleRefreshToken };
