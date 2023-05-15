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

module.exports = {handleNewStudent};