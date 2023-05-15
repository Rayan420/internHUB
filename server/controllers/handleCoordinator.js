const prisma  = require('../prisma');
const bcrypt = require('bcrypt');


const handleNewCoordinator = async (req, res) => {
  const { email, password, firstName, lastName, department, phoneNum } = req.body;

  try {
    if(!email || !password || !firstName || !lastName || !department) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }
    // Check if coordinator with the email already exists
    const duplicate = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });

    if (duplicate) {
      return res.status(409).json({ message: 'Coordinator with the provided email already exists.' });
    }

    // Retrieve department ID using department name
    const departmentID = await prisma.Department.findUnique({
      where: {
        name: department,
      },
    });

    if (!departmentID) {
      return res.status(400).json({ message: 'Department with the provided name does not exist.' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    // Create coordinator with department ID
    const user = await prisma.User.create({
      data: {
        email: email,
        password: hashedPwd,
        firstName: firstName,
        lastName: lastName,
        role: 'Coordinator',
        phoneNum: phoneNum,
        coordinator: {
          create: {
            department: {
              connect: { id: departmentID.id },
            },
          },
        },
      },
      include: { 
        coordinator: true,
        chats: true,
        messages: true,

       },
    });

    return res.status(201).json({ message: `New coordinator with email ${email} created!`, data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

  
  const handleCoordinatorCareerCenterUpdate = async (req, res) => {
    const { userId, careerCenterId } = req.params;
  
    try {
      const user = await prisma.User.update({
        where: { id: parseInt(userId) },
        data: {
          CareerCenter: {
            connect: { id: parseInt(careerCenterId) },
          },
        },
        include: { CareerCenter: true },
      });
  
      return res.status(200).json({ success: 'Coordinator updated with career center!', data: User });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  

  module.exports = { handleNewCoordinator, handleCoordinatorCareerCenterUpdate };