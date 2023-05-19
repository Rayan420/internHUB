const prisma = require('../prisma');

const getInternshipsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const internships = await prisma.InternshipOpportunity.findMany({
      where: {
        department: department,
      },
    });
    res.json(internships);
  } catch (error) {
    console.error("Error fetching internships:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const createInternshipOpportunity = async (req, res) => {
    try {
      const {
        title,
        company,
        website,
        location,
        startDate,
        endDate,
        description,
        requirements,
        isPaid,
        amount,
        applicationLink,
        contactEmail,
        contactPhone,
        department,
      } = req.body;
  
      const currentDate = new Date(); // Get the current date
          const formattedDate = format(currentDate, 'yyyy-MM-dd');

  
      const internship = await prisma.InternshipOpportunity.create({
        data: {
          title,
          company,
          website,
          location,
          startDate,
          endDate,
          description,
          requirements,
          isPaid,
          amount,
          applicationLink,
          contactEmail,
          contactPhone,
          department,
          createdAt: currentDate, // Set createdAt to the current date
        },
      });
  
      res.json(internship);
    } catch (error) {
      console.error('Error creating internship opportunity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  const updateInternshipOpportunity = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        company,
        website,
        location,
        startDate,
        endDate,
        description,
        requirements,
        isPaid,
        amount,
        applicationLink,
        contactEmail,
        contactPhone,
        department,
      } = req.body;
  
      const currentDate = new Date(); // Get the current date
  
      const updatedInternship = await prisma.InternshipOpportunity.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          company,
          website,
          location,
          startDate,
          endDate,
          description,
          requirements,
          isPaid,
          amount,
          applicationLink,
          contactEmail,
          contactPhone,
          department,
          updatedAt: currentDate, // Set updatedAt to the current date
        },
      });
  
      res.json(updatedInternship);
    } catch (error) {
      console.error('Error updating internship opportunity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
  getInternshipsByDepartment,
  createInternshipOpportunity,
  updateInternshipOpportunity,
};
