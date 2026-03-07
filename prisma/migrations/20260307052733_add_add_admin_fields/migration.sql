-- AlterTable
ALTER TABLE `users` ADD COLUMN `banExpires` DATETIME(3) NULL,
    ADD COLUMN `banReason` TEXT NULL,
    ADD COLUMN `banned` BOOLEAN NULL DEFAULT false;
