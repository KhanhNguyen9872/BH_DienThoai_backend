const express = require('express');
const db = require('../utils/mysql');

// Create a router to handle the GET request for all products
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM product', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      // Check if the result is an empty array
      if (results.length === 0) {
        return res.status(200).json([]);  // Return an empty array with 200 status
      }

      res.status(200).json(results);  // Send the results as a JSON response if not empty
    });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params; // Get the product ID from the URL parameter
  
    db.query('SELECT * FROM product WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      // If no product is found
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' }); // 404 for not found
      }
  
      res.status(200).json(results[0]);  // Send the first product found
    });
  });
  
  
module.exports = router;