const express = require('express');
const Image = require('../models/image.models');  // Import the image model

const router = express.Router();

// Route to save generated image
router.post('/save-image', async (req, res) => {
  const { image, prompt } = req.body;

  // Validate input
  if (!image || !prompt) {
    return res.status(400).json({ message: 'Image and prompt are required' });
  }

  try {
    // Create a new image document in the database
    const newImage = new Image({
      image,  // Assuming image is a base64 string or URL
      prompt
    });

    // Save the new image to the database
    await newImage.save(); 

    // Log a message for debugging
    console.log('Image saved:', newImage);

    // Send the response with the saved image
    res.status(200).json({
      message: 'Image saved successfully',
      image: newImage,  // Send the saved image object (including ID)
    });
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).json({ message: 'Error saving image to DB' });
  }
});

// Route to fetch all saved images
router.get('/get-images', async (req, res) => {
    try {
      const images = await Image.find();  // Find all images in the database
      res.status(200).json(images); 
       // Return the list of images
    } catch (err) {
      console.error("Error fetching images:", err);
      res.status(500).json({ message: 'Error fetching images from DB' });
    }
  });
  
module.exports = router;
