const { parse } = require('date-fns');
const prisma  = require('../prisma');
const bcrypt = require('bcrypt');


const handleNewCoordinator = async (req, res) => {
  const { email, password, firstName, lastName, department, phoneNum, careerCenterId } = req.body;

  try {
    if (!email || !password || !firstName || !lastName || !department) {
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

    let coordinatorData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: 'Coordinator',
      phoneNum: phoneNum,
      coordinator: {
        create: {
          department: {
            connect: { name: department },
          },
        },
      },
    };

    if (careerCenterId) {
      // Retrieve career center using the provided ID
      const careerCenter = await prisma.CareerCenter.findUnique({
        where: {
          userId: parseInt(careerCenterId),
        },
      });

      if (careerCenter) {
        coordinatorData.coordinator.create.careerCenter = {
          connect: { id: careerCenter.id },
        };
      }
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    // Create coordinator with department and career center relationships
    const user = await prisma.User.create({
      data: {
        ...coordinatorData,
        password: hashedPwd,
      },
      include: {
        coordinator: true,
        chats: true,
        messagesSent: true,
        messagesReceived: true,
      },
    });

    return res.status(201).json({ message: `New coordinator with email ${email} created!`, data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const getCoordinatorInfo = async (req, res) => {
  try {
    const { email } = req.params;

    const userData = await prisma.user.findUnique({
      where: { email: email },
      include: {
        coordinator: true
      },
    });

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNum: userData.phoneNum,
      role: userData.role,
    };

    const coordinator = {
      id: userData.coordinator.id,
      // Include other coordinator fields you want to retrieve
    };

    return res.status(200).json({ user, coordinator });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};


  


  module.exports = { handleNewCoordinator,getCoordinatorInfo };