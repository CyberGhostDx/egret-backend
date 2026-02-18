-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(30) NOT NULL,
    `google_sub` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `picture_url` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_google_sub_key`(`google_sub`),
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
    `course_id` VARCHAR(191) NOT NULL,
    `section` VARCHAR(32) NOT NULL,
    `instructor` VARCHAR(255) NULL,
    `section_type` VARCHAR(32) NULL,

    UNIQUE INDEX `uq_offering_course_section`(`course_id`, `section`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_courses` (
    `user_id` VARCHAR(191) NOT NULL,
    `offering_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_user_courses_offering`(`offering_id`),
    PRIMARY KEY (`user_id`, `offering_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `id` VARCHAR(30) NOT NULL,
    `offering_id` VARCHAR(191) NOT NULL,
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
CREATE TABLE `auth_sessions` (
    `id` VARCHAR(30) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revoked_at` DATETIME(3) NULL,

    INDEX `idx_sessions_user`(`user_id`),
    INDEX `idx_sessions_revoked`(`revoked_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(30) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,

    UNIQUE INDEX `refresh_tokens_token_hash_key`(`token_hash`),
    INDEX `idx_refresh_session`(`session_id`),
    INDEX `idx_refresh_expires`(`expires_at`),
    INDEX `idx_refresh_revoked`(`revoked_at`),
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
ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `auth_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
