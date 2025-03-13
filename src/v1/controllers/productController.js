const ProductModel = require('../models/productModel');

class ProductController {
    /**
     * Get all products
     */
    async getAllProducts(req, res) {
        try {
            const products = await ProductModel.getAllProducts();
            // Transform each product to replace the "favorite" array with its count.
            const updatedProducts = products.map(product => ({
                ...product,
                favorite: product.favorite.length  // using "favorites" as count
            }));
            return res.status(200).json(updatedProducts);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }    

    /**
     * Get a single product by ID
     */
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const rows = await ProductModel.getProductById(id);

            // If no product is found
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    /**
     * Add a product to user's favorite list
     */
    async addToFavorite(req, res) {
        try {
            const productId = req.params.id;
            const userId = req.user.userId; // from verifyToken + getUserId

            // Ensure the user is authenticated
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }

            // Get the current favorite array for this product
            const rows = await ProductModel.getFavoriteArray(productId);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            let favorites = rows[0].favorite;
            // If the column is NULL or otherwise empty in the DB, it might come back as null
            if (!favorites) {
                favorites = [];
            }

            // Check if the user is already in the favorite list
            if (favorites.includes(userId)) {
                return res.status(400).json({ error: 'Product already in favorites' });
            }

            // Add the userId to the favorite array
            favorites.push(userId);

            // Update the product's favorite list in the database
            await ProductModel.updateFavoriteArray(productId, favorites);

            return res.status(200).json({ message: 'Product added to favorites' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    /**
     * Remove a product from user's favorite list
     */
    async removeFromFavorite(req, res) {
        try {
            const productId = req.params.id;
            const userId = req.user.userId;

            // Ensure the user is authenticated
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }

            // Get the current favorite array for this product
            const rows = await ProductModel.getFavoriteArray(productId);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            let favorites = rows[0].favorite;
            if (!favorites) {
                return res.status(400).json({ error: 'No favorites found for this product' });
            }

            // Check if the user is in the favorites array
            const index = favorites.indexOf(userId);
            if (index === -1) {
                return res.status(400).json({ error: 'User not in favorites' });
            }

            // Remove the userId from the favorite array
            favorites.splice(index, 1);

            // Update the product's favorite list
            await ProductModel.updateFavoriteArray(productId, favorites);

            return res.status(200).json({ message: 'Product removed from favorites' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }
}

module.exports = new ProductController();
