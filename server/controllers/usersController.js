const prisma = require('../prisma');
const bycrypt = require('bcrypt');

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


const updateUserInformation = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNum, password } = req.body;

  // Encrypt new password if provided
  let newPassword;
  if (password) {
    newPassword = await bcrypt.hash(password, 10);
  }

  try {
    const updatedFields = {};

    if (firstName) {
      updatedFields.firstName = firstName;
    }
    if (lastName) {
      updatedFields.lastName = lastName;
    }
    if (phoneNum) {
      updatedFields.phoneNum = phoneNum;
    }
    if (newPassword) {
      updatedFields.password = newPassword;
    }

    const user = await prisma.User.update({
      where: { id: parseInt(id) },
      data: updatedFields,
    });

    res.json({ message: "User information updated successfully", user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = {
  getAllUsers,
  getUserByEmail,
  updateUserInformation
};