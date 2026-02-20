/*
  Warnings:

  - You are about to drop the column `instructor` on the `course_offerings` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `courses` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `courses_code_key` ON `courses`;

-- AlterTable
ALTER TABLE `course_offerings` DROP COLUMN `instructor`,
    ADD COLUMN `instructorEn` VARCHAR(255) NULL,
    ADD COLUMN `instructorTh` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `code`;

-- AlterTable
ALTER TABLE `exams` ADD COLUMN `proctor` TEXT NULL;
