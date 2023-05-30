const { id } = require('date-fns/locale');
const prisma = require('../prisma');
const bycrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.User.findMany({
      where: {
        role: {
          not: 'Admin'
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNum: true,
        role: true,
        isDeleted: true,
        student: {
          select: {
            department: true,
            studentNumber: true,
            department: {
              select: {
                name: true
              }
            }
          }
        },
        coordinator: {
          select: {
            department: true,
            department: {
              select: {
                name: true
              }
            },
            careerCenter: {
              select: {
                companyName: true,
                id: true,
              }
            }
          }
        },
        careerCenter: {
          select: {
            companyName: true,
            id: true,
          }
        }
      }
    });

    // remove the admin user from the list
    
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
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
    return res.status(204).json({ message: `User email ${req.params.email} not found` });
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



const getNumberOfUsers = async (req, res) => {
  try {
    console.log('Getting number of users...');
    const coordinatorsCount = await prisma.Coordinator.count();
    const studentsCount = await prisma.Student.count();
    const careerCentersCount = await prisma.CareerCenter.count();
    const internshipFormsCount = await prisma.internshipForm.count();

    console.log(
      'Coordinators Count:', coordinatorsCount,
      'Students Count:', studentsCount,
      'Career Centers Count:', careerCentersCount,
      'Internship Forms Count:', internshipFormsCount
    );

    res.json({
      coordinatorsCount,
      studentsCount,
      careerCentersCount,
      internshipFormsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const saveChanges = async (req, res) => {
  const selectedUser = req.body;
  console.log('Selected User:', selectedUser);

  try {
    let updatedUser;

    if (selectedUser.role === 'Coordinator') {
      // Update coordinator's email and name
      updatedUser = await prisma.user.update({
        where: { id: selectedUser.id },
        data: {
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
        },
      });

      const { department, careerCenter } = selectedUser.coordinator;

      // Check if the coordinator exists in the database
      const existingCoordinator = await prisma.coordinator.findUnique({
        where: { userId: selectedUser.id },
      });

      if (existingCoordinator) {
        // Check if the department exists in the database
        const existingDepartment = await prisma.department.findUnique({
          where: { name: department.name },
        });

        if (existingDepartment) {
          updatedUser = await prisma.coordinator.update({
            where: { id: existingCoordinator.id },
            data: {
              department: { connect: { id: existingDepartment.id } },
              careerCenter: { connect: { id: careerCenter.id } },
            },
          });
        } else {
          // Handle the case where the department doesn't exist
          return res.status(202).json({ message: 'Department not found' });
        }
      } else {
        // Handle the case where the coordinator doesn't exist
        return res.status(202).json({ ermessageor: 'Coordinator not found' });
      }
    } else if (selectedUser.role === 'Student') {
      // Check if the email already exists for another user
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: selectedUser.email,
          NOT: {
            id: selectedUser.id,
          },
        },
      });

      if (existingEmail) {
        return res.status(202).json({ message: 'Email already exists' });
      }

      // Update student's email and name
      updatedUser = await prisma.user.update({
        where: { id: selectedUser.id },
        data: {
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
        },
      });

      const { department, studentNumber } = selectedUser.student;

      // Check if the student exists in the database
      const existingStudent = await prisma.student.findUnique({
        where: { userId: selectedUser.id },
      });

      if (existingStudent) {
        const existingDepartment = await prisma.department.findUnique({
          where: { name: department.name },
        });

        if (existingDepartment) {
          // Check if the department has a coordinator
          const departmentCoordinator = await prisma.coordinator.findFirst({
            where: { department: { id: existingDepartment.id } },
          });

          if (departmentCoordinator) {
            updatedUser = await prisma.student.update({
              where: { id: existingStudent.id },
              data: {
                department: { connect: { id: existingDepartment.id } },
                studentNumber: { set: studentNumber },
              },
            });
          } else {
            // Handle the case where the department has no coordinator
            return res.status(202).json({ message: 'The department has no coordinator' });
          }
        } else {
          // Handle the case where the department doesn't exist
          return res.status(202).json({ message: 'Department not found' });
        }
      } else {
        // Handle the case where the student doesn't exist
        return res.status(202).json({ message: 'Student not found' });
      }
    } else if (selectedUser.role === 'Careercenter') {
      // Check if the email already exists for another user
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: selectedUser.email,
          NOT: {
            id: selectedUser.id,
          },
        },
      });

      if (existingEmail) {
        return res.status(202).json({ message: 'Email already exists' });
      }

      // Update career center's email and name
      updatedUser = await prisma.user.update({
        where: { id: selectedUser.id },
        data: {
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
        },
      });

      const { companyName } = selectedUser.careerCenter;

      // Check if the career center exists in the database
      const existingCareerCenter = await prisma.careerCenter.findUnique({
        where: { userId: selectedUser.id },
      });

      if (existingCareerCenter) {
        updatedUser = await prisma.careerCenter.update({
          where: { id: existingCareerCenter.id },
          data: {
            companyName: { set: companyName },
            // Add other fields specific to Career Center
          },
        });
      } else {
        // Handle the case where the career center doesn't exist
        return res.status(202).json({ message: 'Career Center not found' });
      }
    } else {
      return res.status(202).json({ message: 'Invalid user role' });
    }

    return res.status(200).json({ message: 'Changes saved successfully', user: updatedUser });
  } catch (error) {
    console.error('Error saving changes:', error);
    return res.status(500).json({ error: 'An error occurred while saving changes' });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(202).json({ message: 'User not found' });
    }
    // if user exist make isdeleted true
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
      },
    });
    // add delted user id to isDelted table
    const deletedUser = await prisma.IsDeletedUser.create({
      data: {
        userId: updatedUser.id,
      },
    });
    return res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'An error occurred while deleting user' });
  }
};







module.exports = {
  getAllUsers,
  getUserByEmail,
  updateUserInformation, 
  getNumberOfUsers,
  saveChanges,
  deleteUser
};





