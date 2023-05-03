const prisma = require('../prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getAllUsers,
};