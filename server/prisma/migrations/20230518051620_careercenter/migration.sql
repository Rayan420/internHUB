/*
  Warnings:

  - You are about to drop the column `comantName` on the `careercenter` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `CareerCenter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `careercenter` DROP COLUMN `comantName`,
    ADD COLUMN `companyName` VARCHAR(191) NOT NULL;
