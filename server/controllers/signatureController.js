require('dotenv').config();
const crypto = require('crypto');
const { createCanvas, loadImage } = require('canvas');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const config = require('../config/firebase.config');
const prisma = require('../prisma');



const saveSignature = async (req, res) => {
  try {
    // Initialize Firebase Storage and other variables
    initializeApp(config);
    const storage = getStorage();

    // Get the encryption key from the .env file
    const encryptionKey = process.env.ENCRYPTION_KEY;

    // Get the coordinator id from the request body
    const { coordinatorId } = req.body;

    // Retrieve the coordinator from the database
    const coordinator = await prisma.coordinator.findUnique({
      where: {
        id: parseInt(coordinatorId),
      },
      include: {
        user: true,
      },
    });

    if (!coordinator) {
      return res.status(404).json({ error: 'Coordinator not found' });
    }

    // Get the first name and last name of the coordinator from the user table
    const { firstName, lastName } = coordinator.user;

    // Get the image data from the request body
    const { signature } = req.body;

    // Retrieve the existing signature for the user from the database
    const existingSignature = await prisma.Signature.findUnique({
      where: {
        coordinatorId: parseInt(coordinatorId),
      },
    });

    // If a signature already exists, delete the corresponding image file from Firebase Storage
    if (existingSignature && existingSignature.imageURL) {
      const decryptedURL = decryptURL(existingSignature.imageURL, encryptionKey);
      const existingImageRef = ref(storage, decryptedURL);
      await deleteObject(existingImageRef);
    }

    // Load the signature image
    const image = await loadImage(signature);

    // Get the signature's bounding box
    const { left, top, right, bottom } = getSignatureBoundingBox(image);

    // Calculate the signature width and height
    const signatureWidth = right - left;
    const signatureHeight = bottom - top;

    // Create a new canvas with the signature dimensions
    const canvas = createCanvas(signatureWidth, signatureHeight);
    const ctx = canvas.getContext('2d');

    // Draw the trimmed signature image on the canvas
    ctx.drawImage(image, left, top, signatureWidth, signatureHeight, 0, 0, signatureWidth, signatureHeight);

    // Convert the canvas to a PNG buffer
    const buffer = canvas.toBuffer('image/png');

    // Generate the file name
    const fileName = `${firstName}-${lastName}-signature.png`;

    // Upload the PNG image to Firebase Storage with the generated file name
    const storageRef = ref(storage, `signatures/${fileName}`);
    const uploadTask = uploadBytes(storageRef, buffer, {
      contentType: 'image/png',
    });
    await uploadTask;

    // Get the download URL of the uploaded PNG image
    const downloadURL = await getDownloadURL(storageRef);

    // Encrypt the download URL using the encryption key
    const encryptedURL = encryptURL(downloadURL, encryptionKey);

    // Update the existing or create a new signature object with the encrypted URL and createdAt field
    const updatedSignature = await prisma.Signature.upsert({
      where: {
        coordinatorId: parseInt(coordinatorId),
      },
      create: {
        imageURL: encryptedURL,
        createdAt: new Date(),
        coordinator: {
          connect: { id: parseInt(coordinatorId) },
        },
      },
      update: {
        imageURL: encryptedURL,
        createdAt: new Date(),
      },
    });
    console.log('Signature saved successfully');
    return res.json(updatedSignature);
  } catch (error) {
    console.error('Error saving signature:', error);
    return res.status(500).json({ error: 'Failed to save signature' });
  }
};

// Function to encrypt the URL using the encryption key
function encryptURL(url, encryptionKey) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(encryptionKey).digest('base64').substr(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(url), cipher.final()]);
  const encryptedURL = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  return encryptedURL;
}

// Function to decrypt the URL using the encryption key
function decryptURL(encryptedURL, encryptionKey) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(encryptionKey).digest('base64').substr(0, 32);
  const [ivHex, encryptedHex] = encryptedURL.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  const decryptedURL = decrypted.toString();
  return decryptedURL;
}

// Function to calculate the signature bounding box based on the alpha channel values
function getSignatureBoundingBox(image) {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;
  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 0) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }

  return { left, top, right: right + 1, bottom: bottom + 1 };
}

const getSignature = async (req, res) => {
    try {
      initializeApp(config);
      const storage = getStorage();
  
      // Get the coordinator id from the request parameters
      const coordinatorId = parseInt(req.params.id);
  
      // Retrieve the signature URL from the database
      const signature = await prisma.Signature.findUnique({
        where: {
          coordinatorId,
        },
      });
  
      if (!signature || !signature.imageURL) {
        return res.status(404).json({ error: 'Signature not found' });
      }
  
      const encryptionKey = process.env.ENCRYPTION_KEY;
      // Decrypt the signature URL
      const decryptedURL = decryptURL(signature.imageURL, encryptionKey);
  
      // Create a reference to the signature image in Firebase Storage
      const storageRef = ref(storage, decryptedURL);
  
      // Get the download URL of the signature image
      const downloadURL = await getDownloadURL(storageRef);
  
      // Fetch the signature file using the download URL
      const response = await fetch(downloadURL);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      // Convert the buffer to a Base64 URL
      const base64Image = buffer.toString('base64');
      const base64URL = `data:image/png;base64,${base64Image}`;
  
      // Send the base64 URL as the response
      res.json({ signatureURL: base64URL });
    } catch (error) {
      console.error('Error retrieving signature:', error);
      return res.status(500).json({ error: 'Failed to retrieve signature' });
    }
  };
  
  
  

  

module.exports = { saveSignature, getSignature, encryptURL, decryptURL };
