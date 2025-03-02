-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 02, 2025 lúc 01:05 PM
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
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`id`, `username`, `password`, `lock_acc`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'a', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 0, 1, '2025-03-02 16:15:43', '2025-03-02 09:15:45'),
(2, 'd', 'c4ca4238a0b923820dcc509a6f75849b', 0, 2, '2025-03-02 16:15:43', '2025-03-02 16:15:43'),
(3, 'b', '92eb5ffee6ae2fec3ad71c777531578f', 0, 3, '2025-03-02 16:15:43', '2025-03-02 16:15:43'),
(4, 'c', '4a8a08f09d37b73795649038408b5f33', 0, 4, '2025-03-02 16:15:43', '2025-03-02 16:15:43'),
(5, 'khanh', 'c4ca4238a0b923820dcc509a6f75849b', 0, 5, '2025-03-02 16:15:43', '2025-03-02 16:15:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `full_name` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id`, `user_id`, `full_name`, `address`, `phone`, `created_at`, `updated_at`) VALUES
(5, 3, 'Khanh', 'HCM', '012345678', '2025-03-02 17:25:39', '2025-03-02 17:25:39'),
(7, 5, 'Khánh Nguyễn', 'Bình Thuận', '0937927513', '2025-03-02 17:25:39', '2025-03-02 17:25:39'),
(8, 5, 'NGUYỄN VĂN KHÁNH', 'Thôn Bàu Giêng, Thắng Hải, Hàm Tân, Bình Thuận', '123', '2025-03-02 17:25:39', '2025-03-02 17:25:39'),
(9, 5, 'NGUYỄN VĂN KHÁNH', 'Thôn Bàu Giêng, Thắng Hải, Hàm Tân, Bình Thuận', '333', '2025-03-02 17:25:39', '2025-03-02 17:25:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `full_name` varchar(128) NOT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `full_name`, `img`, `email`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'e00cf25ad42683b3df678c61f42c6bda', 'Nguyễn Văn Khánh', 'profile_pictures/7VbuW6KObJz4GRjeOrPh8oE8I7fpd9tRdhz3y2zG.jpg', 'a@gmail.com', '2025-03-02 14:41:16', '2025-03-02 08:32:57'),
(2, 'adadad', '26460f32a3164e6382436aba45eaf862', 'Khanh', 'profile_pictures/Cep7gYO6US00xLkwGFIw2r2zjivc0IHLZjmosnz2.png', 'nguyenkhanhlitev20@gmail.com', '2025-03-02 08:38:21', '2025-03-02 08:38:52');

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
(3, 2, 1, 'Trắng'),
(5, 1, 1, 'Đen'),
(1, 1, 1, 'Đen');

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
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `history_chatbot`
--

INSERT INTO `history_chatbot` (`id`, `user_id`, `message`, `isBot`, `time`, `updated_at`) VALUES
(223, 3, 'Tôi thích màu trắng, có điện thoại nào màu trắng không?', 0, '2025-02-27 16:36:35', '2025-03-02 17:47:30'),
(224, 3, 'Hiện tại đang có 2 model màu trắng: Google Pixel 3 và iPhone 12.  Bạn muốn xem thông tin về model nào?\n\n<br>\n\n(URL: <a href=\"/product/1\">Google Pixel 3</a>)\n\n (URL: <a href=\"/product/2\">iPhone 12</a>) \n', 1, '2025-02-27 16:36:41', '2025-03-02 17:47:30'),
(225, 3, 'Giá của Google Pixel 3 màu trắng là bao nhiêu?', 0, '2025-02-27 16:37:03', '2025-03-02 17:47:30'),
(226, 3, 'Google Pixel 3 màu trắng có giá **3100000 VND**. \n', 1, '2025-02-27 16:37:05', '2025-03-02 17:47:30'),
(227, 3, 'Giá của Iphone 12 thì sao?', 0, '2025-02-27 16:37:21', '2025-03-02 17:47:30'),
(228, 3, 'iPhone 12 có giá **27000000 VND**. \n\n<br> \n\n(URL: <a href=\"/product/1\">Google Pixel 3</a>)\n\n (URL: <a href=\"/product/2\">iPhone 12</a>) \n\n\n', 1, '2025-02-27 16:37:26', '2025-03-02 17:47:30'),
(229, 3, 'Iphone 12 có những màu gì?', 0, '2025-02-27 16:37:31', '2025-03-02 17:47:30'),
(230, 3, 'iPhone 12 có các màu sau: Màu Đen, Màu Xanh Dương, Màu Trắng. \n\n(URL: <a href=\"/product/2\">iPhone 12</a>) \n', 1, '2025-02-27 16:37:35', '2025-03-02 17:47:30'),
(231, 3, 'Hãy chuyển hướng tôi sang trang Iphone 12', 0, '2025-02-27 16:37:51', '2025-03-02 17:47:30'),
(232, 3, '(URL: <a href=\"/product/2\">iPhone 12</a>) \n', 1, '2025-02-27 16:37:54', '2025-03-02 17:47:30'),
(974, 1, 'Xin chào', 0, '2025-03-02 18:43:08', '2025-03-02 18:43:08'),
(975, 1, '<div>\n    Xin chào 👋 Khánh Nguyễn!\n    <br>\n    Chào mừng bạn đến với KhanhHaoStore! 🥳 Rất vui được hỗ trợ bạn.\n    <br>\n    Bạn có muốn xem các sản phẩm mới nhất của chúng tôi không? Hoặc có thể bạn đang tìm kiếm một sản phẩm cụ thể nào đó? 🤔 Hãy cho tôi biết nhé!\n    <br>\n    <button class=\"material-button\" value=\"/\" name=\"redirect\">Xem sản phẩm</button>\n</div>\n', 1, '2025-03-02 18:43:10', '2025-03-02 18:43:10');

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
  `url` varchar(255) NOT NULL DEFAULT '/',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isRead` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `text`, `url`, `time`, `isRead`, `created_at`, `updated_at`) VALUES
(1, 'Test notification', '/', '2025-02-26 23:47:26', 1, '2025-02-28 21:35:45', '2025-02-28 17:47:41'),
(2, 'Đơn hàng đang chờ thanh toán [ID: 17]', '/orders/17', '2025-03-01 01:04:35', 1, '2025-03-01 01:04:35', '2025-02-28 18:13:03'),
(3, 'Đã thanh toán, hãy xác nhận đơn hàng [ID: 17]', '/orders/17', '2025-03-01 01:08:07', 1, '2025-03-01 01:08:07', '2025-02-28 18:13:03');

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
(14, 5),
(16, 5),
(17, 5);

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
  `orderAt` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `order_info`
--

INSERT INTO `order_info` (`id`, `order_id`, `products`, `totalPrice`, `payment`, `status`, `address`, `orderAt`, `created_at`, `updated_at`) VALUES
(13, 14, '[{\"id\": 1, \"name\": \"Google Pixel 3\", \"color\": \"Đen\", \"price\": 2700000, \"quantity\": 1, \"totalPrice\": 2700000}]', 2700000, 'tienmat', 'Đã hủy', '{\"name\": \"Khánh Nguyễn\", \"phone\": \"0937927513\", \"address\": \"Bình Thuận\"}', '2025-02-28 00:02:02', '2025-02-28 23:17:38', '2025-03-01 19:30:16'),
(15, 16, '[{\"id\": 10, \"name\": \"Xiaomi Mi 11\", \"color\": \"Xanh dương\", \"price\": \"17000000\", \"quantity\": 1, \"totalPrice\": 17000000}]', 17000000, 'nganhang', 'Đã hủy', '{\"name\": \"NGUYỄN VĂN KHÁNH\", \"phone\": \"333\", \"address\": \"Thôn Bàu Giêng, Thắng Hải, Hàm Tân, Bình Thuận\"}', '2025-03-01 01:00:57', '2025-03-01 01:00:57', '2025-03-01 01:00:57'),
(16, 17, '[{\"id\": 10, \"name\": \"Xiaomi Mi 11\", \"color\": \"Xanh dương\", \"price\": \"17000000\", \"quantity\": 2, \"totalPrice\": 34000000}, {\"id\": 6, \"name\": \"OnePlus 9\", \"color\": \"Xanh dương\", \"price\": \"19000000\", \"quantity\": 1, \"totalPrice\": 19000000}]', 53000000, 'nganhang', 'Đã hủy', '{\"name\": \"NGUYỄN VĂN KHÁNH\", \"phone\": \"123\", \"address\": \"Thôn Bàu Giêng, Thắng Hải, Hàm Tân, Bình Thuận\"}', '2025-03-01 01:04:35', '2025-03-01 01:04:35', '2025-03-01 19:32:38');

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
(1, 'Google Pixel 3', 'a pixel 3 phone', '[1, 2, 3, 5]', '[{\"img\": \"/img/google-pixel-3-black.jpg\", \"name\": \"Đen\", \"money\": \"3000000\", \"quantity\": 2, \"moneyDiscount\": \"2700000\"}, {\"img\": \"/img/google-pixel-3-white.jpg\", \"name\": \"Trắng\", \"money\": \"3100000\", \"quantity\": \"2\", \"moneyDiscount\": \"2900000\"}, {\"img\": \"/img/google-pixel-3-pink.jpg\", \"name\": \"Hồng\", \"money\": \"3200000\", \"quantity\": \"0\"}]', '2025-02-28 14:47:44', '2025-03-01 19:30:37'),
(2, 'iPhone 12', 'latest iPhone model a', '[3]', '[{\"img\": \"/img/ZePnBJgWxoKBP3NuxpF1bDbSbl0Qar4WffMwHG2B.webp\", \"name\": \"Đen\", \"money\": \"25000000\", \"quantity\": \"2\", \"moneyDiscount\": \"24000000\"}, {\"img\": \"/img/qmLN6shAnAijEyYSwM2Ao4OTd50fKRMRbFjYUy9u.jpg\", \"name\": \"Xanh dương\", \"money\": \"26000000\", \"quantity\": \"12\"}, {\"img\": \"/img/5MZ2hai0gMQBDVsmmQgeQvSRmkqXSTVgn9aVRggT.webp\", \"name\": \"Trắng\", \"money\": \"27000000\", \"quantity\": \"3\"}]', '2025-02-28 14:47:44', '2025-02-28 11:49:51'),
(3, 'Xiaomi Mi 11 Lite 5G', 'mid-range phone', '[]', '[{\"img\": \"/img/egLl6co6KQGzg7wIZ3c62cqpBNMglOHQlVsZiNcg.jpg\", \"name\": \"Đen\", \"money\": \"14000000\", \"quantity\": \"3\"}, {\"img\": \"/img/g7edeDr53GRPIq1G7VPLZsxZkE9D9rDHVzHJvhai.webp\", \"name\": \"Xanh dương\", \"money\": \"20000000\", \"quantity\": \"5\", \"moneyDiscount\": \"19000000\"}, {\"img\": \"/img/hUnMqfnsNzbOWgjiUistiOquFEw63sV5OeNKvgfV.png\", \"name\": \"Vàng\", \"money\": \"20000000\", \"quantity\": \"7\"}, {\"img\": \"/img/04rCezlCnOv7jhmAsQKRvlj9XQwIvsc5Nv8neBM3.jpg\", \"name\": \"Hồng\", \"money\": \"14000000\", \"quantity\": \"1\"}]', '2025-02-28 09:10:06', '2025-02-28 11:52:32'),
(4, 'Samsung Galaxy S21', NULL, '[]', '[{\"img\": \"/img/c8TKZA6O2IiUKbd4qSQoKaUu2CDhNpCyUBgfeUY5.jpg\", \"name\": \"Hồng\", \"money\": \"22000000\", \"quantity\": \"4\", \"moneyDiscount\": \"21000000\"}, {\"img\": \"/img/h9Lt8DZ2NtW7i9TxFEHWCeGTqfjtFcAU1MQJNmK3.webp\", \"name\": \"Xám\", \"money\": \"22000000\", \"quantity\": \"3\"}]', '2025-02-28 09:24:46', '2025-02-28 11:59:13'),
(5, 'iPhone 11', NULL, '[]', '[{\"img\": \"/img/SBCywrJ0kS4HAE9Lhm3esoVRf8zZLjDPoZLEZ8rX.jpg\", \"name\": \"Đen\", \"money\": \"16000000\", \"quantity\": \"4\"}, {\"img\": \"/img/RDPQpgdhhbSeHRopPMpMmB7w6wk1wP0DfApEJQd9.jpg\", \"name\": \"Trắng\", \"money\": \"16000000\", \"quantity\": \"6\"}, {\"img\": \"/img/kZx4bU7e8COR7ZqINEAPpESeazFAo9yceEt83q6e.jpg\", \"name\": \"Xanh dương\", \"money\": \"16000000\", \"quantity\": \"3\"}]', '2025-02-28 09:38:25', '2025-02-28 11:59:53'),
(6, 'OnePlus 9', 'premium OnePlus device 0', '[]', '[{\"img\": \"/img/gVX0afuzw21aRI2a99ZfTreuBcepD0Dln6iU2m35.png\", \"name\": \"Xanh dương\", \"money\": \"20000000\", \"quantity\": 2, \"moneyDiscount\": \"19000000\"}, {\"img\": \"/img/l7V6hQgunwv4j97FLY9lpYrGhMeqs2hHDBjmIScf.png\", \"name\": \"Bạc\", \"money\": \"20000000\", \"quantity\": \"3\"}]', '2025-02-28 10:27:28', '2025-03-01 19:32:38'),
(10, 'Xiaomi Mi 11', 'flagship Xiaomi model', '[]', '[{\"img\": \"/img/WMp6lnIrYISMZxc1y69DroL2Wsi4UvTlUyednCV3.jpg\", \"name\": \"Đen\", \"money\": \"18000000\", \"quantity\": \"6\"}, {\"img\": \"/img/38VhDhhE6UMRLwDBYlf9nxkTdDrXCih69N7EmuP9.jpg\", \"name\": \"Xanh dương\", \"money\": \"18000000\", \"quantity\": 3, \"moneyDiscount\": \"17000000\"}]', '2025-02-28 15:07:02', '2025-03-01 19:32:38');

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
('s0CHjX6XWphN5NGnnpTEWQg3rT5ysVblJoKVhC0N', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiRmVJemd6MWFxTXNsYUNEMmdxWWI0MnBhRmd6NWJ5a3h1b2hpdjc3eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hbmFseXRpY3MiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjk6ImZ1bGxfbmFtZSI7czoyMDoiTmd1eeG7hW4gVsSDbiBLaMOhbmgiO3M6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1740915930);

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
(6, 'CHATBOT_ENABLE', '2'),
(7, 'LOCAL_CHATBOT_MODEL', 'gemma-2-9b-it@q3_k_l'),
(8, 'GEMINI_API_KEY', 'AIzaSyDriudRHcFKx8e-rg_5uF1kT3IH56K2b-s'),
(9, 'LOCAL_CHATBOT_URL', 'http://127.0.0.1:1234'),
(10, 'LOCAL_CHATBOT_TEMPERATURE', '1.0'),
(11, 'CHATBOT_AVATAR', '/img/botAvatar.png'),
(12, 'CHATBOT_USER_AVATAR', '/img/user_avatar_1740915730.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Khánh', 'Nguyễn', 'khanh@gmail.com', '2025-03-02 00:41:51', '2025-03-02 00:41:51'),
(2, 'a', 'b', 'c@gmail.com', '2025-03-02 00:41:51', '2025-03-02 00:41:51'),
(3, 'b', 'b', 'b@gmail.com', '2025-03-02 00:41:51', '2025-03-02 00:41:51'),
(4, 'c', 'c', 'cura.t.o.r.cvn@gmail.com', '2025-03-02 00:41:51', '2025-03-02 00:41:51'),
(5, 'Khánh', 'Nguyễn', 'khanhnguyen@gmail.com', '2025-03-02 00:41:51', '2025-03-02 00:41:51');

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
  `user_id` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`id`, `code`, `discount`, `count`, `limit_user`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'KHANHSTORE10', 0.15, 19993, '[]', '[3]', '2025-03-01 21:53:08', '2025-03-01 18:14:58'),
(3, 'KHANHSTORE100', 1, 9999, '[]', '[]', '2025-03-01 18:28:44', '2025-03-01 18:28:44'),
(4, 'KHANHSTORE50', 0.5, 5000, '[1]', '[]', '2025-03-01 18:33:34', '2025-03-01 18:40:52');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=976;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `order_info`
--
ALTER TABLE `order_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
