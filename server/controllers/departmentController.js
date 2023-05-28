const prisma = require('../prisma');

const hadndleNewDepartment = async (req, res) => {
    const {name, code} = req.body;
    console.log(req.body);
    if(!name || !code) {
        return res.status(400).json({ message: 'Please fill in all required fields.', });
    }
     // Check if department with the name already exists
     const duplicate = await prisma.Department.findUnique({
        where: {
          name: name,
        },
      });
      if (duplicate) {
        return res.status(409).json({ message: 'Department with the provided name already exists.' });
      }

      // check if department with code exists

      const duplicateDepartment = await prisma.Department.findFirst({
        where: {
            id: code,
        },
    });
    if (duplicateDepartment) {
        return res.status(409).json({ message: 'Department with the provided code number already exists.' });
    }

    try{
        //create department 
    const department = await prisma.Department.create({
           data
        : {
            name: name,
            id: code,
        },
    });
    
    return res.status(201).json({ message: `New Department has been created!`, data: department });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong.' });
    }

}


const hadndleDeleteDepartment = async (req, res) => {
 const {code} = req.params;
    console.log(code);
    try{
        //delete department
    const department = await prisma.Department.delete({
              where: {
                id:code,
          },
          
     });
     if (!department) {
        return res.status(400).json({ message: 'Department with the provided code does not exist.' });
    }

    return res.status(201).json({ message: `Department has been deleted!`, data: department });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong.' });
    }


}
module.exports = {hadndleNewDepartment, hadndleDeleteDepartment};