/*
  Warnings:

  - You are about to drop the column `sgkFileURL` on the `letterrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `internshipform` ADD COLUMN `sgkFileURL` VARCHAR(255) NULL,
    ADD COLUMN `sgkStatus` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `letterrequest` DROP COLUMN `sgkFileURL`;
