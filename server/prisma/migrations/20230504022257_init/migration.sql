-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` TEXT NOT NULL,
    `refresh_token` VARCHAR(255) NULL,

    UNIQUE INDEX `users_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
