const prisma = require('../prisma');
const { v4: uuidv4 } = require('uuid');
const { parseISO, format } = require('date-fns');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const config = require('../config/firebase.config');
const ejs = require('ejs');
const pdf = require("html-pdf");
const fs = require('fs');
const { join } = require('path');
const createApplication = async (req, res) => {
  initializeApp(config);
  const storage = getStorage();

  try {
    const { studentId, coordinatorId } = req.body;
    
    const transcriptFile = req.files['transcriptFile'][0];
    const applicationFile = req.files['applicationFile'][0];

    // Generate a random unique ID for the letter request
    const requestId = uuidv4();

    // Get the current date
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    // Set the file name using the original file name and current date
    const originalFileName = transcriptFile.originalname;
    const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
    const fileName = `${formattedDate}_${originalFileName}`;

    const appOriginalFileName = applicationFile.originalname;
    const appFileExtension = appOriginalFileName.substring(appOriginalFileName.lastIndexOf('.'));
    const appFileName = `${formattedDate}_${appOriginalFileName}`;

    // Create a reference to the storage location
    const storageRef = ref(storage, `transcripts/${requestId}_${fileName}`);
    const appStorageRef = ref(storage, `applications/${requestId}_${appFileName}`);

    // Upload the files to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, transcriptFile.buffer);
    const appUploadTask = uploadBytesResumable(appStorageRef, applicationFile.buffer);
    

    // Wait for the upload to complete
    await uploadTask;
    await appUploadTask;

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);
    const appDownloadURL = await getDownloadURL(appStorageRef);

    // Save the application to the database
    const application = await prisma.InternshipForm.create({
      data: {
        transcriptFileURL: downloadURL,
        applicationFileURL: appDownloadURL,
        applicationDate: currentDate,
        status: 'Pending',
        student: {
          connect: { id: parseInt(studentId) },
        },
        coordinator: {
          connect: { id: parseInt(coordinatorId) },
        },
      },
    });

    res.status(201).json({ message: 'Internship Application sent successfully', application });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};




const createLetterRequest = async (req, res) => {
  initializeApp(config);
  const storage = getStorage();

  try {
    const { studentId, coordinatorId } = req.body;
    const transcriptFile = req.file;

    // Generate a random unique ID for the letter request
    const requestId = uuidv4();

    // Get the current date
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    // Set the file name using the original file name and current date
    const originalFileName = transcriptFile.originalname;
    const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
    const fileName = `${formattedDate}_${originalFileName}`;

    // Create a reference to the storage location
    const storageRef = ref(storage, `transcripts/${requestId}_${fileName}`);

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, transcriptFile.buffer);

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    // Save the letter request to the database
    const letterRequest = await prisma.LetterRequest.create({
      data: {
        id: requestId,
        transcriptFileURL: downloadURL,
        requestDate: currentDate,
        status: 'Pending',
        student: {
          connect: { id: parseInt(studentId) }
        },
        coordinator: {
          connect: { id: parseInt(coordinatorId) }
        },
      },
    });

    res.status(201).json({ message: 'Letter request created successfully', letterRequest });
  } catch (error) {
    console.error('Error creating letter request:', error);
    res.status(500).json({ message: 'An error occurred while creating the letter request' });
  }
};

const getStudentLetterRequests = async (req, res) => {
  const { studentId } = req.params;
  try {
    const letterRequests = await prisma.LetterRequest.findMany({
      where: {
        studentId: parseInt(studentId)
      },
      include: {
        student: true,
        coordinator: true
      }
    });
    res.status(200).json({ message: 'Letter requests retrieved successfully', letterRequests: letterRequests || [] });
  } catch (error) {
    console.error('Error retrieving letter requests:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the letter requests' });
  }
};

const getStudentApplicationRequests = async (req, res) => {
  const { studentId } = req.params;
  try {
    const applicationRequests = await prisma.InternshipForm.findMany({
      where: {
        studentId: parseInt(studentId),
      },
      select: {
        id: true,
        applicationDate: true,
        status: true,
        transcriptFileURL: true,
        applicationFileURL: true,
        rejectionReason: true,
        responseDate: true,
        sgkStatus: true,
        sgkFileURL: true,
      },
    });
    res.status(200).json({
      message: 'Application requests retrieved successfully',
      applicationRequests: applicationRequests || [],
    });
  } catch (error) {
    console.error('Error retrieving application requests:', error);
    res.status(500).json({
      message: 'An error occurred while retrieving the application requests',
    });
  }
};

const getCoordinatorLetterRequests = async (req, res) => {
  const { coordinatorId } = req.params;
  console.log("coordinator id for letter:",coordinatorId);
  try {
    const letterRequests = await prisma.letterRequest.findMany({
      where: {
        coordinatorId: parseInt(coordinatorId)
      },
      include: {
        student: true,
        coordinator: true
      },
      orderBy: {
        requestDate: 'asc'
      }
    });
    console.log("letterRequests:", letterRequests); // Check the retrieved letterRequests

    res.status(200).json({ letterRequests: letterRequests || [] });
  } catch (error) {
    console.error('Error retrieving letter requests:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the letter requests' });
  }
};

const getCoordinatorApplications = async (req, res) => {
  const { coordinatorId } = req.params;
  console.log("coordinator id for application:",coordinatorId);
  try {
    const applications = await prisma.InternshipForm.findMany({
      where: {
        coordinatorId: parseInt(coordinatorId),
      },
      include: {
        student: true,
        coordinator: true,
      },
    });

    res.status(200).json({ applications: applications || [] });
    console.log("applications:", applications); // Check the retrieved applications

  } catch (error) {
    console.error('Error retrieving applications:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the applications' });
  }
};

const getCareerCenterApplications = async (req, res) => {
  const { careerCenterId } = req.params;
  console.log("careerCenterId for application:", careerCenterId);
  try {
    const applications = await prisma.internshipForm.findMany({
      where: {
        careerCenterId: parseInt(careerCenterId),
      },
      select: {
        id: true,
        applicationDate: true,
        sgkStatus: true,
        status: true,
        student: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      },
    });

    res.status(200).json({ applications: applications || [] });
    console.log("applications:", applications); // Check the retrieved applications
  } catch (error) {
    console.error('Error retrieving applications:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the applications' });
  }
};





const sendSGK = async (req, res) => {
  initializeApp(config);
  const storage = getStorage();

  try {
    const { id } = req.params;
    const sgkFile = req.file;

    // if not sg file
    if (!sgkFile) {
      return res.status(202).json({ message: 'Please upload the SGK document before sending to student' });
    }

    // Get the current date
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    // Set the file name using the original file name and current date
    const originalFileName = sgkFile.originalname;
    const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
    const fileName = `${formattedDate}_${originalFileName}`;

    // Create a reference to the storage location
    const storageRef = ref(storage, `sgk/${id}_${fileName}`);

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, sgkFile.buffer);

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    // Update the InternshipForm with the SGK download URL
    const updatedForm = await prisma.InternshipForm.update({
      where: { id: id },
      data: {
        sgkStatus: 'Sent',
        status: 'Completed',
        sgkFileURL: downloadURL,
      },
    });

    res.status(201).json({ message: 'InternshipForm updated successfully', updatedForm });
  } catch (error) {
    console.error('Error updating InternshipForm:', error);
    res.status(500).json({ message: 'An error occurred while updating the InternshipForm' });
  }
};


const respondToLetterRequest = async (req, res) => {
  // Getting the id of the letter request from the request parameters
  const { id, letterAnswer } = req.params;
  const { rejectionReason } = req?.body;
  const authHeader = req.headers['authorization'];

  try {
    // Finding the letter request in the database
    const letterReq = await prisma.letterRequest.findUnique({
      where: { id },
      include: {
        student: { include: { user: true } },
        coordinator: { include: { user: true } }
      }
    });

    // If the letter request does not exist, return an error
    if (!letterReq) {
      return res.status(404).json({ error: 'Letter request not found' });
    }

    // If the letter request has already been responded to, return an error
    if (letterReq.status !== 'Pending') {
      return res.status(400).json({ error: 'Letter request has already been responded to' });
    }

    // If the letter answer is rejected, update the letter request status to rejected
    if (letterAnswer === 'Rejected') {
      await prisma.letterRequest.update({
        where: { id },
        data: {
          status: 'Rejected',
          rejectionReason: rejectionReason,
          approvalDate: new Date()
        }
      });
      console.log('Letter request action performed successfully');
      console.log('Letter request rejected successfully');
      console.log(rejectionReason);

      // Create a notification for the coordinator
      await prisma.notification.create({
        data: {
          message: `Your letter request has been rejected. Reason: ${rejectionReason}`,
          user: { connect: { id: letterReq.coordinator.userId } }
        }
      });

      return res.status(200).json({ message: `Letter req ${letterAnswer}` });
    } else if (letterAnswer === 'Approved') {
      // Initialize Firebase app and storage
      initializeApp(config);
      const storage = getStorage();

      // Get the current date and format it as dd/mm/yyyy
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB');

      // Get student and coordinator names
      const { student, coordinator } = letterReq;
      const studentFullName = `${student.user.firstName} ${student.user.lastName}`;
      const coordinatorFullName = `${coordinator.user.firstName} ${coordinator.user.lastName}`;

      // Get coordinator signature
      const serverBaseUrl = 'http://localhost:3500';
      const signatureResponse = await fetch(serverBaseUrl + '/coordinator/signature/' + coordinator.id, {
        method: 'GET',
        headers: {
          authorization: authHeader,
          // Add any required headers for authentication or authorization
        },
        // Add any required query parameters or request body
      });

      if (!signatureResponse.ok) {
        // Handle error response from the signature endpoint
        const errorMessage = 'Error fetching signature';
        console.error(errorMessage);
        return res.status(500).json({ error: errorMessage });
      }

      const signature = await signatureResponse.json();
      const data = {
        studentName: studentFullName,
        coordinatorName: coordinatorFullName,
        coordinatorSignatureUrl: signature.signatureURL,
        date: formattedDate,
      };

      // Read the EJS template file
      const letterTemplatePath = join(__dirname, '../letter.ejs');
      const template = fs.readFileSync(letterTemplatePath, 'UTF-8');

      // Render the EJS template with data
      const renderedContent = ejs.render(template, data);

      // Generate PDF from HTML using html-pdf
      const options = { format: 'Letter' };
      pdf.create(renderedContent, options).toBuffer(async (err, pdfBuffer) => {
        if (err) {
          console.error('Error generating PDF:', err);
          return res.status(500).json({ error: 'Error generating PDF' });
        }

        // Create a reference to the letter file in Firebase Storage
        const fileName = `letter_${id}.pdf`;
        const storageRef = ref(storage, `letters/${fileName}`);

        // Upload the letter content as a PDF file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, pdfBuffer, { contentType: 'application/pdf' });
        await uploadTask;

        // Get the download URL of the uploaded letter file
        const downloadURL = await getDownloadURL(storageRef);

        // Update the letter request with the download URL and approval status
        await prisma.letterRequest.update({
          where: { id },
          data: {
            Letter: downloadURL,
            status: 'Approved',
            approvalDate: new Date(),
          }
        });

        // Create a notification for the coordinator
        await prisma.notification.create({
          data: {
            message: 'Your letter request has been approved. You can download the letter from the provided link.',
            user: { connect: { id: letterReq.coordinator.userId } }
          }
        });

        // Send the download URL as the response
        res.status(200).json({ message: `Letter req ${letterAnswer}`, downloadURL });
        console.log('Letter request action performed successfully');
      });
    }
  } catch (error) {
    console.error('Error responding to letter request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const respondToApplication = async (req, res) => {
   // Getting the id of the letter request from the request parameters
   const { id, applicationAnswer } = req.params;
   const { rejectionReason } = req?.body;

    try {

      // find ther application in the database
      const application = await prisma.InternshipForm.findUnique({
        where: { id },
        include: {
          student: { include: { user: true } },
          coordinator: { include: { user: true } },
        },
      });
      // check if the application exist
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      // check if the application has already been responded to
      if (application.status !== 'Pending') {
        return res.status(400).json({ error: 'Application has already been responded to' });
      }
      // If the application answer is rejected, update the application status to rejected
      if (applicationAnswer === 'Rejected') {
          await prisma.InternshipForm.update({
            where: { id },
            data: {
              status: 'Rejected',
              rejectionReason: rejectionReason,
              responseDate: new Date(),
            },
          });
          console.log('Application rejection action performed successfully');
          console.log('Application rejected successfully');
          console.log(rejectionReason);

          // Create a notification for the student
          await prisma.notification.create({
            data: {
              message: `Your application has been rejected. Reason: ${rejectionReason}`,
              user: { connect: { id: application.student.userId } },
            },
          });

          return res.status(200).json({ message: `Application ${applicationAnswer}` });
        } else if (applicationAnswer === 'Approved') {
            // get coordinator id
            const { coordinator } = application;
            const coordinatorId = coordinator.id;
            // get the career center id from the coordinator
            const careerCenter = await prisma.Coordinator.findUnique({
              where: {
                id: coordinatorId,
              },
              select: {
                careerCenterId: true,
              },
            });
            const careerCenterId = careerCenter.careerCenterId;
            console.log('career center id:', careerCenterId);
            //check if the career center exist
            if (!careerCenterId) {
              return res.status(202).json({ message: 'Career center not found, Inform admin to update you information' });
            }
              // send the application to career center by adding the career center id to the application
            await prisma.InternshipForm.update({
              where: { id },
              data: {
                status: 'In Progress',
                responseDate: new Date(),
                careerCenterId: careerCenterId,
              },
            });
            console.log('Application approval action performed successfully');
            console.log('Application approved successfully');
            // Create a notification for the student
            await prisma.notification.create({
              data: {
                message: `Your application has been approved. You can check the status of your application in the "My Applications" page.`,
                user: { connect: { id: application.student.userId } },
              },
            });
            return res.status(200).json({ message: `Application ${applicationAnswer}` });
          }
    }
    catch (error) {
      console.error('Error responding to application request:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}


const getApplicationCount = async (req, res) => {

  try {
    const applicationCount = await prisma.InternshipForm.count();
    res.status(200).json({ applicationCount: applicationCount || [] });
  } catch (error) {
    console.error('Error retrieving application count:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the application count' });
  }

};

module.exports = {
  createLetterRequest,
  getStudentLetterRequests,
  createApplication,
  getStudentApplicationRequests,
  getCoordinatorLetterRequests,
  respondToLetterRequest,
  getCoordinatorApplications,
  getApplicationCount,
  respondToApplication,
  getCareerCenterApplications,
  sendSGK,
};
