/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `verification` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `account` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    MODIFY `account_id` VARCHAR(255) NOT NULL,
    MODIFY `provider_id` VARCHAR(255) NOT NULL,
    MODIFY `scope` TEXT NULL,
    MODIFY `password` VARCHAR(255) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `session` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    MODIFY `token` VARCHAR(255) NOT NULL,
    MODIFY `ip_address` VARCHAR(255) NULL,
    MODIFY `user_agent` TEXT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `verification` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(255) NOT NULL,
    MODIFY `identifier` VARCHAR(255) NOT NULL,
    MODIFY `value` TEXT NOT NULL,
    ADD PRIMARY KEY (`id`);
