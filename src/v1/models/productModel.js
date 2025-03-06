const db = require('../utils/mysql');

/**
 * Get all products from the database.
 */
const getAllProducts = async () => {
    const [rows] = await db.promise().query('SELECT * FROM product');
    return rows;
};

/**
 * Get a single product by its ID.
 */
const getProductById = async (id) => {
    const [rows] = await db.promise().query('SELECT * FROM product WHERE id = ?', [id]);
    return rows;
};

/**
 * Retrieve the "favorite" array from a specific product by productId.
 */
const getFavoriteArray = async (productId) => {
    const [rows] = await db.promise().query(
        'SELECT favorite FROM product WHERE id = ?',
        [productId]
    );
    return rows;
};

/**
 * Update the "favorite" array for a given productId.
 */
const updateFavoriteArray = async (productId, updatedFavorites) => {
    await db.promise().query(
        'UPDATE product SET favorite = ? WHERE id = ?',
        [JSON.stringify(updatedFavorites), productId]
    );
};

module.exports = {
    getAllProducts,
    getProductById,
    getFavoriteArray,
    updateFavoriteArray
};
