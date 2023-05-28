const { ca } = require('date-fns/locale');
const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const { parse } = require('date-fns');

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

const getCareerCenterInfo = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email);

    const userData = await prisma.user.findUnique({
      where: { email: email },
      include: {
        careerCenter: true
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

    const careerCenter = {
      id: userData.careerCenter.id,
    };

    return res.status(200).json({ user, careerCenter });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};


const createInternshipOppurtunirty = async (req, res) => {
  try {
    const formData = req.body;
    const careerCenterId = req.params;
    
    console.log(careerCenterId)
    // Perform additional validation if needed
    if (!formData.title || !formData.company || !formData.location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the internship opportunity in the database
    const createdOpportunity = await prisma.  InternshipOpportunity.create({
      data: {
        title: formData.title,
        company: formData.company,
        website: formData.website,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        requirements: formData.requirements,
        isPaid: formData.isPaid,
        amount: formData.isPaid ? parseInt(formData.amount) : null,
        applicationLink: formData.applicationLink,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        department: formData.department,
        applicationDeadline: formData.applicationDeadline,
        careerCenterId: parseInt(careerCenterId.careerCenterId),
      },
    });

    res.status(201).json({ message: "Internship opportunity created successfully" });
  } catch (error) {
    console.error("Error creating internship opportunity", error);
    res.status(500).json({ error: "An error occurred while creating the internship opportunity" });
  }

};

const getInternshipOpportunities = async (req, res) => {
  try {
    const careerCenterId = req.params;
    const internshipOpportunities = await prisma.InternshipOpportunity.findMany({
      where: {
        careerCenterId: parseInt(careerCenterId.careerCenterId),
      },
    });

    if (!internshipOpportunities) {
      return res.status(202).json({ error: "No internship opportunities found" });
    }
    res.status(200).json({ internshipOpportunities });
    console.log(internshipOpportunities);
  } catch (error) {
    console.error("Error getting internship opportunities", error);
    res.status(500).json({ error: "An error occurred while getting the internship opportunities" });
  }
};

const updateInternshipOpportunity = async (req, res) => {
  const operationType = req.params.operationType;
  const opportunityId = parseInt(req.params.opportunityId);
  const formData = req.body;
  const careerCenterId = parseInt(req.params.careerCenterId);
  console.log(operationType);
  try {
    // Retrieve the opportunity based on the opportunityId and careerCenterId
    const opportunity = await prisma.InternshipOpportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (operationType === 'Edit') {
      // Perform the update for edit operation
      const updatedData = {};

      // Check for each field in formData, if it is not null, update the field
      if (formData.title !== null) updatedData.title = formData.title;
      if (formData.company !== null) updatedData.company = formData.company;
      if (formData.website !== null) updatedData.website = formData.website;
      if (formData.location !== null) updatedData.location = formData.location;
      if (formData.startDate !== null) updatedData.startDate = new Date(formData.startDate);
      if (formData.endDate !== null) updatedData.endDate = new Date(formData.endDate);
      if (formData.description !== null) updatedData.description = formData.description;
      if (formData.requirements !== null) updatedData.requirements = formData.requirements;
      if (formData.isPaid !== null) updatedData.isPaid = formData.isPaid;
      if (formData.amount !== null) updatedData.amount = parseInt(formData.amount);
      if (formData.applicationLink !== null) updatedData.applicationLink = formData.applicationLink;
      if (formData.contactEmail !== null) updatedData.contactEmail = formData.contactEmail;
      if (formData.contactPhone !== null) updatedData.contactPhone = formData.contactPhone;
      if (formData.department !== null) updatedData.department = formData.department;
      if (formData.applicationDeadline !== null) updatedData.applicationDeadline = new Date(formData.applicationDeadline);
      updatedData.updatedAt = new Date();

      // Similarly, update other fields as needed

      await prisma.InternshipOpportunity.update({
        where: { id: opportunityId },
        data: updatedData,
      });

      res.status(200).json({ message: 'Opportunity updated successfully' });
    } else if (operationType === 'Renew') {
      // Perform the renewal update
      const updatedData = {};

      if (formData.startDate !== null) updatedData.startDate = new Date(formData.startDate);
      if (formData.endDate !== null) updatedData.endDate = new Date(formData.endDate);
      if (formData.applicationDeadline !== null) updatedData.applicationDeadline = new Date(formData.applicationDeadline);
      updatedData.updatedAt = new Date();
      
      await prisma.InternshipOpportunity.update({
        where: { id: opportunityId },
        data: updatedData,
      });

      res.status(200).json({ message: 'Opportunity renewed successfully' });
    } else {
      res.status(400).json({ message: 'Invalid update type' });
    }
  } catch (error) {
    console.log('Error updating/renewing opportunity:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

const deleteInternshipOpportunity = async (req, res) => {

  const opportunityId = parseInt(req.params.opportunityId);
  const careerCenterId = parseInt(req.params.careerCenterId);
   // get the opportunity
    const opportunity = await prisma.InternshipOpportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    // check if the career center id matches the career center id of the opportunity
    if (opportunity.careerCenterId !== careerCenterId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // delete the opportunity
    try {
      await prisma.InternshipOpportunity.delete({
        where: { id: opportunityId },
      });
      res.status(200).json({ message: 'Opportunity deleted successfully' });
    }
    catch (error) {
      console.log('Error deleting opportunity:', error);
      res.status(500).json({ message: 'An error occurred' });
    }

};
const deleteSGK = async (req, res) => {

  const requestId = req.params.requestId;
  console.log(requestId);
  const careerCenterId = parseInt(req.params.careerCenterId);
  console.log(careerCenterId);
   // get the opportunity
    const opportunity = await prisma.InternshipForm.findUnique({
      where: { id: requestId },
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    // check if the career center id matches the career center id of the opportunity
    if (opportunity.careerCenterId !== careerCenterId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // delete the opportunity
    try {
      await prisma.InternshipForm.update({
        where: { id: requestId },
        data: {
          sgkFileURL: null,
          sgkStatus: 'In Progress',
          status: 'In Progress',
        },
      });
      res.status(200).json({ message: 'Opportunity deleted successfully' });
    }
    catch (error) {
      console.log('Error deleting opportunity:', error);
      res.status(500).json({ message: 'An error occurred' });
    }

};


module.exports = 
{ 
  handleNewCareerCenter,
  getCareerCenterInfo,
  createInternshipOppurtunirty,
  getInternshipOpportunities,
  updateInternshipOpportunity,
  deleteInternshipOpportunity,
  deleteSGK
};
