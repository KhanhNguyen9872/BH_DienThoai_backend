const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

class CartController {
    /**
     * Get all items in cart
     */
    async getCartItems(req, res) {
        try {
            const userId = req.user.userId;
            const carts = await CartModel.getCartItems(userId);

            return res.json(carts);
        } catch (error) {
            console.error('Error getting cart items:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Add product to cart
     */
    async addToCart(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity, color } = req.body;
    
            if (!productId || !quantity || !color) {
                return res.status(400).json({ message: "Missing field required" });
            }
    
            const p = await ProductModel.getProductById(productId);
            const cartList = await CartModel.getCartItems(userId);
            
            if (!p || p.length < 1) {
                return res.status(400).json({ message: "Product not found" });
            }
    
            const colorProduct = p[0].color.find(c => c.name === color);
            if (!colorProduct) {
                return res.status(400).json({ message: "Color of product not found" });
            }
    
            if (quantity < 1) {
                return res.status(400).json({ message: "Quantity must be greater than 0" });
            }
    
            // Check if the product with the same color already exists in the cart
            const existingCartItem = cartList.find(item => item.productId == productId && item.color == color);
    
            // Calculate the total quantity if the product exists in the cart
            let totalQuantity = parseInt(quantity);
            if (existingCartItem) {
                totalQuantity += parseInt(existingCartItem.quantity);
            }

            console.log(productId);
            console.log(quantity);
            console.log(color);
            console.log(existingCartItem);
    
            // If the total quantity exceeds the available quantity for that color, return an error
            if (totalQuantity > colorProduct.quantity) {
                return res.status(400).json({ message: "Total quantity in cart is bigger than available product quantity" });
            }
    
            // If check passes, add/update the cart item
            await CartModel.addToCart(userId, productId, quantity, color);
    
            return res.status(201).json({ message: 'Product added to cart successfully' });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    /**
     * Delete product from cart
     */
    async removeFromCart(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.params;
            const { color } = req.body; // color is in the request body

            if (!productId || !color) {
                return res.status(400).json({ message: "Missing field required" })
            }

            const carts = await CartModel.getCartItems(userId);
            const find = carts.find(c => c.productId == productId && c.color == color);
            if (!find) {
                return res.status(400).json({ message: "Product and color is not in cart" })
            }

            await CartModel.removeFromCart(userId, productId, color);

            return res.json({ message: 'Product removed from cart successfully' });
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update product in cart
     */
    async updateCartItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.params;
            const { quantity, color } = req.body;
    
            // Get product details
            const p = await ProductModel.getProductById(productId);
            if (!p || p.length < 1) {
                return res.status(400).json({ message: "Product not found" });
            }
    
            // Find the specified color in the product's details
            const colorProduct = p[0].color.find(c => c.name === color);
            if (!colorProduct) {
                return res.status(400).json({ message: "Color of product not found" });
            }
    
            // Validate that the requested quantity is at least 1
            if (quantity < 1) {
                return res.status(400).json({ message: "Quantity must be greater than 0" });
            }
    
            // Check that the requested quantity does not exceed the available product quantity for that color
            if (quantity > colorProduct.quantity) {
                return res.status(400).json({ message: "Quantity is bigger than product quantity" });
            }
    
            // If all validations pass, update the cart item
            await CartModel.updateCartItem(userId, productId, quantity, color);
    
            return res.json({ message: 'Cart updated successfully' });
        } catch (error) {
            console.error('Error updating cart:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
}

module.exports = new CartController();
