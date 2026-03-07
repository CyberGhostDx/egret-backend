/*
  Warnings:

  - You are about to drop the column `instructorEn` on the `course_offerings` table. All the data in the column will be lost.
  - You are about to drop the column `instructorTh` on the `course_offerings` table. All the data in the column will be lost.
  - You are about to drop the column `proctor` on the `exams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `course_offerings` DROP COLUMN `instructorEn`,
    DROP COLUMN `instructorTh`;

-- AlterTable
ALTER TABLE `exams` DROP COLUMN `proctor`;

-- CreateTable
CREATE TABLE `instructors` (
    `id` VARCHAR(30) NOT NULL,
    `name_th` VARCHAR(255) NULL,
    `name_en` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_offering_instructors` (
    `offering_id` VARCHAR(30) NOT NULL,
    `instructor_id` VARCHAR(30) NOT NULL,

    INDEX `idx_offering_instructor_instructor`(`instructor_id`),
    PRIMARY KEY (`offering_id`, `instructor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course_offering_instructors` ADD CONSTRAINT `course_offering_instructors_offering_id_fkey` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_offering_instructors` ADD CONSTRAINT `course_offering_instructors_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
