/*
  Warnings:

  - Added the required column `comantName` to the `CareerCenter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `careercenter` ADD COLUMN `comantName` VARCHAR(191) NOT NULL;
