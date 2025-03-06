const OrderModel = require('../models/orderModel');
const VoucherModel = require('../models/voucherModel');
const AddressModel = require('../models/addressModel');
const ProductModel = require('../models/productModel');
const { sendNotification } = require('../utils/lib');
const { sendTelegramMessage } = require('../utils/telebot');

class OrderController {
    /**
     * Get all orders of user
     */
    async getAllOrdersOfUser(req, res) {
        try {
            const userId = req.user.userId;
            const orders = await OrderModel.getAllOrdersOfUser(userId);

            const formattedOrders = orders.map(order => ({
                id: order.id,
                orderAt: order.orderAt,
                payment: order.payment,
                status: order.status,
                address: order.address,
                totalPrice: order.totalPrice,
                products: order.products
            }));

            return res.json({
                id: userId,
                orders: formattedOrders
            });
        } catch (error) {
            console.error('Error getting orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a specific order by ID
     */
    async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const userId = req.user.userId;
            const orders = await OrderModel.getOrderById(orderId, userId);

            if (orders.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const order = orders[0];
            const formattedOrder = {
                id: order.id,
                orderAt: order.orderAt,
                payment: order.payment,
                status: order.status,
                address: order.address,
                totalPrice: order.totalPrice,
                products: order.products
            };

            return res.json(formattedOrder);
        } catch (error) {
            console.error('Error getting order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new order
     */
    async createOrder(req, res) {
        try {
            const userId = req.user.userId;
            const { payment, address, products, voucherCode } = req.body;
    
            if (!payment || !address || !products) {
                return res.status(400).json({ message: "Missing field required" });
            }
    
            let status = 'Đang chờ xác nhận';
            if (payment === 'nganhang' || payment === 'momo') {
                status = 'Đang chờ thanh toán';
            } else if (payment === 'tienmat') {
                status = 'Đang chờ xác nhận';
            }
    
            let voucher = null;
    
            // Start transaction
            await OrderModel.beginTransaction();
    
            if (voucherCode) {
                const vouchers = await VoucherModel.getVoucherByCode(voucherCode);
                voucher = vouchers[0];

                if (!voucher) {
                    await OrderModel.rollbackTransaction();
                    return res.status(400).json({ message: 'Voucher not found' });
                }
    
                // Check if voucher has remaining uses
                if (voucher.count <= 0) {
                    // Rollback the transaction if voucher check fails
                    await OrderModel.rollbackTransaction();
                    return res.status(400).json({ message: 'Voucher has no remaining uses' });
                }
    
                // Convert user_id field to array if needed
                let usedIds = voucher.user_id;
                if (!Array.isArray(usedIds)) {
                    usedIds = [usedIds];
                }
    
                // Check if user already used the voucher
                if (usedIds.includes(userId)) {
                    // Rollback the transaction if voucher usage check fails
                    await OrderModel.rollbackTransaction();
                    return res.status(400).json({ message: 'User has already used this voucher' });
                }
    
                // Add userId, decrement count
                usedIds.push(userId);
                const updatedCount = voucher.count - 1;
    
                // Update the voucher in the database
                const data = await VoucherModel.updateVoucherCountAndUserId(voucher.id, updatedCount, usedIds);
                if (!data) {
                    // Rollback the transaction if voucher update fails
                    await OrderModel.rollbackTransaction();
                    return res.status(500).json({ message: "Cannot apply voucherCode" });
                }
            }
    
            let extractedProducts = [];
            let errors = [];
            
            let productDetailsTxt = '';
            // Use Promise.all for all product processing
            await Promise.all(products.map(async (product) => {
                try {
                    if (product.quantity < 1) {
                        errors.push({ message: `Invalid quantity for Product ID: ${product.id}. Quantity must be at least 1.` });
                        return;
                    }
    
                    const productDetail = await ProductModel.getProductById(product.id); // Fetch product details by ID
                    const productDetails = productDetail[0];

                    if (!productDetails || !productDetails.color) {
                        errors.push({ message: `Product not found for ID: ${product.id}` });
                        return;
                    }
    
                    // Find the color that matches the product's selected color
                    const selectedColor = productDetails.color.find(color => color.name === product.color);
    
                    if (!selectedColor) {
                        errors.push({ message: `Selected color not found for Product ID: ${product.id}, Color: ${product.color}` });
                        return;
                    }
    
                    // Check if the requested quantity is greater than available quantity
                    if (product.quantity > selectedColor.quantity) {
                        errors.push({ message: `Requested quantity for Product ID: ${product.id} exceeds available stock for color ${product.color}. Available: ${selectedColor.quantity}, Requested: ${product.quantity}` });
                        return;
                    }
    
                    // Calculate the total price
                    const price = parseFloat(selectedColor.money); // Convert money to a float
                    const totalPrice = price * product.quantity; // Calculate total price based on quantity

                    productDetailsTxt += `${productDetails.name} (${product.color})\n`;
                    productDetailsTxt += `Số lượng: ${product.quantity}\n`;
                    productDetailsTxt += `Giá: ${price} VNĐ -> ${totalPrice} VNĐ\n\n`;
    
                    extractedProducts.push({
                        id: product.id,
                        name: productDetails.name,
                        color: product.color,
                        quantity: product.quantity,
                        totalPrice: totalPrice, // Total price of the product
                        price: price // Individual price of the selected color
                    });
                } catch (error) {
                    errors.push({ message: `Error processing Product ID: ${product.id}`, error: error.message });
                }
            }));
    
            // If there were any errors, respond with the accumulated errors
            if (errors.length > 0) {
                // Rollback the transaction if there were any errors processing the products
                await OrderModel.rollbackTransaction();
                return res.status(400).json({ errors });
            }
    
            // Calculate the total price of all products
            let totalPrice = extractedProducts.reduce((sum, product) => sum + product.totalPrice, 0);
            
            let totalDiscount = 0;
            if (voucher) {
                totalDiscount =  (totalPrice * voucher.discount);
                totalPrice = totalPrice - totalDiscount;
            }
    
            const addressD = await AddressModel.getAddressByIdAndUser(address, userId);
            if (!Array.isArray(addressD) || addressD.length === 0) {
                // Rollback the transaction if address check fails
                await OrderModel.rollbackTransaction();
                return res.status(400).json({ message: "Incorrect address" });
            }
            const addressData = {
                name: addressD[0].full_name,
                phone: addressD[0].phone,
                address: addressD[0].address
            };

    
            // Insert into orders table
            const orderId = await OrderModel.insertOrder(userId);
    
            // Insert into order_info table
            await OrderModel.insertOrderInfo(orderId, extractedProducts, totalPrice, payment, status, addressData);
    
            // Update product quantities
            for (const product of products) {
                const colorArray = await OrderModel.getProductColor(product.id);
                if (colorArray) {
                    const updatedColorArray = colorArray.map(color => {
                        if (color.name === product.color) {
                            return {
                                ...color,
                                quantity: color.quantity - product.quantity
                            };
                        }
                        return color;
                    });
                    await OrderModel.updateProductColor(product.id, updatedColorArray);
                }
            }
    
            // Remove ordered products from the cart
            for (const product of products) {
                await OrderModel.removeFromCart(userId, product.id, product.color);
            }
    
            // Commit the transaction
            await OrderModel.commitTransaction();
    
            // Fetch buyer's information
            const orderDetails = await OrderModel.getOrderDetails(orderId);
            if (orderDetails.length === 0) {
                // Rollback the transaction if order details not found
                await OrderModel.rollbackTransaction();
                return res.status(404).json({ message: 'Order details not found' });
            }
    
            const orderInfo = orderDetails[0];
            const fullName = `${orderInfo.first_name} ${orderInfo.last_name}`;
            const orderAt = orderInfo.orderAt;
    
            // Send Telegram message / notification based on status
            if (status === 'Đang chờ xác nhận') {
                const message = `Đơn hàng mới được tạo:\n\n` +
                                `ID: ${orderId}\n` +
                                `Khách hàng: ${fullName}\n` +
                                `Trạng thái: ${status}\n` +
                                `Thanh toán: ${payment}\n` +
                                `Ngày đặt hàng: ${orderAt}\n` +
                                `Tổng giá trị: ${totalPrice} VNĐ\n` + (voucherCode ? `Mã voucher: ${voucherCode}\n` : '') + `\n` +
                                `Sản phẩm:\n${productDetailsTxt}\n`;
                sendTelegramMessage(message);
                await sendNotification(`Hãy xác nhận đơn hàng [ID: ${orderId}]`, `/orders/${orderId}`);
            }
    
            if (status === 'Đang chờ thanh toán') {
                const message = `Đơn hàng mới được tạo:\n\n` +
                                `ID: ${orderId}\n` +
                                `Khách hàng: ${fullName}\n` +
                                `Trạng thái: Đang chờ khách hàng thanh toán\n` +
                                `Thanh toán: ${payment}\n` +
                                `Ngày đặt hàng: ${orderAt}\n` +
                                `Tổng giá trị: ${totalPrice} VNĐ\n` + (voucherCode ? `Mã voucher: ${voucherCode} (Giảm: ${totalDiscount} VNĐ)\n` : '') + `\n` +
                                `Sản phẩm:\n${productDetailsTxt}\n`;
                sendTelegramMessage(message);
                await sendNotification(`Đơn hàng đang chờ thanh toán [ID: ${orderId}]`, `/orders/${orderId}`);
            }
    
            return res.status(201).json({ message: 'Order created successfully', orderId });
        } catch (error) {
            // Rollback the transaction if there's an error
            await OrderModel.rollbackTransaction();
            console.error('Error creating order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    

    /**
     * Handle "success" (payment success) of an order
     */
    async successOrder(req, res) {
        try {
            const orderId = req.params.id;
            const userId = req.user.userId;

            // Check if this order belongs to the user
            const orders = await OrderModel.getOrderForUser(orderId, userId);
            if (orders.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Fetch full order details
            const orderDetails = await OrderModel.getFullOrderDetails(orderId);
            if (orderDetails.length === 0) {
                return res.status(404).json({ message: 'Order details not found' });
            }

            const orderInfo = orderDetails[0];
            const fullName = `${orderInfo.first_name} ${orderInfo.last_name}`;
            const payment = orderInfo.payment;
            const orderAt = orderInfo.orderAt;

            const message = `Đơn hàng ID: ${orderId} đã được thanh toán và đang chờ xác nhận:\n\n` +
                            `Khách hàng: ${fullName}\n` +
                            `Trạng thái: Đang chờ xác nhận\n` +
                            `Thanh toán: ${payment}\n` +
                            `Ngày đặt hàng: ${orderAt}\n\n`;

            // Update status to "Đang chờ xác nhận"
            await OrderModel.updateOrderStatus(orderId, 'Đang chờ xác nhận');

            // Send Telegram & in-app notification
            sendTelegramMessage(message);
            await sendNotification(`Đã thanh toán, hãy xác nhận đơn hàng [ID: ${orderId}]`, `/orders/${orderId}`);

            return res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            console.error('Error updating order status:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Cancel an order
     */
    async cancelOrder(req, res) {
        try {
            const orderId = req.params.orderId;
            const userId = req.user.userId;

            const r = await OrderModel.getOrderInfo(orderId);
            if (r && r.length > 0) {
                const status = r[0].status;
                if (status == 'Đã hủy') {
                    return res.status(400).json({ message: 'The order was previously canceled.' });
                }
            } else {
                return res.status(400).json({ message: 'Order not found' });
            }

            // Begin transaction
            await OrderModel.beginTransaction();

            // Update order status to 'Đã hủy'
            await OrderModel.cancelOrder(orderId);

            // Get the canceled order details
            const rows = await OrderModel.getOrderInfo(orderId);
            if (rows.length > 0) {
                const products = rows[0].products;
                const totalPrice = rows[0].totalPrice;

                // Restore product quantities
                for (const product of products) {
                    const colorArray = await OrderModel.getProductColor(product.id);
                    if (colorArray) {
                        const updatedColorArray = colorArray.map(color => {
                            if (color.name === product.color) {
                                return {
                                    ...color,
                                    quantity: color.quantity + product.quantity
                                };
                            }
                            return color;
                        });

                        await OrderModel.updateProductColor(product.id, updatedColorArray);
                    }
                }

                // Prepare a message for Telegram
                let productDetails = '';
                products.forEach(product => {
                    productDetails += `${product.name} (${product.color})\n`;
                    productDetails += `Số lượng: ${product.quantity}\n`;
                    productDetails += `Giá: ${product.price} VNĐ -> ${product.totalPrice} VNĐ\n\n`;
                });

                const message = `Đơn hàng ID: ${orderId} đã bị hủy:\n\n` +
                                `Tổng giá trị: ${totalPrice} VNĐ\n\n` +
                                `Sản phẩm:\n${productDetails}`;

                // Send the cancellation notification
                sendTelegramMessage(message);
                await sendNotification(`Đơn hàng đã bị hủy [ID: ${orderId}]`, `/orders/${orderId}`);
            }

            await OrderModel.commitTransaction();

            return res.json({ message: 'Order canceled successfully' });
        } catch (error) {
            // Rollback if there's an error
            await OrderModel.rollbackTransaction();
            console.error('Error canceling order:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new OrderController();
