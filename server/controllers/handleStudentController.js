const prisma  = require('../prisma');
const bcrypt = require('bcrypt');


const handleNewStudent = async (req, res) => {
    const { email, password, firstName, lastName, department, phoneNumber, studentNumber} = req.body;
    console.log(req.body);
    if(!email || !password || !firstName || !lastName || !department || !studentNumber) {
        return res.status(400).json({ message: 'Please fill in all required fields.', });
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

      // check if student with the student number already exists

      const duplicateStudent = await prisma.Student.findFirst({
        where: {
            studentNumber: studentNumber,
        },
    });
    if (duplicateStudent) {
        return res.status(409).json({ message: 'Student with the provided student number already exists.' });
    }
    


       // Retrieve department ID using department name
    const departmentID = await prisma.Department.findUnique({
        where: {
          name: department,
        },
      });

      // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    try{
        //create student student 
    const user = await prisma.User.create({
        data: {
            email: email,
            password: hashedPwd,
            firstName: firstName,
            lastName: lastName,
            role: 'Student',
            phoneNum: phoneNumber,
            student: {
                create: {
                    department: {
                        connect: { id: departmentID.id },
                    },
                    studentNumber: studentNumber,
                },
            },
        },
        include: {
            student: true,
            chats: true,
            messages: true,
        },
    });
    
    return res.status(201).json({ message: `New Student has been created!`, data: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong.' });
    }

}

const getStudentInfo = async (req, res) => {
    try {
      const { email } = req.params;
  
      const userData = await prisma.user.findUnique({
        where: { email: email },
        include: {
          student: {
            include: {
              department: true
            }
          }
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
  
      const student = {
        id: userData.student.id,
        studentNumber: userData.student.studentNumber,
        department: {
          id: userData.student.department.id,
          name: userData.student.department.name,
        },
      };
  
      const coordinatorID = await prisma.Department.findUnique({
        where:{
            id: userData.student.department.id,
        }
        });

        const coordinatorInfo = await prisma.Coordinator.findUnique({
            where:{
                id: coordinatorID.coordinatorId,
            }
            });

        const coordinatorUser = await prisma.User.findUnique({
                where:{
                    id: coordinatorInfo.userId,
                },
                });
        const coordinator = {
            firstName: coordinatorUser.firstName,
            lastName: coordinatorUser.lastName,
            email: coordinatorUser.email,
            role: coordinatorUser.role,
            id: coordinatorID.coordinatorId,
        };


      return res.status(200).json({ user, student, coordinator });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };
  
    

module.exports = {handleNewStudent, getStudentInfo};