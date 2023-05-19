const prisma = require('../prisma');
const { v4: uuidv4 } = require('uuid');
const { parseISO, format } = require('date-fns');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const config = require('../config/firebase.config');


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
        requestDate: parseISO(formattedDate),
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
  try {
    const letterRequests = await prisma.letterRequest.findMany({
      where: {
        coordinatorId: coordinatorId
      },
      include: {
        student: true,
        coordinator: true
      },
      orderBy: {
        requestDate: 'asc'
      }
    });

    res.status(200).json({ letterRequests: letterRequests || [] });
  } catch (error) {
    console.error('Error retrieving letter requests:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the letter requests' });
  }
};


      
const respondToLetterRequest = async (req, res) => {
  const { letterRequestId } = req.params;
  const { rejectionReason } = req.body;
  const { filename } = req.file; // Assuming the response file is uploaded using multer and stored on the server

  try {
    const letterRequest = await prisma.letterRequest.findUnique({
      where: { id: letterRequestId },
    });

    if (!letterRequest) {
      return res.status(404).json({ message: 'Letter request not found' });
    }

    // Update the letter request with the response information
    const updatedLetterRequest = await prisma.letterRequest.update({
      where: { id: letterRequestId },
      data: {
        approvalDate: new Date(),
        status: rejectionReason ? 'rejected' : 'approved',
        rejectionReason: rejectionReason || null,
        responseFileURL: `path/to/${filename}`, // Store the URL or file path of the response file
      },
    });

    res.status(200).json({ message: 'Letter request responded successfully', letterRequest: updatedLetterRequest });
  } catch (error) {
    console.error('Error responding to letter request:', error);
    res.status(500).json({ message: 'An error occurred while responding to the letter request' });
  }
};


module.exports = {
  createLetterRequest,
  getStudentLetterRequests,
  createApplication,
  getStudentApplicationRequests,
  getCoordinatorLetterRequests,
  respondToLetterRequest
};
