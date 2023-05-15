const prisma  = require('../prisma');
const bcrypt = require('bcrypt');


const handleNewUser = async (req, res) => {
    console.log(req.body);
    const { email, password, firstName, lastName, phoneNum, role } = req.body;
    console.log(email, password, firstName, lastName, phoneNum, role);
    if (!email || !password || !firstName || !lastName || !role) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate email in the db
    const duplicate = await prisma.User.findUnique({
        where: {
            email: email
        }
    });
    console.log("finished query for dulicate email");
    if (duplicate) return res.sendStatus(409); //Conflict 
    console.log("no duplicate email found");
    try {
        console.log("in try block");
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        console.log("hashed password");
        //create and store the new user
        console.log("creating new user");
        const result = await prisma.User.create({
            data: {
                email: email,
                password: hashedPwd,
                firstName: firstName,
                lastName: lastName,
                phoneNum: phoneNum,
                role: role
            }
        });

        console.log(result);
        res.status(201).json({ 'success': `New user with email ${email} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };
