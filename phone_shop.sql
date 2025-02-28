-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 28, 2025 lúc 01:17 PM
-- Phiên bản máy phục vụ: 8.0.40
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `phone_shop`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `id` int NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `lock_acc` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`id`, `username`, `password`, `lock_acc`, `user_id`) VALUES
(1, 'a', '92eb5ffee6ae2fec3ad71c777531578f', 0, 1),
(2, 'd', 'c4ca4238a0b923820dcc509a6f75849b', 0, 2),
(3, 'b', '92eb5ffee6ae2fec3ad71c777531578f', 0, 3),
(4, 'c', '4a8a08f09d37b73795649038408b5f33', 0, 4),
(5, 'khanh', 'c4ca4238a0b923820dcc509a6f75849b', 0, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `full_name` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `phone` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id`, `user_id`, `full_name`, `address`, `phone`) VALUES
(1, 1, 'Khánh Nguyễn Văn', 'Nguyễn Văn Công - HCM', '012345678'),
(5, 3, 'Khanh', 'HCM', '012345678'),
(7, 5, 'Khánh Nguyễn', 'Bình Thuận', '0937927513'),
(8, 5, 'NGUYỄN VĂN KHÁNH', 'Thôn Bàu Giêng, Thắng Hải, Hàm Tân, Bình Thuận', '123'),
(9, 5, 'NGUYỄN VĂN KHÁNH', 'Thôn Bàu Giêng, Thắng Hải, Hàm Tân, Bình Thuận', '333');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `full_name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `full_name`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'Nguyễn Văn Khánh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `color` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`user_id`, `product_id`, `quantity`, `color`) VALUES
(3, 1, 3, 'Đen'),
(3, 1, 2, 'Trắng'),
(3, 2, 1, 'Trắng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `colors`
--

CREATE TABLE `colors` (
  `id` int NOT NULL,
  `name` varchar(32) NOT NULL,
  `hex` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `colors`
--

INSERT INTO `colors` (`id`, `name`, `hex`) VALUES
(1, 'Đen', '#000000'),
(2, 'Trắng', '#FFFFFF'),
(3, 'Xám', '#808080'),
(4, 'Xanh dương', '#0000FF'),
(5, 'Xanh lá cây', '#008000'),
(6, 'Đỏ', '#FF0000'),
(7, 'Vàng', '#FFFF00'),
(8, 'Cam', '#FFA500'),
(9, 'Tím', '#800080'),
(10, 'Nâu', '#A52A2A'),
(11, 'Hồng', '#FFC0CB'),
(12, 'Xanh da trời', '#87CEEB'),
(13, 'Xanh ngọc', '#20B2AA'),
(14, 'Vàng chanh', '#FFFACD'),
(15, 'Bạc', '#C0C0C0'),
(16, 'Xanh lục nhạt', '#90EE90'),
(17, 'Tím nhạt', '#DDA0DD'),
(18, 'Cam sáng', '#FF7F50'),
(19, 'Xanh dương nhạt', '#ADD8E6'),
(20, 'Đỏ tươi', '#FF6347'),
(21, 'Xanh lá mạ', '#98FB98'),
(22, 'Đen nhám', '#4B4B4B'),
(23, 'Trắng ngà', '#FAF0E6'),
(24, 'Nâu sáng', '#D2691E'),
(25, 'Tím than', '#663399');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `history_chatbot`
--

CREATE TABLE `history_chatbot` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `isBot` int NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `history_chatbot`
--

INSERT INTO `history_chatbot` (`id`, `user_id`, `message`, `isBot`, `time`) VALUES
(223, 3, 'Tôi thích màu trắng, có điện thoại nào màu trắng không?', 0, '2025-02-27 16:36:35'),
(224, 3, 'Hiện tại đang có 2 model màu trắng: Google Pixel 3 và iPhone 12.  Bạn muốn xem thông tin về model nào?\n\n<br>\n\n(URL: <a href=\"/product/1\">Google Pixel 3</a>)\n\n (URL: <a href=\"/product/2\">iPhone 12</a>) \n', 1, '2025-02-27 16:36:41'),
(225, 3, 'Giá của Google Pixel 3 màu trắng là bao nhiêu?', 0, '2025-02-27 16:37:03'),
(226, 3, 'Google Pixel 3 màu trắng có giá **3100000 VND**. \n', 1, '2025-02-27 16:37:05'),
(227, 3, 'Giá của Iphone 12 thì sao?', 0, '2025-02-27 16:37:21'),
(228, 3, 'iPhone 12 có giá **27000000 VND**. \n\n<br> \n\n(URL: <a href=\"/product/1\">Google Pixel 3</a>)\n\n (URL: <a href=\"/product/2\">iPhone 12</a>) \n\n\n', 1, '2025-02-27 16:37:26'),
(229, 3, 'Iphone 12 có những màu gì?', 0, '2025-02-27 16:37:31'),
(230, 3, 'iPhone 12 có các màu sau: Màu Đen, Màu Xanh Dương, Màu Trắng. \n\n(URL: <a href=\"/product/2\">iPhone 12</a>) \n', 1, '2025-02-27 16:37:35'),
(231, 3, 'Hãy chuyển hướng tôi sang trang Iphone 12', 0, '2025-02-27 16:37:51'),
(232, 3, '(URL: <a href=\"/product/2\">iPhone 12</a>) \n', 1, '2025-02-27 16:37:54'),
(890, 5, 'Vào trang tìm kiếm điện thoại Xiaomi', 0, '2025-02-28 16:17:19'),
(891, 5, '😁  Chào mừng bạn đến với KhanhHaoStore! 👋 \n\nBạn muốn tìm kiếm sản phẩm Xiaomi à? Chúng tôi có rất nhiều mẫu điện thoại Xiaomi với nhiều ưu đãi hấp dẫn. 🤩\n\nĐể giúp bạn tìm được sản phẩm yêu thích, vui lòng nhập từ khóa cần tìm vào ô tìm kiếm bên trên. 😊\n\n\n<button class=\"material-button\" value=\"/product?\" name=\"redirect\">Tiếp tục tìm kiếm</button>\n', 1, '2025-02-28 16:18:08'),
(892, 5, 'Các sản phẩm Xiaomi mà bạn có?', 0, '2025-02-28 16:18:21'),
(893, 5, 'Chào Khánh Nguyễn! 👋  Rất vui được đón tiếp bạn. 🤩\n\nKhanhHaoStore hiện có những chiếc điện thoại Xiaomi hot nhất, cực chất và giá hợp lý lắm nha! ⚡️\n\nĐể dễ dàng lựa chọn, bạn có thể:\n\n*   <button class=\"material-button\" value=\"/product?search=Xiaomi+Mi+11+Lite+5G\" name=\"redirect\">Xem sản phẩm Mi 11 Lite 5G</button>\n\n\n*   <button class=\"material-button\" value=\"/product?search=Xiaomi+Redmi\" name=\"redirect\">Khám phá Redmi Note 11 series </button>\n\nBạn có thể tìm kiếm theo tên hoặc chủng loại để xem thêm sản phẩm nhé! 😉\n\n\n\n', 1, '2025-02-28 16:18:50'),
(894, 5, 'sản phẩm này có những màu gì?', 0, '2025-02-28 16:19:08'),
(895, 5, 'Xiaomi Mi 11 Lite 5G có các màu sắc sau:\n\n*   <button class=\"material-button\" value=\"/product/3?color=Đen\" name=\"redirect\">Màu Đen</button>\n\n\n*   <button class=\"material-button\" value=\"/product/3?color=Xanh dương\" name=\"redirect\">Màu Xanh dương</button>\n\n\n*   <button class=\"material-button\" value=\"/product/3?color=Vàng\" name=\"redirect\">Màu Vàng</button>\n\n\n*   <button class=\"material-button\" value=\"/product/3?color=Hồng\" name=\"redirect\">Màu Hồng</button>\n\n\n\nBạn muốn xem thêm chi tiết về một màu nào đó không? 😉 \n', 1, '2025-02-28 16:19:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `text` text NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `text`, `time`) VALUES
(1, 'Test notification', '2025-02-26 23:47:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`) VALUES
(3, 3),
(6, 3),
(7, 3),
(8, 3),
(9, 3),
(10, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 5),
(15, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_info`
--

CREATE TABLE `order_info` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `products` json NOT NULL,
  `totalPrice` int NOT NULL DEFAULT '0',
  `payment` varchar(32) NOT NULL,
  `status` varchar(32) NOT NULL,
  `address` json NOT NULL,
  `orderAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `order_info`
--

INSERT INTO `order_info` (`id`, `order_id`, `products`, `totalPrice`, `payment`, `status`, `address`, `orderAt`) VALUES
(2, 3, '[{\"id\": 2, \"name\": \"iPhone 12\", \"color\": \"Xanh dương\", \"price\": 26000000, \"quantity\": 6, \"totalPrice\": 156000000}]', 156000000, 'tienmat', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 18:54:06'),
(5, 6, '[{\"id\": 2, \"name\": \"iPhone 12\", \"color\": \"Xanh dương\", \"price\": 26000000, \"quantity\": 6, \"totalPrice\": 156000000}]', 156000000, 'momo', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:03:00'),
(6, 7, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Hồng\", \"price\": 3200000, \"quantity\": 1, \"totalPrice\": 3200000}]', 3200000, 'tienmat', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:04:41'),
(7, 8, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Trắng\", \"price\": 2900000, \"quantity\": 2, \"totalPrice\": 5800000}]', 5800000, 'tienmat', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:12:16'),
(8, 9, '[{\"id\": 2, \"name\": \"iPhone 12\", \"color\": \"Đen\", \"price\": 24000000, \"quantity\": 1, \"totalPrice\": 24000000}]', 24000000, 'tienmat', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:13:44'),
(9, 10, '[{\"id\": 2, \"name\": \"iPhone 12\", \"color\": \"Đen\", \"price\": 24000000, \"quantity\": 1, \"totalPrice\": 24000000}]', 24000000, 'tienmat', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:22:18'),
(10, 11, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Trắng\", \"price\": 2900000, \"quantity\": 2, \"totalPrice\": 5800000}]', 5800000, 'tienmat', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:22:32'),
(11, 12, '[{\"id\": 2, \"name\": \"iPhone 12\", \"color\": \"Đen\", \"price\": 24000000, \"quantity\": 1, \"totalPrice\": 24000000}]', 24000000, 'nganhang', 'Đã hủy', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:24:55'),
(12, 13, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Hồng\", \"price\": 3200000, \"quantity\": 1, \"totalPrice\": 3200000}]', 3200000, 'momo', 'Đang chờ thanh toán', '{\"name\": \"Khanh\", \"phone\": \"012345678\", \"address\": \"HCM\"}', '2025-02-23 19:54:50'),
(13, 14, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Đen\", \"price\": 2700000, \"quantity\": 1, \"totalPrice\": 2700000}]', 2700000, 'tienmat', 'Đang chờ xác nhận', '{\"name\": \"Khánh Nguyễn\", \"phone\": \"0937927513\", \"address\": \"Bình Thuận\"}', '2025-02-28 00:02:02'),
(14, 15, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Đen\", \"price\": 2700000, \"quantity\": 1, \"totalPrice\": 2700000}]', 2700000, 'nganhang', 'Đang chờ xác nhận', '{\"name\": \"Khánh Nguyễn\", \"phone\": \"0937927513\", \"address\": \"Bình Thuận\"}', '2025-02-28 00:03:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `favorite` json NOT NULL,
  `color` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `favorite`, `color`, `created_at`, `updated_at`) VALUES
(1, 'Google Pixel 3', 'a pixel 3 phone', '[\"a153\", \"3968\", 3, 5]', '[{\"img\": \"/img/google-pixel-3-black.jpg\", \"name\": \"Đen\", \"money\": 3000000, \"quantity\": 1, \"moneyDiscount\": 2700000}, {\"img\": \"/img/google-pixel-3-white.jpg\", \"name\": \"Trắng\", \"money\": 3100000, \"quantity\": 2, \"moneyDiscount\": 2900000}, {\"img\": \"/img/google-pixel-3-pink.jpg\", \"name\": \"Hồng\", \"money\": 3200000, \"quantity\": 0}]', '2025-02-28 14:47:44', '2025-02-28 14:47:44'),
(2, 'iPhone 12', 'latest iPhone model a', '[3]', '[{\"img\": \"/img/ZePnBJgWxoKBP3NuxpF1bDbSbl0Qar4WffMwHG2B.webp\", \"name\": \"Đen\", \"money\": \"25000000\", \"quantity\": \"2\", \"moneyDiscount\": \"24000000\"}, {\"img\": \"/img/qmLN6shAnAijEyYSwM2Ao4OTd50fKRMRbFjYUy9u.jpg\", \"name\": \"Xanh dương\", \"money\": \"26000000\", \"quantity\": \"12\"}, {\"img\": \"/img/5MZ2hai0gMQBDVsmmQgeQvSRmkqXSTVgn9aVRggT.webp\", \"name\": \"Trắng\", \"money\": \"27000000\", \"quantity\": \"3\"}]', '2025-02-28 14:47:44', '2025-02-28 11:49:51'),
(3, 'Xiaomi Mi 11 Lite 5G', 'mid-range phone', '[]', '[{\"img\": \"/img/egLl6co6KQGzg7wIZ3c62cqpBNMglOHQlVsZiNcg.jpg\", \"name\": \"Đen\", \"money\": \"14000000\", \"quantity\": \"3\"}, {\"img\": \"/img/g7edeDr53GRPIq1G7VPLZsxZkE9D9rDHVzHJvhai.webp\", \"name\": \"Xanh dương\", \"money\": \"20000000\", \"quantity\": \"5\", \"moneyDiscount\": \"19000000\"}, {\"img\": \"/img/hUnMqfnsNzbOWgjiUistiOquFEw63sV5OeNKvgfV.png\", \"name\": \"Vàng\", \"money\": \"20000000\", \"quantity\": \"7\"}, {\"img\": \"/img/04rCezlCnOv7jhmAsQKRvlj9XQwIvsc5Nv8neBM3.jpg\", \"name\": \"Hồng\", \"money\": \"14000000\", \"quantity\": \"1\"}]', '2025-02-28 09:10:06', '2025-02-28 11:52:32'),
(4, 'Samsung Galaxy S21', NULL, '[]', '[{\"img\": \"/img/c8TKZA6O2IiUKbd4qSQoKaUu2CDhNpCyUBgfeUY5.jpg\", \"name\": \"Hồng\", \"money\": \"22000000\", \"quantity\": \"4\", \"moneyDiscount\": \"21000000\"}, {\"img\": \"/img/h9Lt8DZ2NtW7i9TxFEHWCeGTqfjtFcAU1MQJNmK3.webp\", \"name\": \"Xám\", \"money\": \"22000000\", \"quantity\": \"3\"}]', '2025-02-28 09:24:46', '2025-02-28 11:59:13'),
(5, 'iPhone 11', NULL, '[]', '[{\"img\": \"/img/SBCywrJ0kS4HAE9Lhm3esoVRf8zZLjDPoZLEZ8rX.jpg\", \"name\": \"Đen\", \"money\": \"16000000\", \"quantity\": \"4\"}, {\"img\": \"/img/RDPQpgdhhbSeHRopPMpMmB7w6wk1wP0DfApEJQd9.jpg\", \"name\": \"Trắng\", \"money\": \"16000000\", \"quantity\": \"6\"}, {\"img\": \"/img/kZx4bU7e8COR7ZqINEAPpESeazFAo9yceEt83q6e.jpg\", \"name\": \"Xanh dương\", \"money\": \"16000000\", \"quantity\": \"3\"}]', '2025-02-28 09:38:25', '2025-02-28 11:59:53'),
(6, 'OnePlus 9', 'premium OnePlus device 0', '[]', '[{\"img\": \"/img/gVX0afuzw21aRI2a99ZfTreuBcepD0Dln6iU2m35.png\", \"name\": \"Xanh dương\", \"money\": \"20000000\", \"quantity\": \"2\", \"moneyDiscount\": \"19000000\"}, {\"img\": \"/img/l7V6hQgunwv4j97FLY9lpYrGhMeqs2hHDBjmIScf.png\", \"name\": \"Bạc\", \"money\": \"20000000\", \"quantity\": \"3\"}]', '2025-02-28 10:27:28', '2025-02-28 12:15:08');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('TIP6lPI0xZZroJzL0KXMN1D3q4rdtcnqQJBWkhyH', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoidTh6WDl1VUN5VWcyYVRibjFaSEhzYjhUOWFWS290REdBUEJJT1NpVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6OToiZnVsbF9uYW1lIjtzOjIwOiJOZ3V54buFbiBWxINuIEtow6FuaCI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1740744974);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `key` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`) VALUES
(1, 'BOT_USERNAME', 'khanhhao_store_bot'),
(2, 'BOT_TOKEN', '7638566581:AAG_Ds3Gmd3xyjCxv3Ae7hXB0e5Pe7xL4xE'),
(3, 'BOT_CHAT_ID', '1618522645'),
(4, 'MAINTENANCE', '0'),
(5, 'BOT_SEND_NOTIFICATION_AFTER_ORDER', '1'),
(6, 'CHATBOT_ENABLE', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`) VALUES
(1, 'Khánh', 'Nguyễn', 'khanh@gmail.com'),
(2, 'a', 'b', 'c@gmail.com'),
(3, 'b', 'b', 'b@gmail.com'),
(4, 'c', 'c', 'cura.t.o.r.cvn@gmail.com'),
(5, 'Khánh', 'Nguyễn', 'khanhnguyen@gmail.com');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

CREATE TABLE `voucher` (
  `id` int NOT NULL,
  `code` varchar(64) NOT NULL,
  `discount` float NOT NULL DEFAULT '0',
  `count` int NOT NULL DEFAULT '0',
  `limit_user` json NOT NULL,
  `user_id` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`id`, `code`, `discount`, `count`, `limit_user`, `user_id`) VALUES
(1, 'KHANHSTORE10', 0.1, 19993, '[]', '[3]');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `history_chatbot`
--
ALTER TABLE `history_chatbot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `order_info`
--
ALTER TABLE `order_info`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Chỉ mục cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `address`
--
ALTER TABLE `address`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `history_chatbot`
--
ALTER TABLE `history_chatbot`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=896;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `order_info`
--
ALTER TABLE `order_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ràng buộc cho bảng `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ràng buộc cho bảng `history_chatbot`
--
ALTER TABLE `history_chatbot`
  ADD CONSTRAINT `history_chatbot_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
