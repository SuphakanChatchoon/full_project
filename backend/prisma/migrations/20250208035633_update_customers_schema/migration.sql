-- DropForeignKey
ALTER TABLE `orderdetail` DROP FOREIGN KEY `orderdetail_ibfk_1`;

-- DropForeignKey
ALTER TABLE `orderdetail` DROP FOREIGN KEY `orderdetail_ibfk_2`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_ibfk_1`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_ibfk_1`;

-- AlterTable
ALTER TABLE `customers` MODIFY `customer_id` INTEGER NOT NULL AUTO_INCREMENT;

-- RenameIndex
ALTER TABLE `customers` RENAME INDEX `email` TO `customers_email_key`;
