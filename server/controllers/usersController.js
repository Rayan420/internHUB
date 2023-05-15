const prisma = require('../prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.User.findMany();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const getUserByEmail = async (req, res) => {
  if (!req?.params?.email) return res.status(400).json({ "message": 'User email required' });
  const user = await prisma.User.findUnique({
    where: {
      email: req.params.email
    }
  });
  if (!user) {
    return res.status(204).json({ 'message': `User email ${req.params.email} not found` });
  }
  delete user.password; // Exclude the password field
  delete user.role; // Exclude the role field
  delete user.refresh_token; // Exclude the refreshToken field
  res.json(user);  
};





module.exports = {
  getAllUsers,
  getUserByEmail,
};