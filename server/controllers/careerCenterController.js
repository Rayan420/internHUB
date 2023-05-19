const prisma = require('../prisma');
const bcrypt = require('bcrypt');

const handleNewCareerCenter = async (req, res) => {
  const { email, password, firstName, lastName, phoneNum, companyName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName || !companyName) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Check if career center with the email or company name already exists
    const duplicateEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const duplicateCompany = await prisma.CareerCenter.findUnique({
      where: {
        companyName: companyName,
      },
    });

    if (duplicateEmail) {
      return res.status(409).json({ message: 'User with the provided email already exists.' });
    }

    if (duplicateCompany) {
      return res.status(409).json({ message: 'Career center with the provided company name already exists.' });
    }

    // Hash the password using bcrypt
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create user and career center
    const user = await prisma.User.create({
      data: {
        email: email,
        password: hashedPwd,
        firstName: firstName,
        lastName: lastName,
        role: 'Careercenter',
        phoneNum: phoneNum,
        careerCenter: {
          create: {
            companyName: companyName,
          },
        },
      },
      include: {
        careerCenter: true,
      },
    });

    return res.status(201).json({ message: `New career center with email ${email} created!`, data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewCareerCenter };
