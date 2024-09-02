-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 29, 2023 at 09:19 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meeting_room_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_bookings`
--

CREATE TABLE `tb_bookings` (
  `bk_id` int NOT NULL,
  `bk_title` varchar(45) NOT NULL,
  `bk_detail` text,
  `bk_time_start` datetime NOT NULL,
  `bk_time_end` datetime NOT NULL,
  `bk_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bk_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bk_status` enum('pending','allowed','not allowed') NOT NULL DEFAULT 'pending',
  `tb_users_u_id` int NOT NULL,
  `tb_rooms_r_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `tb_bookings_has_tb_equipments`
--

CREATE TABLE `tb_bookings_has_tb_equipments` (
  `tb_bookings_bk_id` int NOT NULL,
  `tb_equipments_eq_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `tb_equipments`
--

CREATE TABLE `tb_equipments` (
  `eq_id` int NOT NULL,
  `eq_image` varchar(45) NOT NULL,
  `eq_name` varchar(45) NOT NULL,
  `eq_detail` text,
  `eq_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eq_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tb_equipments`
--

INSERT INTO `tb_equipments` (`eq_id`, `eq_image`, `eq_name`, `eq_detail`, `eq_created`, `eq_updated`) VALUES
(1, 'equip-1698416541209.jpg', 'อุปกรณ์001', NULL, '2023-10-27 21:22:21', '2023-10-27 21:22:21'),
(2, 'equip-1698416556214.jpg', 'อุปกรณ์002', NULL, '2023-10-27 21:22:36', '2023-10-27 21:22:36'),
(3, 'equip-1698416567518.jpg', 'อุปกรณ์003', NULL, '2023-10-27 21:22:47', '2023-10-27 21:22:47'),
(4, 'equip-1698416573272.jpg', 'อุปกรณ์004', NULL, '2023-10-27 21:22:53', '2023-10-27 21:22:53'),
(5, 'equip-1698416578173.jpg', 'อุปกรณ์005', NULL, '2023-10-27 21:22:58', '2023-10-27 21:22:58'),
(6, 'equip-1698416582573.jpg', 'อุปกรณ์006', NULL, '2023-10-27 21:23:02', '2023-10-27 21:23:02'),
(7, 'equip-1698416587283.jpg', 'อุปกรณ์007', NULL, '2023-10-27 21:23:07', '2023-10-27 21:23:07'),
(8, 'equip-1698416594461.jpg', 'อุปกรณ์008', NULL, '2023-10-27 21:23:14', '2023-10-27 21:23:14'),
(9, 'equip-1698416599075.jpg', 'อุปกรณ์009', NULL, '2023-10-27 21:23:19', '2023-10-27 21:23:19'),
(10, 'equip-1698416603357.jpg', 'อุปกรณ์010', NULL, '2023-10-27 21:23:23', '2023-10-27 21:23:23'),
(11, 'equip-1698416607108.jpg', 'อุปกรณ์011', NULL, '2023-10-27 21:23:27', '2023-10-27 21:23:27'),
(12, 'equip-1698416611412.jpg', 'อุปกรณ์012', NULL, '2023-10-27 21:23:31', '2023-10-27 21:23:31'),
(13, 'equip-1698416615658.jpg', 'อุปกรณ์013', NULL, '2023-10-27 21:23:35', '2023-10-27 21:23:35'),
(14, 'equip-1698416618692.jpg', 'อุปกรณ์014', NULL, '2023-10-27 21:23:38', '2023-10-27 21:23:38'),
(15, 'equip-1698416621684.jpg', 'อุปกรณ์015', NULL, '2023-10-27 21:23:41', '2023-10-27 21:23:41'),
(16, 'equip-1698416624952.jpg', 'อุปกรณ์016', NULL, '2023-10-27 21:23:44', '2023-10-27 21:23:44'),
(17, 'equip-1698416628036.jpg', 'อุปกรณ์017', NULL, '2023-10-27 21:23:48', '2023-10-27 21:23:48'),
(18, 'equip-1698416630485.jpg', 'อุปกรณ์018', NULL, '2023-10-27 21:23:50', '2023-10-27 21:23:50');

-- --------------------------------------------------------

--
-- Table structure for table `tb_rooms`
--

CREATE TABLE `tb_rooms` (
  `r_id` int NOT NULL,
  `r_image` varchar(45) NOT NULL,
  `r_name` varchar(45) NOT NULL,
  `r_capacity` int NOT NULL,
  `r_detail` text,
  `r_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `r_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `u_id` int NOT NULL,
  `u_username` varchar(15) NOT NULL,
  `u_password` varchar(64) NOT NULL,
  `u_firstname` varchar(45) NOT NULL,
  `u_lastname` varchar(45) NOT NULL,
  `u_role` enum('admin','user') NOT NULL DEFAULT 'user',
  `u_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `u_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`u_id`, `u_username`, `u_password`, `u_firstname`, `u_lastname`, `u_role`, `u_created`, `u_updated`) VALUES
(1, 'admin', '$2b$10$K6PAgKC2r3DmRMgblnC0HuZnb1D1ioNoNnlxWJsgemRBCh6DP4rp.', 'Administrator', 'Administrator', 'admin', '2023-10-26 18:08:06', '2023-10-26 18:08:06'),
(2, 'Nattawut', '$2b$10$bnzCSGRN.SVps.JYodHvwOt4u6OfKKJ0.bJjZhZHR.qAB9FzCLbkS', 'Nattawut', 'Khuntamli', 'user', '2023-10-26 18:08:40', '2023-10-26 18:08:40'),
(3, 'Carnitine', '$2b$10$UIy05S3c15Hxuo9xqf8B5O5gLHDkb7RmbQgSChlnKld1qz4HzjOsO', 'Carnitine', 'Carnitine', 'user', '2023-10-26 18:31:34', '2023-10-26 18:31:34'),
(4, 'ttvone', '$2b$10$DnMYRRklKLTaWkTQ3wBda.vvDCijEvG/9g8SsrLVyjIKOqCNCtqMK', 'ttvone', 'ttvone', 'user', '2023-10-26 19:55:58', '2023-10-26 19:55:58'),
(5, 'CLOVERPLUS', '$2b$10$m62aSHFVLLJPvYXwDB/v3eaZI3NH8aDEZLuSIJTDGBfZfIAa/P54W', 'CLOVER', 'PLUS', 'user', '2023-10-27 16:33:53', '2023-10-27 16:33:53'),
(6, 'Nattawut2', '$2b$10$Y.FM1g.mAek/3GWdAi2FzeKN0bL05SWCQQIXUZeex1q9uQd.h7hr2', 'Nattawut2', 'Nattawut2', 'user', '2023-10-27 16:36:14', '2023-10-27 16:36:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_bookings`
--
ALTER TABLE `tb_bookings`
  ADD PRIMARY KEY (`bk_id`),
  ADD KEY `fk_tb_bookings_tb_users_idx` (`tb_users_u_id`),
  ADD KEY `fk_tb_bookings_tb_rooms1_idx` (`tb_rooms_r_id`);

--
-- Indexes for table `tb_bookings_has_tb_equipments`
--
ALTER TABLE `tb_bookings_has_tb_equipments`
  ADD PRIMARY KEY (`tb_bookings_bk_id`,`tb_equipments_eq_id`),
  ADD KEY `fk_tb_bookings_has_tb_equipments_tb_equipments1_idx` (`tb_equipments_eq_id`),
  ADD KEY `fk_tb_bookings_has_tb_equipments_tb_bookings1_idx` (`tb_bookings_bk_id`);

--
-- Indexes for table `tb_equipments`
--
ALTER TABLE `tb_equipments`
  ADD PRIMARY KEY (`eq_id`),
  ADD UNIQUE KEY `eq_name_UNIQUE` (`eq_name`);

--
-- Indexes for table `tb_rooms`
--
ALTER TABLE `tb_rooms`
  ADD PRIMARY KEY (`r_id`),
  ADD UNIQUE KEY `r_name_UNIQUE` (`r_name`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`u_id`),
  ADD UNIQUE KEY `u_username_UNIQUE` (`u_username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_bookings`
--
ALTER TABLE `tb_bookings`
  MODIFY `bk_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_equipments`
--
ALTER TABLE `tb_equipments`
  MODIFY `eq_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tb_rooms`
--
ALTER TABLE `tb_rooms`
  MODIFY `r_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `u_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_bookings`
--
ALTER TABLE `tb_bookings`
  ADD CONSTRAINT `fk_tb_bookings_tb_users` FOREIGN KEY (`tb_users_u_id`) REFERENCES `tb_users` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
