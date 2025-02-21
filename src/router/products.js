const express = require('express');
const db = require('../utils/mysql');
const { verifyToken } = require('../utils/authenticate');
const { getUserId } = require('../utils/lib');

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

// POST /:id/favorite route for adding a product to the user's favorite list
router.post('/:id/favorite', verifyToken, getUserId, (req, res) => {
  const productId = req.params.id; // Get the product ID from the URL
  const userId = req.user.userId; // Get the user ID from the authenticated user
  
  // Check if the userId exists and is valid
  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  // Fetch the current favorite list from the product table
  db.query('SELECT favorite FROM product WHERE id = ?', [productId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let favorites = rows[0].favorite;

    // Check if the userId is already in the favorites list to avoid duplication
    if (favorites.includes(userId)) {
      return res.status(400).json({ error: 'Product already added to favorites' });
    }

    // Append the userId to the favorite array
    favorites.push(userId);

    // Update the product's favorite list with the new data
    db.query('UPDATE product SET favorite = ? WHERE id = ?', [JSON.stringify(favorites), productId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update favorite list' });
      }

      // Return success message
      res.status(200).json({ message: 'Product added to favorites' });
    });
  });
});

// DELETE /:id/favorite route for removing a product from the user's favorite list
router.delete('/:id/favorite', verifyToken, getUserId, (req, res) => {
  const productId = req.params.id; // Get the product ID from the URL
  const userId = req.user.userId; // Get the user ID from the authenticated user
  
  // Check if the userId exists and is valid
  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  // Fetch the current favorite list from the product table
  db.query('SELECT favorite FROM product WHERE id = ?', [productId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let favorites = rows[0].favorite;

    // If the favorites list is null or empty, return an error
    if (!favorites) {
      return res.status(400).json({ error: 'No favorites found for this product' });
    }

    // Check if the userId exists in the favorites list
    const index = favorites.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ error: 'User not in favorites' });
    }

    // Remove the userId from the favorite array
    favorites.splice(index, 1);

    // Update the product's favorite list with the new data
    db.query('UPDATE product SET favorite = ? WHERE id = ?', [JSON.stringify(favorites), productId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update favorite list' });
      }

      // Return success message
      res.status(200).json({ message: 'Product removed from favorites' });
    });
  });
});


module.exports = router;