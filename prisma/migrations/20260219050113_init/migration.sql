-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `image` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` VARCHAR(30) NOT NULL,
    `code` VARCHAR(32) NOT NULL,
    `title_th` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NULL,

    UNIQUE INDEX `courses_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_offerings` (
    `id` VARCHAR(30) NOT NULL,
    `course_id` VARCHAR(30) NOT NULL,
    `section` VARCHAR(32) NOT NULL,
    `instructor` VARCHAR(255) NULL,
    `section_type` VARCHAR(32) NULL,
    `credits` DECIMAL(4, 1) NOT NULL DEFAULT 3.0,

    UNIQUE INDEX `uq_offering_course_section`(`course_id`, `section`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_courses` (
    `user_id` VARCHAR(255) NOT NULL,
    `offering_id` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_user_courses_offering`(`offering_id`),
    PRIMARY KEY (`user_id`, `offering_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `id` VARCHAR(30) NOT NULL,
    `offering_id` VARCHAR(30) NOT NULL,
    `exam_type` VARCHAR(16) NOT NULL,
    `exam_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `building` VARCHAR(255) NULL,
    `room` VARCHAR(255) NULL,
    `note` TEXT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_exam_date`(`exam_date`),
    INDEX `idx_exam_offering`(`offering_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `user_id` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,
    `id_token` TEXT NULL,
    `access_token_expires_at` DATETIME(3) NULL,
    `refresh_token_expires_at` DATETIME(3) NULL,
    `scope` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course_offerings` ADD CONSTRAINT `course_offerings_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_courses` ADD CONSTRAINT `user_courses_offering_id_fkey` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_offering_id_fkey` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
